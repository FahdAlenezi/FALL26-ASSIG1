# Mission 1: Python habits that break JavaScript security

## Evidence

Output of `npm run test:m1`, pasted or as a screenshot in `img/`:

```
paste here
```

## Connections: Python to JavaScript

For each check you implemented, write how you would do it in Python and how you did it in JavaScript.

| Rule | Python | JavaScript, as in my code |
|---|---|---|
| raw is a dictionary or object, not a list | `isinstance(raw, dict)` | |
| name is a non-empty string after trimming | | |
| status is one of the allowed values | | |
| online is a real boolean | | |
| latencyMs is a finite number ≥ 0 | | |
| invalid JSON does not crash the program | | |

## Questions

1. Why is `latencyMs: 0` a trap for code such as `if (!raw.latencyMs) return null;`?

   > your answer

2. Your function builds a **new** object and ignores fields like `isAdmin`. Describe in two or three sentences what could go wrong later in an application that copied **every** field it received.

   > your answer

## Documentation log

| Page I used, with URL | One thing I learned from it |
|---|---|
| | |
