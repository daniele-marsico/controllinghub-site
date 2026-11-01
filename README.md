# ControllingHub – website

Source of [controllinghub.com](https://controllinghub.com): management control, budgeting, reporting and BI for small and medium-sized companies.

- Single static page (`index.html`): HTML + CSS, no build step, no framework
- Light / dark theme via `prefers-color-scheme`
- Contact form handled by **FormSubmit** (messages forwarded to controllinghubitaly@gmail.com, honeypot field against spam)
- Hosted on **Cloudflare Pages** at controllinghub.com: every push to `main` is deployed automatically

## Local preview

Open `index.html` in a browser, or:

```bash
python -m http.server 8000
```

---

🇮🇹 Sorgente del sito di ControllingHub, controllo di gestione per PMI. Pagina statica unica, pubblicata su Cloudflare Pages (controllinghub.com) a ogni modifica del ramo `main`.
