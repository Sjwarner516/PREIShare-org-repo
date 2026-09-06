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
One Hobby project: `prei-share-org-repo`. Standard Deployment Protection (Vercel Authentication) is **off**, so the Production alias is public.

## Hobby constraints I will keep

- One Vercel project for this course
- Production deploys from `main` only
- No cron / Fluid Compute / paid add-ons
- Secrets go in the Vercel dashboard later — never in git

## First production deploy

- Status: Ready (GitHub status context `Vercel` = success; anonymous GET of the Production URL returns HTTP 200 and `<title>TanStack Start Starter</title>`, not `vercel.com/login`)
- Incognito check of Production URL: pass
