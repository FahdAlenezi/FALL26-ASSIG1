// Mission 1 self-check. Run with:  npm run test:m1
// No test framework needed, only Node's built-in assert module.

const assert = require("node:assert/strict");
const { normalizeService, parseStatusReport } = require("../public/js/validator.js");

let passed = 0;
let failed = 0;

function check(description, fn) {
  try {
    fn();
    passed++;
    console.log("  PASS  " + description);
  } catch (err) {
    failed++;
    console.log("  FAIL  " + description);
    console.log("        " + err.message.split("\n")[0]);
  }
}

const good = { name: "  Patriot Web  ", status: "up", online: true, latencyMs: 120 };

console.log("\nnormalizeService()");
check("valid entry is normalized and the name is trimmed", () =>
  assert.deepEqual(normalizeService(good), { name: "Patriot Web", status: "up", online: true, latencyMs: 120 }));
check("returns a NEW object, not the same reference", () =>
  assert.notEqual(normalizeService(good), good));
check("extra fields such as isAdmin are dropped", () =>
  assert.deepEqual(normalizeService({ ...good, isAdmin: true }),
    { name: "Patriot Web", status: "up", online: true, latencyMs: 120 }));
check("null is rejected", () => assert.equal(normalizeService(null), null));
check("an array is rejected", () => assert.equal(normalizeService([good]), null));
check("a string is rejected", () => assert.equal(normalizeService("Patriot Web"), null));
check("blank name is rejected", () => assert.equal(normalizeService({ ...good, name: "   " }), null));
check("name longer than 64 chars is rejected", () =>
  assert.equal(normalizeService({ ...good, name: "x".repeat(65) }), null));
check("name that is not a string is rejected", () =>
  assert.equal(normalizeService({ ...good, name: 42 }), null));
check("status 'UP' is rejected (case matters)", () =>
  assert.equal(normalizeService({ ...good, status: "UP" }), null));
check("unknown status is rejected", () =>
  assert.equal(normalizeService({ ...good, status: "unknown" }), null));
check("online: \"false\" (string) is rejected", () =>
  assert.equal(normalizeService({ ...good, online: "false" }), null));
check("online: 0 is rejected", () =>
  assert.equal(normalizeService({ ...good, online: 0 }), null));
check("online: false (boolean) is accepted", () =>
  assert.equal(normalizeService({ ...good, online: false }).online, false));
check("latencyMs: \"120\" (string) is rejected", () =>
  assert.equal(normalizeService({ ...good, latencyMs: "120" }), null));
check("negative latency is rejected", () =>
  assert.equal(normalizeService({ ...good, latencyMs: -5 }), null));
check("Infinity latency is rejected", () =>
  assert.equal(normalizeService({ ...good, latencyMs: Infinity }), null));
check("latencyMs: 0 is accepted (0 is falsy but valid!)", () =>
  assert.equal(normalizeService({ ...good, latencyMs: 0 }).latencyMs, 0));
check("missing latencyMs is rejected", () => {
  const { latencyMs, ...noLatency } = good;
  assert.equal(normalizeService(noLatency), null);
});

console.log("\nparseStatusReport()");
check("invalid JSON fails safe", () =>
  assert.deepEqual(parseStatusReport("<html>oops</html>"), { services: [], rejected: 0, error: "invalid report" }));
check("missing services array fails safe", () =>
  assert.deepEqual(parseStatusReport('{"error":"maintenance"}'), { services: [], rejected: 0, error: "invalid report" }));
check("services that is not an array fails safe", () =>
  assert.deepEqual(parseStatusReport('{"services":"all good"}'), { services: [], rejected: 0, error: "invalid report" }));
check("JSON null fails safe", () =>
  assert.deepEqual(parseStatusReport("null"), { services: [], rejected: 0, error: "invalid report" }));
check("mixed report keeps valid entries and counts rejected ones", () => {
  const text = JSON.stringify({
    services: [
      { name: "A", status: "up", online: true, latencyMs: 1 },
      { name: "B", status: "UP", online: true, latencyMs: 1 },
      null,
      { name: "C", status: "down", online: false, latencyMs: 0 }
    ]
  });
  const result = parseStatusReport(text);
  assert.equal(result.error, null);
  assert.equal(result.rejected, 2);
  assert.deepEqual(result.services.map(s => s.name), ["A", "C"]);
});

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exitCode = failed === 0 ? 0 : 1;
