// Exercise privacy boundaries without contacting Google or loading a browser.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/telemetry.ts", import.meta.url), "utf8")
  .replace('import settings from "@/content/analytics.json";', 'const settings = { measurementId: "G-TEST123456" };');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
let choice = null;
const sent = [];
const sandbox = {
  exports: {}, navigator: { doNotTrack: "0", globalPrivacyControl: false },
  localStorage: { getItem: () => choice },
  window: {
    location: { origin: "https://tanzamul.dev", pathname: "/blog/example", search: "?email=private@example.com", hash: "#private" },
    portfolioAnalyticsReady: true,
    gtag: (...args) => sent.push(args),
  },
};
vm.runInNewContext(compiled, sandbox);
const { analyticsAllowed, trackEvent } = sandbox.exports;
trackEvent("article_open");
assert.equal(sent.length, 0, "No analytics before consent");
choice = "denied";
assert.equal(analyticsAllowed(), false);
choice = "granted";
sandbox.navigator.doNotTrack = "1";
assert.equal(analyticsAllowed(), false, "Respect Do Not Track");
sandbox.navigator.doNotTrack = "0";
sandbox.navigator.globalPrivacyControl = true;
assert.equal(analyticsAllowed(), false, "Respect Global Privacy Control");
sandbox.navigator.globalPrivacyControl = false;
sandbox.window.location.pathname = "/admin/content";
assert.equal(analyticsAllowed(), false, "Do not track admin pages");
sandbox.window.location.pathname = "/blog/example";
sandbox.window.portfolioAnalyticsReady = false;
trackEvent("article_open");
assert.equal(sent.length, 0, "Do not send before initialization");
sandbox.window.portfolioAnalyticsReady = true;
trackEvent("article_open", { article_slug: "example", email: "private@example.com", message: "secret", value: null });
assert.equal(sent.length, 1);
assert.equal(sent[0][0], "event");
assert.equal(sent[0][2].page_location, "https://tanzamul.dev/blog/example");
assert.equal(sent[0][2].article_slug, "example");
assert.equal("email" in sent[0][2], false);
assert.equal("message" in sent[0][2], false);
assert.equal("value" in sent[0][2], false);
trackEvent("invalid event name");
assert.equal(sent.length, 1, "Reject invalid event names");
choice = "denied";
trackEvent("article_open");
assert.equal(sent.length, 1, "Stop immediately after consent is revoked");
sandbox.localStorage.getItem = () => { throw new Error("Storage unavailable"); };
assert.equal(analyticsAllowed(), false, "Storage failures default to no analytics");
sandbox.window = undefined;
assert.equal(analyticsAllowed(), false, "Safe during server rendering");
console.log("Telemetry privacy checks passed: consent, browser preferences, admin exclusion, revocation, payload filtering, clean URLs and SSR.");
