# worknouveau.co bridge site (static, no WordPress)

Plain HTML/CSS copy of the current Work Nouveau site, built from Britt Creative's database export
(Nov 23, 2026). Same URLs as the WordPress site (`/services/`, `/contact/`, `/blog/`, `/<post-slug>/`),
so search rankings and old links keep working. Hosted free on GitHub Pages.

## 1. Add the images (required)
Images are not in the database. Britt's backup contains them.
1. Unzip Britt's backup and find `wp-content/uploads/`.
2. Copy that folder to `wp-content/uploads/` in this repo (same folder names: `2025/08`, `2025/09`, `2026/05`...).
3. `uploads-needed.txt` lists the ~90 files the pages use. Copy only those if you want a small repo
   (blog thumbnails included). Pages hide any missing image instead of showing a broken icon.

## 2. Contact form
`/contact/` posts to Formspree. Create a free form at formspree.io with recipient hello@worknouveau.co,
then replace `REPLACE_WITH_FORMSPREE_ID` in `contact/index.html`.
Until then the form opens the visitor's email app addressed to hello@worknouveau.co.

## 3. Publish on GitHub Pages
1. Create a repo and push this folder to `main` (public repo = free Pages; there are no secrets in here). Links are relative, so it works at `<owner>.github.io/<repo>/` and later at `worknouveau.co` with no changes.
   **Do not commit the .sql database export** (user hashes, security logs). `.gitignore` blocks `*.sql`.
2. Repo Settings > Pages > Source: Deploy from branch `main`, folder `/ (root)`.
3. Custom domain (at cutover only, not for the preview): enter `worknouveau.co` in Settings > Pages. GitHub adds the `CNAME` file for you.
4. Optional but recommended: verify the domain (GitHub profile Settings > Pages > Add a domain) and add the
   `_github-pages-challenge-<user>` TXT record it gives you. It is one new TXT record; email is unaffected.

## 4. DNS (Angela's WordPress.com account, from Britt's Nov 23 record capture)
Change ONLY the apex A record. Replace `35.215.111.15` with these four (add all four):

    185.199.108.153
    185.199.109.153
    185.199.110.153
    185.199.111.153

- `www` is a CNAME to `worknouveau.co`, so it follows. No change.
- Do NOT touch MX, SPF, DKIM, DMARC or the two google-site-verification TXT records (Google Workspace email).
- TTL on the A record is 5 minutes, so the switch is quick. Back out by restoring `35.215.111.15`
  (works only while Britt's hosting is still running, i.e. before Dec 2).
- After DNS resolves, Settings > Pages > tick "Enforce HTTPS" (certificate can take up to an hour).
- Confirm with Britt only after the site AND email are verified (mail test to/from hello@worknouveau.co).

## Not carried over
- Newsletter signup (was a Mailchimp form tied to Angela's account). Add Mailchimp's embed form if wanted.
- Google Analytics / Site Kit tracking. Add a GA4 snippet once you have the measurement ID.
- Anything needing PHP: comments, search, Ninja Forms storage.

## Editing
Edit the HTML files directly. Shared styles are in `assets/site.css`.
