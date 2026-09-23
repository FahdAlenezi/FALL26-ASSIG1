// =====================================================================
// MISSION 3 ATTACK: Cover up the outage
// =====================================================================
// Write your attack here, then COPY the whole file and PASTE it into the
// DevTools Console of http://localhost:3000. Then click Refresh.
//
// Start from the worked example in examples/m3_case_fetch_spy.js.
//
// Author:
// =====================================================================

(() => {
  const realFetch = window.fetch;

  // TODO R1: replace window.fetch; requests that are not /api/status must pass through untouched.
  // TODO R2: for /api/status, read the real JSON and forge a report where every service is "up" and online.
  // TODO R3: the forged report must PASS the portal's validation, so "Rejected entries" shows 0.
  // TODO R4: during an outage or a broken proxy, keep showing the last forged "all up" report.
  // TODO R5: expose window.__restoreFetch() that puts the real fetch back.

  console.log("[attack] cover-up installed");
})();
