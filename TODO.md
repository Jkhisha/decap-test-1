# Minimal Decap CMS Site — Build & Maintain

A checklist anyone can follow to build a **2-page website** whose text and images
are editable from a `/admin` panel, hosted free on Netlify. No CSS, no server.

**Result:** 2 pages (Home, About). Each has 2 headings, 2 paragraphs, 1 image —
all editable in the browser at `/admin`. Edits save straight to GitHub.

**Need first:** Node.js 18+, Git, a free GitHub account, a free Netlify account.
```bash
node -v && git --version
```

---

## PART 1 — CREATE (how to build it)

### 1. Make the project
```bash
mkdir my-site && cd my-site
npm init -y
npm install --save-dev @11ty/eleventy
```

### 2. Create these files exactly

**`.eleventy.js`**
```js
module.exports = function (c) {
  c.addPassthroughCopy("src/admin");
  c.addPassthroughCopy("src/uploads");
  return { dir: { input: "src", output: "_site" } };
};
```

**`src/_includes/page.njk`** — the shared HTML template (no CSS)
```njk
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>{{ heading1 }}</title>
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script></head>
<body>
  <h1>{{ heading1 }}</h1>
  <p>{{ para1 }}</p>
  <h2>{{ heading2 }}</h2>
  <p>{{ para2 }}</p>
  <img src="{{ image }}" alt="">
  <p><a href="/">Home</a> | <a href="/about/">About</a> | <a href="/admin/">Edit</a></p>
  <script>
    if (window.netlifyIdentity) {
      window.netlifyIdentity.on("init", u => { if (!u)
        window.netlifyIdentity.on("login", () => location.href = "/admin/"); });
    }
  </script>
</body>
</html>
```

**`src/index.md`** — Home page content (editable)
```markdown
---
layout: page.njk
permalink: /
heading1: Welcome
para1: First paragraph on the home page.
heading2: About us
para2: Second paragraph on the home page.
image: /uploads/placeholder.jpg
---
```

**`src/about.md`** — About page content (editable)
```markdown
---
layout: page.njk
permalink: /about/
heading1: About
para1: First paragraph on the about page.
heading2: Our story
para2: Second paragraph on the about page.
image: /uploads/placeholder.jpg
---
```

**`src/admin/index.html`** — the admin panel
```html
<!doctype html>
<html><head><meta charset="utf-8"><title>Admin</title></head>
<body>
<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body></html>
```

**`src/admin/config.yml`** — what the admin lets you edit (fields map 1:1 to the .md files)
```yaml
backend:
  name: git-gateway
  branch: main
local_backend: true
media_folder: "src/uploads"
public_folder: "/uploads"
collections:
  - name: pages
    label: Pages
    files:
      - name: home
        label: Home page
        file: src/index.md
        fields:
          - { label: Heading 1, name: heading1, widget: string }
          - { label: Paragraph 1, name: para1, widget: text }
          - { label: Heading 2, name: heading2, widget: string }
          - { label: Paragraph 2, name: para2, widget: text }
          - { label: Image, name: image, widget: image }
      - name: about
        label: About page
        file: src/about.md
        fields:
          - { label: Heading 1, name: heading1, widget: string }
          - { label: Paragraph 1, name: para1, widget: text }
          - { label: Heading 2, name: heading2, widget: string }
          - { label: Paragraph 2, name: para2, widget: text }
          - { label: Image, name: image, widget: image }
```

**`.gitignore`**
```
node_modules/
_site/
```

**`netlify.toml`**
```toml
[build]
  command = "npx @11ty/eleventy"
  publish = "_site"
[build.environment]
  NODE_VERSION = "20"
```

Add one image so pages don't break:
```bash
mkdir -p src/uploads
# copy any image to  src/uploads/placeholder.jpg
```

### 3. Preview locally
```bash
npx @11ty/eleventy --serve
```
Open http://localhost:8080

### 4. Push to GitHub
Create an EMPTY repo at https://github.com/new (do NOT add a README), then:
```bash
git init -b main
git add -A
git commit -m "Minimal Decap site"
git remote add origin https://github.com/USER/REPO.git
git push -u origin main
```

### 5. Deploy on Netlify
1. https://app.netlify.com → Add new site → Import an existing project → GitHub → pick your repo.
2. Build settings auto-fill from `netlify.toml` → Deploy.
3. Site goes live at `https://SOMENAME.netlify.app`.

### 6. Turn on the admin login
On your Netlify site dashboard:
1. **Identity → Enable Identity**
2. **Identity → Registration → Invite only**
3. **Identity → Services → Enable Git Gateway**  ← REQUIRED (or the admin errors)
4. **Identity → Invite users →** enter your email
5. Open the invite email → set a password
6. Go to `https://SOMENAME.netlify.app/admin` → log in → edit

---

## PART 2 — MAINTENANCE (how to run it day to day)

### Edit content
- Go to `https://YOURSITE/admin`, log in.
- Pick **Home** or **About**, change any heading/paragraph or upload a new image.
- Click **Publish** → saves to GitHub → Netlify rebuilds → live in ~1 min.

### How it works (the whole model)
```
Admin form  →  writes src/index.md / src/about.md  →  Eleventy wraps in page.njk  →  HTML
```
The form fields in `config.yml` map 1:1 to the fields in the `.md` files.

### Add another editor
Netlify → Identity → Invite users → their email. They set their own password.

### Add another page
1. Copy `src/about.md` to `src/contact.md`; change `permalink:` to `/contact/`.
2. Add a matching `- name: contact ...` block under `files:` in `config.yml`.
3. Commit and push.

### Edit locally (no internet, no login)
```bash
npx decap-server                 # terminal 1
npx @11ty/eleventy --serve       # terminal 2
```
Open http://localhost:8080/admin

### Common problem
**"Git Gateway backend is not returning valid settings"** → Git Gateway isn't on.
Netlify → Identity → Services → **Enable Git Gateway**.
