// =====================================================================
// MISSION 1 CASE: "Is this ticket valid?"  Run with:  node examples/m1_case.js
// =====================================================================
// A helpdesk tool receives ticket objects as JSON. A Python developer wrote
// the check below, then translated it "line by line" to JavaScript.
//
// Python original:
//
//   def is_valid_ticket(t):
//       return isinstance(t, dict) and t.get("priority") in (1, 2, 3) and bool(t.get("assigned"))
//
// ---------------------------------------------------------------------
// Naive JavaScript translation. It LOOKS equivalent. It is not.
// ---------------------------------------------------------------------
function isValidTicketNaive(t) {
  return t && (t.priority == 1 || t.priority == 2 || t.priority == 3) && t.assigned;
}

// ---------------------------------------------------------------------
// Defensive JavaScript version
// ---------------------------------------------------------------------
const ALLOWED_PRIORITIES = [1, 2, 3];

function isValidTicketSafe(t) {
  // 1. Type check first. typeof null is "object" in JS, and arrays are objects too.
  if (t === null || typeof t !== "object" || Array.isArray(t)) return false;

  // 2. includes() uses strict comparison, so "1" will not match 1.
  if (!ALLOWED_PRIORITIES.includes(t.priority)) return false;

  // 3. Require a REAL boolean. Do not rely on truthy/falsy.
  if (typeof t.assigned !== "boolean") return false;

  return t.assigned === true;
}

// ---------------------------------------------------------------------
// Compare them on tricky inputs
// ---------------------------------------------------------------------
const inputs = [
  { label: "normal ticket",          value: { priority: 2, assigned: true } },
  { label: "priority as string '1'", value: { priority: "1", assigned: true } },
  { label: "priority as [3]",        value: { priority: [3], assigned: true } },
  { label: "assigned as 'false'",    value: { priority: 1, assigned: "false" } },
  { label: "array instead of object",value: [1, 2, 3] },
  { label: "null",                   value: null }
];

for (const { label, value } of inputs) {
  const naive = Boolean(isValidTicketNaive(value));
  const safe = isValidTicketSafe(value);
  const flag = naive !== safe ? "   <-- DIFFERENT" : "";
  console.log(`${label.padEnd(26)} naive=${String(naive).padEnd(5)} safe=${safe}${flag}`);
}

// Things to notice:
//  - "1" == 1 is true, and even [3] == 3 is true, because == coerces types.
//  - The string "false" is truthy. Only false, 0, "", null, undefined and NaN are falsy.
//  - In Python, isinstance(t, dict) rejects lists. In JS you must ask Array.isArray().
