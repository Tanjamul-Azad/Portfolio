import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function loadModule(file, dependencies = {}, globals = {}) {
  const source = fs.readFileSync(new URL(file, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 },
  });
  const context = {
    exports: {}, URL, AbortSignal, process: { env: {} },
    require: (name) => {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    ...globals,
  };
  vm.runInNewContext(outputText, context);
  return context.exports;
}

const parser = loadModule("../src/lib/github-contributions.ts");
function route(fetch) {
  return loadModule("../src/app/api/github/route.ts", {
    "next/server": { NextResponse: { json: (data, options) => Response.json(data, options) } },
    "@/config": { siteConfig: { links: { github: "https://github.com/Tanjamul-Azad" } } },
    "@/lib/github-contributions": parser,
  }, { fetch });
}

function calendar(count) {
  return new Response(`<td id="today" data-date="2026-10-17" data-level="2"></td><tool-tip for="today">${count} contributions on October 17th.</tool-tip>`);
}

test("consecutive requests read new contributions and prohibit browser/CDN caching", async () => {
  let count = 662;
  const calendarRequests = [];
  const api = route(async (url, options) => {
    if (url.startsWith("https://api.github.com/")) return Response.json({ public_repos: 33 });
    calendarRequests.push(options);
    return calendar(count);
  });
  assert.equal(api.revalidate, 0);
  const first = await api.GET();
  assert.equal((await first.json()).calendar.total, 662);
  count = 663;
  const second = await api.GET();
  assert.equal((await second.json()).calendar.total, 663);
  assert.equal(calendarRequests.length, 2);
  for (const options of calendarRequests) assert.equal(options.cache, "no-store");
  for (const response of [first, second]) {
    assert.match(response.headers.get("Cache-Control"), /no-store/);
    assert.equal(response.headers.get("CDN-Cache-Control"), "no-store");
    assert.equal(response.headers.get("Vercel-CDN-Cache-Control"), "no-store");
  }
});

test("a REST rate limit does not prevent fresh contributions from being returned", async () => {
  const api = route(async (url) => url.startsWith("https://api.github.com/")
    ? new Response("Rate limited", { status: 403 }) : calendar(662));
  const response = await api.GET();
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.calendar.total, 662);
  assert.equal(data.repositories, null);
});

test("an upstream outage returns an uncached error, never a false zero", async () => {
  const api = route(async () => new Response("Unavailable", { status: 503 }));
  const response = await api.GET();
  assert.equal(response.status, 503);
  assert.match(response.headers.get("Cache-Control"), /no-store/);
  assert.equal((await response.json()).error, "GitHub activity is temporarily unavailable");
});
