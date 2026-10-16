import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = fs.readFileSync(new URL("../src/lib/github-contributions.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } });
const context = { exports: {} };
vm.runInNewContext(outputText, context);
const parse = (html) => JSON.parse(JSON.stringify(context.exports.parseContributionCalendar(html)));

test("reads GitHub's row-major calendar in chronological order with exact daily counts", () => {
  const calendar = parse(`
    <td data-date="2026-10-11" id="sunday" data-level="0"></td>
    <td data-level="4" id="next-sunday" data-date="2026-10-18"></td>
    <td id="monday" data-date="2026-10-12" data-level="1"></td>
    <tool-tip for="sunday">No contributions on October 11th.</tool-tip>
    <tool-tip data-type="label" for="next-sunday">1,234 contributions on October 18th.</tool-tip>
    <tool-tip for="monday"><span>1 contribution on October 12th.</span></tool-tip>
  `);
  assert.deepEqual(calendar, {
    days: [
      { date: "2026-10-11", count: 0, level: 0 },
      { date: "2026-10-12", count: 1, level: 1 },
      { date: "2026-10-18", count: 1234, level: 4 },
    ],
    total: 1235,
  });
});

test("treats a real zero-activity calendar as valid", () => {
  assert.equal(parse('<td data-date="2026-10-11" id="zero" data-level="0"></td><tool-tip for="zero">No contributions on October 11th.</tool-tip>').total, 0);
});

test("rejects upstream error pages instead of displaying fabricated zero activity", () => {
  assert.throws(() => parse("<html>Rate limit exceeded</html>"), /unavailable/);
});

test("rejects missing counts and out-of-range color levels when markup changes", () => {
  assert.throws(() => parse('<td data-date="2026-10-11" id="missing" data-level="2"></td>'), /format changed/);
  assert.throws(() => parse('<td data-date="2026-10-11" id="bad" data-level="9"></td><tool-tip for="bad">1 contribution on October 11th.</tool-tip>'), /format changed/);
});
