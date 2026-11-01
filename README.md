# ControllingHub – website

Source of [controllinghub.com](https://controllinghub.com): management control, budgeting, reporting and BI for small and medium-sized companies.

- Single static page (`index.html`): HTML + CSS, no build step, no framework
- Light / dark theme via `prefers-color-scheme`
- Contact form handled by **Netlify Forms** (`data-netlify="true"`, honeypot field against spam)
- Hosted on **Netlify**: every push to `main` is deployed automatically

## Local preview

Open `index.html` in a browser, or:

```bash
python -m http.server 8000
```

---

🇮🇹 Sorgente del sito di ControllingHub, controllo di gestione per PMI. Pagina statica unica, pubblicata su Netlify a ogni modifica del ramo `main`.
