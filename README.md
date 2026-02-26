# DTR — Daily Time Record for OJT

A minimal web application for tracking On-the-Job Training (OJT) hours. Log your daily time in/out, monitor your progress toward the 486-hour requirement, and export your records as a PDF.

---

## Features

- **Daily Log** — Record morning and afternoon time-in/time-out for each day
- **Manual Entry** — Add or back-fill past records using a date picker
- **Edit & Delete** — Modify or remove any saved record
- **Persistent Storage** — All records are saved in the browser via `localStorage`
- **Progress Bar** — Visual tracker toward the 486-hour OJT requirement, showing accumulated hours, remaining hours, and an estimated end date
- **Saved Records Table** — Full history of all entries sorted by date (newest first)
- **PDF Export** — Preview and download a PDF of the current day's entry plus the full records list and total progress summary

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Vue 3](https://vuejs.org/) | UI framework (Composition API with `<script setup>`) |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [jsPDF](https://github.com/parallax/jsPDF) | PDF generation |
| `localStorage` | Client-side data persistence |
| GitHub Actions | Automated deployment to GitHub Pages |

---

## Project Structure

```
DTR/
├── index.html                        # Vite HTML shell
├── vite.config.js                    # Vite config (base path for GitHub Pages)
├── package.json
├── public/
│   └── time icon.png                 # Favicon
└── src/
    ├── main.js                       # App entry point
    ├── App.vue                       # Root component — owns all state
    ├── style.css                     # Global styles (brutalist design)
    ├── components/
    │   ├── ProgressBar.vue           # OJT progress bar (accumulated / 486 hrs)
    │   ├── TimeInputGroup.vue        # Reusable morning/afternoon time input pair
    │   ├── TotalDisplay.vue          # Live daily total display (decimal + h/m)
    │   ├── RecordsList.vue           # Saved records table with edit/delete
    │   └── PreviewModal.vue          # Full-screen PDF preview modal
    └── composables/
        ├── useRecords.js             # localStorage CRUD + progress computed values
        └── usePDF.js                 # jsPDF generation and download logic
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm

### Install dependencies

```bash
cd DTR
npm install
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:5173/dtr/](http://localhost:5173/dtr/) in your browser.

### Build for production

```bash
npm run build
```

The output is placed in the `dist/` folder.

---

## Deployment

This project is configured for **GitHub Pages** using GitHub Actions.

Every push to the `main` branch automatically:
1. Builds the app on GitHub's servers
2. Deploys the `dist/` folder to the `gh-pages` branch

The live app is available at:
```
https://<your-username>.github.io/dtr/
```

### Manual deployment setup
See the workflow file at [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Required one-time setup on GitHub:
1. Go to **Settings → Actions → General → Workflow permissions**
2. Select **Read and write permissions** → Save
3. After the first deploy, go to **Settings → Pages**
4. Set branch to `gh-pages` → Save

---

## Usage

### Adding a record
1. Select a **date** using the date picker
2. Enter **Morning In / Out** times
3. Enter **Afternoon In / Out** times
4. The **Total Hours** updates live as you type
5. Click **Save Record**

### Editing a record
1. Find the record in the **Saved Records** table
2. Click **Edit** — the form fills with that record's data
3. Make changes and click **Update Record**
4. Click **Cancel** to discard changes

### Exporting to PDF
1. Fill in the current day's times (or edit an existing record)
2. Click **Preview PDF** to open the preview modal
3. The PDF includes:
   - Today's entry (morning/afternoon times + daily total)
   - Full saved records table
   - Total accumulated hours and OJT progress summary
4. Click **Download PDF** to save the file

---

## Data Storage

All records are stored in the browser's `localStorage` under the key `dtr_records`. Records are **not** synced across devices or browsers. Clearing browser data will erase all records.

Each record is stored in this format:
```json
{
  "id": "uuid",
  "date": "YYYY-MM-DD",
  "morningIn": "HH:MM",
  "morningOut": "HH:MM",
  "afternoonIn": "HH:MM",
  "afternoonOut": "HH:MM",
  "totalMinutes": 480
}
```

---

## OJT Configuration

To change the internship hour target or start date, edit the constants in [src/composables/useRecords.js](src/composables/useRecords.js):

```js
const TARGET_HOURS = 486       // total required hours
const START_DATE   = '2026-02-06'  // internship start date (YYYY-MM-DD)
```
