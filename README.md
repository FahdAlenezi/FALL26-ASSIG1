# CYSE 411 Assignment 1: Attacking the Secure Status Portal

**Units covered:** 1.1 Foundations of GitHub, 1.2 JavaScript Fundamentals for Python Developers, 1.3 JavaScript in the Web Context

**Planned effort:** 1 h 50 min. The class session is longer, so you have a buffer.

**Delivery:** a Pull Request inside **your fork**, with your attack scripts and your answers in `answers/`.

---

## The story

The Campus Operations Center runs a small web app, the **Secure Status Portal**. Operators use it to clear incident queues and to watch whether campus services are up.

You are on a red team. Your engagement rule is realistic and specific:

> **Assume the attacker already has code execution inside the operator's authenticated browser session.**

How would that happen in real life? A cross-site scripting flaw, a malicious browser extension, a compromised third-party script loaded by the page, or simply an operator who walked away from an unlocked workstation. In every one of those cases, attacker JavaScript runs **in the page, with the operator's session**. The **DevTools Console** is the perfect, honest simulator for that position: code you type there runs exactly where an XSS payload would run.

Your job is to show, concretely, that **the frontend enforces nothing**. Everything the portal "protects" on the client, you can undo from the Console.

You will **not** edit the portal's own files in Missions 2 and 3. You edit only files under `attacks/`, then paste them into the Console. This mirrors the attacker model: you do not get to change the server's code, you only get to run script in the victim's browser.

## Documentation first: use the "man pages" of the web

`man git-commit` gives the manual of a command. For the web, the equivalent is **MDN Web Docs**. You are expected to look things up. Every answer file has a **Documentation log** where you record the pages you actually used and one thing you learned from each.

- MDN JavaScript reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
- MDN DOM API: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
- MDN Events: https://developer.mozilla.org/en-US/docs/Web/Events
- MDN EventTarget.removeEventListener: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
- MDN fetch: https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
- MDN Response: https://developer.mozilla.org/en-US/docs/Web/API/Response
- W3Schools DOM, as used in class: https://www.w3schools.com/js/js_htmldom.asp
- Git manual: https://git-scm.com/docs, or `git help <command>`

Use AI assistants only the way you would use a classmate: to ask about a concept. The code and explanations you submit must be yours, and you must be able to explain every line during class.

---

## Suggested timeline

| Mission | Topic | Unit | Time |
|---|---|---|---|
| 0 | Fork, clone, branch, `.gitignore` | 1.1 | 10 min |
| 1 | Defensive validation in JavaScript | 1.2 | 20 min |
| 2 | Console attack: sabotage the purge button | 1.3 DOM and events | 35 min |
| 3 | Console attack: forge the status feed | 1.3 JSON, fetch, async | 30 min |
| 4 | Commits, Pull Request and risk brief | 1.1 | 15 min |
| | **Total** | | **1 h 50 min** |

Run the portal once before you start:

```bash
npm install
npm start
```

Open http://localhost:3000. Open DevTools with **F12** and select the **Console** tab. Keep it open for the whole assignment.

---

## Mission 0: Get the code, the professional way

**Unit 1.1**

### The case

A fork is your own copy of a repository on GitHub. You clone the fork, work on a branch, and later open a Pull Request. Same GitHub Flow you practiced with `hello-world`, now with real code.

### Your challenge

