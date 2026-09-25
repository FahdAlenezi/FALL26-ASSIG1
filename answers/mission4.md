# Mission 4: Report it and brief the owner

## Commit history

Output of `git log --oneline`:

```
1ab6c2c Complete mission 3 cover-up
52dfc78 Complete mission 2 attack
6e8dfc2 Complete mission 1 validation
f0a9142 Complete mission 0 answers
ba71c7c Ignore node modules
d890ff1 first push with the assignment files
294714d Initial commit
```

Pick your **best** commit message and your **worst** one. Which of the 7 rules does the worst one break?

 > My best commit message is "Complete mission 3 cover-up" because it is clear and short. My worst commit message is "Complete mission 0 answers" because it does not explain much about the change. It does not clearly follow rule 7 because there is no body explaining what changed and why.
## Pull Request

PR link, inside your fork:

> https://github.com/...

## Creating value: the risk brief

The Operations Manager who owns the portal is not a developer. Write a brief of **120 to 180 words** addressed to them. It must answer:

1. What you proved, in terms of **impact** on operators and on the campus, not in terms of code.
2. Why "it uses HTTPS and validates its data" did **not** protect them.
3. The single most important change the backend team must make, stated concretely.
4. One honest limit of your engagement: what you did **not** test.

> > Dear Operations Manager,

> This assessment showed that an attacker running code in an operator’s browser could hide real service problems and make the portal show everything as healthy. That could cause operators to miss an outage, delay their response, and affect campus services that depend on the portal.

> HTTPS and data validation did not stop this because HTTPS protects data while it travels over the network, and validation only checks whether the data has the expected format. If the browser is already running attacker-controlled code, the attacker can change what the portal sees before it is displayed.

> The most important change is to enforce security decisions on the backend. The server should verify the user’s permission and the real service state before allowing sensitive actions or trusting status information.

> One limit of this assessment is that I only tested the provided local course portal. I did not test real campus systems, production accounts, or other applications.

## Reflection

In one or two sentences: which concept from Units 1.1 to 1.3 do you understand much better now, and what made it click?

> I understand client-side security much better now. Mission 3 made it clear to me that the browser cannot always be trusted because code running in the page can change functions like fetch and change what the user sees.
