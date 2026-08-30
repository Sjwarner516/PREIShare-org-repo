# PREIshare setup log

**Learner:** Sydni
**Date:** 2026-08-30
**OS:** Linux (Ubuntu 24.04.4 LTS)
**Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
**Orientation notes used:** `docs/onboarding/team-orientation-notes.md`

## 1. Accounts and fork

| Check | Result | Notes |
| --- | --- | --- |
| GitHub sign-in works | PASS | Account username: @Sjwarner516 |
| Can view team repo https://github.com/EdTechForLearning/PREIShare-org-repo | PASS | Page loads; repository name is EdTechForLearning/PREIShare-org-repo |
| Fork created in my account | PASS | My fork URL: https://github.com/Sjwarner516/PREIShare-org-repo |

## 2. Git install and identity

```text
git version 2.43.0

Sydni
plions11@gmail.com
```

Identity configured: PASS

## 3. Clone (of MY fork)

- Parent directory used: `/home/ubuntu/projects`
- Clone command used: `git clone https://github.com/Sjwarner516/PREIShare-org-repo.git`
- Cloned my fork (not the team repo): PASS
- Clone completed without error: PASS
- Local project path: `/home/ubuntu/projects/PREIShare-org-repo`

## 4. Remotes (run inside the repo)

- `git remote add upstream https://github.com/EdTechForLearning/PREIShare-org-repo.git` run: PASS

### git remote -v

```text
origin	https://github.com/Sjwarner516/PREIShare-org-repo.git (fetch)
origin	https://github.com/Sjwarner516/PREIShare-org-repo.git (push)
upstream	https://github.com/EdTechForLearning/PREIShare-org-repo.git (fetch)
upstream	https://github.com/EdTechForLearning/PREIShare-org-repo.git (push)
```

origin points at MY fork: PASS
upstream points at the team repo: PASS

## 5. Post-clone verification

### git status

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### Default branch

```text
main
```

Default branch name: `main`
Working tree clean after clone: PASS

## 6. Auth notes (no secrets)

- Clone method: HTTPS
- Auth method used (if prompted): not prompted for clone (public fork); GitHub CLI device login used later to push this log
- Auth succeeded: PASS
- **Do not paste tokens or private keys here**

## 7. Issues and fixes

| Issue | What I tried | Outcome |
| --- | --- | --- |
| First clone URL used Cursor handle `plions11` | `git clone https://github.com/plions11/PREIShare-org-repo.git` | FAIL: repo not found. Re-cloned `https://github.com/Sjwarner516/PREIShare-org-repo.git` |
| `gh` had no GitHub login on this VM | Created the fork in the browser, then `gh auth login` device flow as @Sjwarner516 | Fork exists; later `git push origin main` succeeded |

## 8. Ready for next step

I have a fork I own, a local clone of it with origin and upstream set, and a setup log another teammate could audit: YES
