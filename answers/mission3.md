# Mission 3: Console attack, forge the status feed

## Before: an honest Refresh

Real feed, some services not up, 7 rejected:

![honest feed](img/m3-before.png)

## After: my cover-up

Every service UP / ONLINE, 0 rejected:

![forged feed](img/m3-after.png)

Portal still shows everything up during a simulated HTTP 503 outage:

![green during outage](img/m3-outage.png)

## My attack script

Paste the full contents of `attacks/m3_coverup.js`:

```js
// paste here
```

## Questions

1. Can `window.fetch` be replaced by code running in the page? How did you confirm it, and why does that break every client-side security assumption?

   > your answer

2. The real feed contains a `null` entry and other junk. What did your `map` do so it would not crash on those, and still produce a report that passes the portal's validator?

   > your answer

3. The portal used `textContent` and validated its data, yet you still fooled it. Name the single assumption the portal made that was false.

   > your answer

## Async order: predict, then verify

**My prediction, written before running anything:**

> Does `await realFetch(...)` finish before or after `loadStatus` hands control back to the click handler? My guess: ...

**What the console actually showed:**

```
paste here
```

**Explanation, using single-threaded, non-blocking, and event loop:**

> your answer

## Stretch goal, optional

> Leave empty if not attempted.

## Documentation log

| Page I used, with URL | One thing I learned from it |
|---|---|
| | |
