# Vercel Hobby setup — PREIshare investor app

**Date:** 2026-09-06
**Vercel plan:** Hobby (free) — not Pro

## URLs (the same ones you will reuse all semester)

| Item | Value |
| --- | --- |
| GitHub repository (you can push) | `https://github.com/Sjwarner516/PREIShare-org-repo` |
| Instructor collaborator | `thortek` added: yes (write invite sent 2026-09-06; pending accept) |
| Vercel Production URL | `https://prei-share-org-repo-sjwarner516s-projects.vercel.app` |
| Preview URLs | Do **not** submit these to Canvas |

Vercel project (dashboard): `https://vercel.com/sjwarner516s-projects/prei-share-org-repo`  
GitHub Production environment is wired; `vercel[bot]` marked commit `9d51f59` (Nitro hosting) as **Deployment has completed**.

## Hobby constraints I will keep

- One Vercel project for this course
- Production deploys from `main` only
- No cron / Fluid Compute / paid add-ons
- Secrets go in the Vercel dashboard later — never in git

## First production deploy

- Status: Ready (GitHub status context `Vercel` = success on `main` @ `9d51f59`)
- Incognito check of Production URL: fail — the Production alias responds, but Vercel Deployment Protection sends an unauthenticated browser to `vercel.com/login` instead of the public app. A teammate should turn Standard Protection off (or add a public bypass) if Canvas needs a no-login URL.
