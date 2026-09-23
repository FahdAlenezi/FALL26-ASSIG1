// =====================================================================
// MISSION 3 CASE: a fetch spy, pasted into the Console
// =====================================================================
// 1. Open http://localhost:3000 and open DevTools with F12.
// 2. Copy this whole file, paste it into the Console, press Enter.
// 3. Click Refresh, then the two "Simulate" buttons. Watch the Console.
//
// What is going on:
//
//  - window.fetch is just a property of the window object. Any code running
//    in the page, including an attacker's, can REPLACE it. This is called
//    monkey patching.
//  - We keep a reference to the real function first, so we can still use it.
//  - Our replacement is an async function, so it returns a Promise, exactly
//    like the real fetch. The page cannot tell the difference.
//  - A Response body can be read only ONCE. If the spy read it, the page
//    would fail. So the spy reads a CLONE and returns the original untouched.
//
// This spy only WATCHES. In your challenge you will make it LIE.
// =====================================================================

(() => {
  const realFetch = window.fetch;

  window.fetch = async (input, init) => {
    console.log("[spy] request ->", input);

    const res = await realFetch(input, init);   // wait for the real network response

    const copy = res.clone();                    // read the copy, never the original
    copy.text().then(body => {
      console.log("[spy] response <-", res.status, body.slice(0, 120) + "...");
    });

    return res;                                  // the page receives the real response
  };

  console.log("[spy] installed. Click Refresh.");
})();

// To remove the spy, simply reload the page. Ask yourself why that works.
