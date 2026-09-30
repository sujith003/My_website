# Sujith E | Portfolio

Personal portfolio for Sujith E, positioned around Oracle SQL and database development, with Python, REST APIs and hands-on application support experience.

**Live:** https://sujith-flame.vercel.app/

## Highlights

- Oracle SQL-focused hero with a query-editor panel that types out and shows a result grid
- Interactive SQL workbench covering JOIN, GROUP BY, subqueries, CTEs, window functions and transactions (illustrative sample tables, not company data)
- Skills dashboard in three tiers: Oracle SQL and databases (primary), Python, web and APIs (secondary), application support, Linux and ITSM (supporting)
- Experience split into Oracle WMS and DMS modules, plus work common to both
- Projects: Inventory Reconciliation & Data Validation, Enga Ooru Vengamooru, Online Shopping Website, Human Disease Detection, Application Monitoring & Production Support
- Light and dark themes (follows system preference, remembers the choice)
- Floating pill navigation on desktop, bottom dock on mobile
- Scroll reveal animations and reduced-motion support

## Tech stack

Static site: HTML, CSS and vanilla JavaScript. No build step and no dependencies apart from the Google Fonts stylesheet (Instrument Sans, Instrument Serif, JetBrains Mono).

## Project structure

```text
index.html   Page content and structure
style.css    Design tokens (dark/light), layout and components
script.js    Theme toggle, navigation indicator, scroll reveal, SQL workbench, copy-email, project dialog
```

Other files used by the site:

- `Sujith_E_Application_Support_Resume.pdf`: linked from the Resume buttons
- `log.jpg`, `reg.jpg`, `home.jpg`, `health.jpg`, `medi.jpg`, `lang.jpg`, `medicine.jpg`, `brain.jpg`, `lung.jpg`, `covid.jpg`, `certificate.jpg`: screenshots and certificate shown in the Human Disease Detection dialog

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deployment

Deployed on Vercel as a static site. Push to the main branch to redeploy.

## Editing content

- Text and links: `index.html`
- Colors and fonts: the `:root` and `[data-theme]` variables at the top of `style.css`
- SQL workbench examples: the `EX` array in `script.js`

## Contact

- Email: esujith1103@gmail.com
- LinkedIn: https://www.linkedin.com/in/sujith-e-1b6014252
- GitHub: https://github.com/sujith003