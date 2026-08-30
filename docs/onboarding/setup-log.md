# PREIshare setup log

**Learner:** Sydni (GitHub username: `Sjwarner516`)
**Date:** 2026-08-30
**OS:** Ubuntu 24.04.4 LTS (Noble Numbat), Linux `x86_64` (`uname`: `Linux cursor 6.12.94+`)
**Git:** `/usr/bin/git` — see section 2 for `git --version`
**Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
**My fork (origin):** https://github.com/Sjwarner516/PREIShare-org-repo
**Orientation notes used:** `docs/onboarding/team-orientation-notes.md`
**Machine:** Cursor Cloud Agent VM (`hostname`: `cursor`). Commands below were run in this environment’s terminal.

> Rule for this log: every PASS/FAIL is from a command that was actually run,
> or from a GitHub page the learner captured. Successful-looking output is not
> invented. Secrets (passwords, tokens, private keys) are omitted.

## Checklist

| # | Check | Result |
| --- | --- | --- |
| 1 | Official team repo URL loads and name matches | PASS |
| 2 | GitHub sign-in in a browser (account that owns the fork) | PASS |
| 3 | Fork created in my GitHub account | PASS |
| 4 | Git is installed | PASS |
| 5 | Local Git `user.name` and `user.email` set | PASS |
| 6 | Parent `projects` folder created | PASS |
| 7 | Cloned **my fork** (origin is not the team repo) | PASS |
| 8 | `upstream` remote points at the team repo | PASS |
| 9 | `git remote -v` shows four correct lines (origin=fork, upstream=team) | PASS |
| 10 | Clean working tree on default branch after the fork clone | PASS |

## 1. Accounts and fork

| Check | Result | Notes |
| --- | --- | --- |
| Can view team repo https://github.com/EdTechForLearning/PREIShare-org-repo | PASS | HTTP `200`. GitHub API `full_name`: `EdTechForLearning/PREIShare-org-repo`. Default branch: `main`. Public repo. |
| GitHub sign-in works | PASS | Learner opened their fork in a browser while signed in. GitHub CLI on this VM is still not logged in (`gh auth status`); that is not required for a public HTTPS clone. |
| Fork created in my account | PASS | Screenshot + API: `Sjwarner516/PREIShare-org-repo`, `fork: true`, parent `EdTechForLearning/PREIShare-org-repo`. Banner: “forked from EdTechForLearning/PREIShare-org-repo”. Branch `main` up to date with upstream `main`. Fork URL: https://github.com/Sjwarner516/PREIShare-org-repo |

**Yes — that page is the fork, not the original.** The original (team repo of record) lives at `EdTechForLearning/PREIShare-org-repo`. The GitHub UI line “forked from EdTechForLearning/PREIShare-org-repo” is the proof you own a copy. You have write access to `Sjwarner516/PREIShare-org-repo`. You do **not** push to the EdTechForLearning repo; later pull requests from this fork will target it.

### Command: confirm the team repository

```text
$ curl -sI https://github.com/EdTechForLearning/PREIShare-org-repo | head
HTTP/2 200
...
server: github.com
```

```text
$ # GitHub API fields
full_name: EdTechForLearning/PREIShare-org-repo
html_url: https://github.com/EdTechForLearning/PREIShare-org-repo
default_branch: main
private: False
```

Cross-check vs Step 1 notes: `docs/onboarding/team-orientation-notes.md` records the same official URL. No correction needed.

### Command: confirm the fork (after the learner’s screenshot)

```text
$ # GitHub API fields for https://github.com/Sjwarner516/PREIShare-org-repo
full_name: Sjwarner516/PREIShare-org-repo
html_url: https://github.com/Sjwarner516/PREIShare-org-repo
fork: True
parent: EdTechForLearning/PREIShare-org-repo
default_branch: main
clone_url: https://github.com/Sjwarner516/PREIShare-org-repo.git
private: False
```

### Earlier attempt (this VM, before the screenshot)

`gh` on this machine could not create the fork (no GitHub login). That failure is kept in §7. The fork was created in the browser under `Sjwarner516` instead.

## 2. Git install and identity

```text
$ git --version
git version 2.43.0
```

Git was already installed (`/usr/bin/git`). No package-manager install was required.

Identity **before** change (environment default):

```text
$ git config --global user.name
Cursor Agent
$ git config --global user.email
cursoragent@cursor.com
```

Identity **after**:

