# Content Center V2 — visual demo

A **standalone interactive visual prototype** for the Content Center V2 redesign. It intentionally contains only fictional, generated sample projects and materials. It is not the Content Center production website and has **no Supabase, account, publish, ChatGPT, or Canva connection**.

Open its GitHub Pages URL on iPhone or desktop, navigate sections, create/edit mock cards, run preflight checks, leave mock approval comments, switch mock clients, and try the example ChatGPT-to-existing-card review journey.

All changes live only in the current browser page memory and reset after refresh. A published status or an approval in this demo is not an external provider result. No login code or real client information belongs in this demo.

The actual application is developed separately in the draft pull request at https://github.com/businessmarketolog-web/content-center-gpt/pull/1 . This public prototype is for visual/UX feedback only, not approval of a live production release.

Run basic offline JS tests (Node >=20): `node --check app.js && node --test smoke.test.cjs`.
