# Decap Test 1

A minimal, runs-entirely-on-your-machine demo of **Decap CMS + Eleventy**.
Goal: see the whole CMS loop click — edit in a form, save to a file, rebuild the site — with no accounts, no hosting, no GitHub.

## What's here

```
decap test 1/
├─ src/
│  ├─ admin/
│  │  ├─ index.html   ← loads Decap CMS (this IS the admin panel)
│  │  └─ config.yml   ← the CMS rules: collections + fields
│  ├─ _data/site.json ← site title/description (editable in CMS → Settings)
│  ├─ _includes/      ← page layouts (base.njk, post.njk)
│  ├─ posts/*.md      ← each Markdown file = one post (editable in CMS → Posts)
│  ├─ css/style.css   ← styling (copied through untouched)
│  ├─ uploads/        ← images uploaded via the CMS land here
│  └─ index.njk       ← home page, lists the posts
├─ .eleventy.js       ← Eleventy config
└─ _site/             ← generated website (git-ignored)
```

## Run it

From inside this folder:

```bash
npm install      # first time only
npm start        # runs BOTH the site and the CMS proxy together
```

Then open:

- **Website:**  http://localhost:8080
- **Admin panel:**  http://localhost:8080/admin

`npm start` launches two things at once:

| Process | Port | Job |
|---------|------|-----|
| Eleventy dev server | 8080 | builds + serves the site, rebuilds on save |
| decap-server (proxy) | 8081 | lets the admin read/write files locally with no login |

(If you'd rather run them separately, use `npm run dev` and `npm run cms` in two terminals.)

## Try the loop

1. Open the admin, go to **Posts**, edit "Hello from Decap CMS", change some text, click **Publish**.
2. Watch the file `src/posts/hello-decap.md` change on disk (and a git commit appear).
3. The website at :8080 rebuilds automatically — your change is live.

That round-trip is all Decap CMS does. Everything else (more collections, images,
your animated `story.json`, deploying to a real host) is built on top of this.

## Going to production later (not set up yet)

- Deploy `_site/` to any static host (Netlify, Cloudflare Pages, GitHub Pages).
- Set `local_backend: false` in `config.yml` and connect a real `backend`
  (e.g. GitHub, or Netlify Identity + Git Gateway) so editors can log in.