```text
$ git config --global user.name "Sydni"
$ git config --global user.email "plions11@gmail.com"

$ git config --global user.name
Sydni
$ git config --global user.email
plions11@gmail.com
```

Identity configured: PASS

These settings only label commits. They do **not** log this machine into GitHub. GitHub account for this course: `Sjwarner516`.

## 3. Clone (of MY fork)

- Parent directory used: `/home/ubuntu/projects` (created with `mkdir -p ~/projects`)
- Clone command used: `git clone https://github.com/Sjwarner516/PREIShare-org-repo.git`
- Cloned my fork (not the team repo): PASS
- Clone completed without error: PASS
- Local project path: `/home/ubuntu/projects/PREIShare-org-repo`

```text
$ cd /home/ubuntu/projects
$ git clone https://github.com/Sjwarner516/PREIShare-org-repo.git
Cloning into 'PREIShare-org-repo'...

$ cd PREIShare-org-repo
$ pwd
/home/ubuntu/projects/PREIShare-org-repo
```

**Why this URL and not the team URL:** Cloning sets `origin` to whatever you cloned. Because we cloned `Sjwarner516/PREIShare-org-repo`, `origin` is a repository we can push to later. Cloning `EdTechForLearning/PREIShare-org-repo` would have set `origin` to the team repo, which we cannot push to.

A leftover folder from the earlier connectivity check still exists and must **not** be used as the working copy:

`/home/ubuntu/projects/PREIShare-org-repo-team-readonly-check` (its `origin` is EdTechForLearning).

## 4. Remotes (run inside the fork clone)

```text
$ git remote add upstream https://github.com/EdTechForLearning/PREIShare-org-repo.git
```

`git remote add upstream` run: PASS (exit 0; Git did not say “remote upstream already exists”).

### git remote -v

```text
$ git remote -v
origin	https://github.com/Sjwarner516/PREIShare-org-repo.git (fetch)
origin	https://github.com/Sjwarner516/PREIShare-org-repo.git (push)
upstream	https://github.com/EdTechForLearning/PREIShare-org-repo.git (fetch)
upstream	https://github.com/EdTechForLearning/PREIShare-org-repo.git (push)
```

Four lines, as expected.

| Remote | Points at | Role |
| --- | --- | --- |
| `origin` | `Sjwarner516/PREIShare-org-repo` (my fork) | Push branches here; open PRs from here |
| `upstream` | `EdTechForLearning/PREIShare-org-repo` (team repo) | Fetch the team’s later changes; never push here |

origin points at MY fork: PASS
upstream points at the team repo: PASS

## 5. Post-clone verification

Captured **immediately after clone + `upstream`**, before adding onboarding docs to the working tree:

### git status

```text
$ git status
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### Default branch

```text
$ git branch --show-current
main
```

Default branch name: `main`
Working tree clean after clone: PASS

## 6. Auth notes (no secrets)

- Clone method: HTTPS
- Auth method used: none (public fork; clone did not prompt)
- Clone auth succeeded: PASS
- Push to origin was **not** tested in this step
- GitHub CLI on this VM: still not logged in (browser fork + public clone were enough)
- **Do not paste tokens or private keys here**

`git config --global --list` was **not** pasted: this environment also stores Cursor-managed remote rewrite URLs that can include access tokens.

## 7. Issues and fixes

| Issue | What I tried | Outcome |
| --- | --- | --- |
| `gh` on this VM not logged into GitHub | `gh auth status`, then `gh repo fork ...` | Could not create the fork from the VM. Fork was created in the browser instead under `Sjwarner516`. |
| Guessed GitHub username `plions11` (Cursor handle) | `git clone https://github.com/plions11/PREIShare-org-repo.git` | FAIL: `fatal: could not read Username for 'https://github.com': No such device or address`. That user/repo does not exist. |
| Risk of cloning the team repo as working copy | Cloned it only as `PREIShare-org-repo-team-readonly-check` | That folder’s `origin` is EdTechForLearning — **do not work there**. Real working copy is `~/projects/PREIShare-org-repo`. |
| Need the actual fork URL | Learner sent a screenshot of `Sjwarner516/PREIShare-org-repo` “forked from EdTechForLearning/PREIShare-org-repo” | Confirmed via API (`fork: true`, parent is the team repo). Cloned that URL. Remotes now correct. |

## 8. Ready for next step

I have a fork I own, a local clone of it with origin and upstream set, and a setup log another teammate could audit: **YES**