1. Click **Fork** on this repository. Keep the same name.
2. Clone **your fork**, not the original:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```
3. Create and switch to a branch called `assignment1`. All work goes there, never on `main`.
4. Run `npm install`, then `git status`. A folder appears that should **never** be committed. The `.gitignore` in this repo is incomplete on purpose. Fix it so `git status` is clean again, then commit only that `.gitignore` change with a good message.

   Use the docs: which folder is it, why should it not be committed, and what does a trailing `/` mean in a `.gitignore` pattern?

### Evidence, in `answers/mission0.md`
- Output of `git remote -v` and `git branch`
- `git status` **before** and **after** your `.gitignore` fix
- Answers to the questions in the file

---

## Mission 1: Python habits that break JavaScript security

**Unit 1.2**

### The case

Run it and read it:

```bash
node examples/m1_case.js
```

A Python developer translated a ticket validator "line by line". The naive version accepts `"1"` as `1`, accepts `[3]` as `3`, and treats the string `"false"` as true. The safe version fixes this with three habits: check the type first (`typeof null` is `"object"`, and arrays are objects, so use `Array.isArray()`), compare strictly (`===`, `includes()`), and never trust truthy or falsy for a security decision.

### Your challenge

This is the one place you write **defensive** code, because you need it as a weapon later. In Mission 3 the portal validates its data with a function that has the **same contract** as yours. To forge data that slips through, you must first understand exactly what a correct validator accepts and rejects.

Open `public/js/validator.js` and implement `normalizeService(raw)` and `parseStatusReport(jsonText)`. The rules are in the file comments. Two traps: `latencyMs: 0` is **valid** even though `0` is falsy, and extra fields such as `isAdmin` must **not** be copied into your result.

Test:

```bash
npm run test:m1
```

All 24 tests must pass. Commit when they do.

### Evidence, in `answers/mission1.md`
- Output of `npm run test:m1`, all passing
- The Python-to-JavaScript **Connections** table
- Both questions answered
- Documentation log

---

## Mission 2: Console attack, sabotage the purge button

**Unit 1.3: DOM and event-driven programming**

### The case

Do this by hand in the Console first, so you understand each primitive:

1. Load http://localhost:3000. In the Console, grab the button:
   ```js
   const b = document.getElementById("purge-btn");
   ```
2. Replace it with a clone. This is the slide 21 technique: `cloneNode(true)` copies the element but **not** its event listeners.
   ```js
   b.replaceWith(b.cloneNode(true));
   ```
   Click the button now. Nothing happens. From the operator's chair the button looks perfectly normal, yet the click handler is gone. You just proved that a listener is not a lock.

Now build a full, self-contained attack.

### Your challenge

You represent malware running in the operator's session. Management believed that making the purge button "hard to misclick" was a safety feature. Your attack turns that same DOM control against the operator: the button becomes impossible to use, while still looking present. Write it in `attacks/m2_runaway.js`, then paste the whole file into the Console.

| Req. | Description |
|---|---|
| **R1** | Remove the portal's legitimate click handler, so a normal click never purges. Use the clone technique, do not reload the page. |
| **R2** | Block keyboard users too. A real operator might Tab to the button and press Enter. Stop that. |
| **R3** | Make the button jump to a random position, fully **inside** `#danger-zone`, whenever the pointer approaches, and never overlap its previous spot. |
| **R4** | The portal never had a dodge counter. **Create one as a new DOM element** and keep it updated with `textContent`. This shows an attacker can add UI, not only remove it. |
| **R5** | **Creative twist:** one behavior of your own design. A taunting label, a color change, the zone shrinking, whatever fits. Describe it in your answer. |

Things to look up on MDN: which pointer or mouse event fires when the pointer **enters** an element, how to read an element's size with `offsetWidth` / `clientWidth`, `Math.random()`, `element.style.left`, `document.createElement`, and how `tabindex` affects keyboard focus.

### Prove it, then think like a defender

- Paste your script, then show the button dodging and the legitimate click doing nothing.
- Answer: the operator's session was never in danger from a **mouse** problem. The real danger was that your code ran in the page at all. If "Purge All Incidents" were a real, destructive action, where must the actual protection live, and what should the server check on every purge request? Relate it to the Unit 1.3 takeaway "Real security enforcement must occur server-side."

### Evidence, in `answers/mission2.md`
- Two screenshots of the button in different positions, plus your new counter visible
- Screenshot showing the click log still says "No purge requested" after you click
- Your full `attacks/m2_runaway.js`, with one sentence per block
- Your creative twist and why you chose it
- The defender answer above
- Documentation log

---

## Mission 3: Console attack, forge the status feed

**Unit 1.3: JSON, fetch, promises, async/await**

### The case

Open `public/js/status.js` and read it. Notice something uncomfortable: **this code is well written**. It uses `async`/`await`, checks `res.ok`, validates every entry with a Mission 1 style validator, and renders with `textContent`, so it is not even vulnerable to the injected service name. And yet it is completely defenseless against you, because you run **inside the page**.

Now run the worked example. Copy the whole file `examples/m3_case_fetch_spy.js`, paste it into the Console, press Enter, then click Refresh and the two Simulate buttons.

```
examples/m3_case_fetch_spy.js
```

What it shows: `window.fetch` is just a property of `window`. Any code in the page can **replace** it, a trick called monkey patching. The spy keeps a reference to the real `fetch`, wraps it in an `async` function so it still returns a Promise, and reads a **clone** of the response so the page can still read the original. The spy only watches. Your attack will make it **lie**.

### Your challenge

An operator relies on this portal to notice outages. Your malware makes the portal cheerful no matter what is actually happening on the network. Write it in `attacks/m3_coverup.js`, then paste it into the Console and click Refresh.

| Req. | Description |
|---|---|
| **R1** | Replace `window.fetch`. Requests that are not `/api/status` must pass through to the real `fetch` untouched. |
| **R2** | For `/api/status`, read the real response, then return a **forged** `Response` in which every service is `status: "up"` and `online: true`. Look up the `Response` constructor and how to set its status and `Content-Type`. |
| **R3** | Your forged body must **pass the portal's own validator**, so "Rejected entries" shows **0**. This is where your Mission 1 knowledge pays off: build entries that are valid by the same rules you implemented. Beware the real feed contains a `null` entry and other junk; your `map` must not crash on it. |
| **R4** | Robustness: when the real server returns an outage (HTTP 503) or a broken non-JSON body, keep showing the last forged "all up" report, so the operator never sees red. |
| **R5** | Leave an escape hatch: `window.__restoreFetch()` puts the real `fetch` back. A careful attacker cleans up. |

Verify: after your attack, click Refresh and every service reads UP / ONLINE with 0 rejected. Then click **Simulate outage (HTTP 503)**. The portal must **still** show all services up. That is the whole point.

### Async order, predict then verify

The real `fetch` is asynchronous, and so is your replacement. In your answer, before running anything, predict this: when the page calls your forged `fetch`, does your `await realFetch(...)` line finish before or after `loadStatus` returns control to the click handler? Then add a couple of `console.log` lines to check, and explain the result in two or three sentences using the words **single-threaded**, **non-blocking**, and **event loop**.

### Evidence, in `answers/mission3.md`
- Screenshot **before**: an honest Refresh, showing the real feed with some services not up and 7 rejected
- Screenshot **after** your attack: all services up, 0 rejected
- Screenshot of the portal **still green during a simulated 503**
- Your full `attacks/m3_coverup.js`
- Your async prediction, the real console output, and your explanation
- Answer: why did `textContent` and server-side-looking validation fail to stop you? Name the one assumption the portal made that was false.
- Documentation log

---

## Mission 4: Report it and brief the owner

1. Ensure **at least one commit per mission**, messages following the 7 rules from Unit 1.1. Paste `git log --oneline` into `answers/mission4.md`.
2. Write the **risk brief** requested in `answers/mission4.md`.
3. Push your branch:
   ```bash
   git push -u origin assignment1
   ```
4. On GitHub, open a Pull Request **inside your fork**: base `main` ← compare `assignment1`.

   ⚠️ By default GitHub proposes the **original course repository** as the base. Change the base repository to **your fork** before creating the PR. Do not open a PR against the course repository.
5. Give the PR a clear title and a checklist of completed missions. **Do not merge.** Submit the PR link on Canvas.

---

## Submission checklist

- [ ] Work is on branch `assignment1` in my fork
- [ ] `.gitignore` fixed, `node_modules` never committed
- [ ] `npm run test:m1` passes 24/24
- [ ] `attacks/m2_runaway.js` sabotages the button and adds my counter
- [ ] `attacks/m3_coverup.js` forges an all-up feed with 0 rejected, and survives a 503
- [ ] All five files in `answers/` complete, screenshots in `answers/img/`
- [ ] Commit messages follow the 7 rules
- [ ] PR opened inside my fork, not merged, link on Canvas

**Images in Markdown:** save screenshots in `answers/img/` and reference them as `![after attack](img/m3-after.png)`. Confirm they display on GitHub.

---

## Stretch goal, optional, +5 bonus

Extend `attacks/m3_coverup.js` so it not only forges the feed but also **suppresses the operator's ability to notice**: hide the "Simulate outage" and "Simulate broken proxy" buttons from the DOM, and every 15 seconds silently re-trigger a Refresh so the screen stays green without the operator touching anything. Look up `setInterval` and `element.remove()`. In `answers/mission3.md`, explain in two or three sentences why an attacker who can persist beats one who acts once, and what a server-side monitor would catch that this operator's browser never will.
