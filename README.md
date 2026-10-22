# Sciaini Group website

A complete static website, ready for a GitHub repository and GitHub Pages. No build, npm install, framework, API key or server backend is required.

## Folder contents

| Path | Purpose |
| --- | --- |
| `index.html` | Homepage, research, image gallery, publication highlights, people and contact |
| `publications.html` | Complete 94-entry CV bibliography |
| `spotlight.html` | Data-driven archive of in-depth research spotlights |
| `assets/css/style.css` | Responsive styles for both pages |
| `assets/js/content.js` | Editable team roster and 16 themed publication highlights |
| `assets/js/app.js` | Homepage filters, search, navigation and credits |
| `assets/js/figures.js` | Enlarged publication figure viewer |
| `assets/js/publications.js` | Complete bibliography search and filters |
| `assets/js/spotlights.js` | Renders research spotlight stories and figure viewers |
| `assets/images/` | Optimized publication figures, including diffraction dynamics |
| `assets/images/people/` | Place future member portraits here |
| `data/publications.json` | Complete bibliography records, including citation emphasis and links |
| `data/research-spotlights.json` | Research spotlight stories, figures and optional data links |
| `data/figure-sources.json` | Additional figure provenance |
| `IMAGE-CREDITS.md` | Full list of image sources |
| `.nojekyll` | Serves the site as plain static files on GitHub Pages |

## Upload using GitHub in a browser

1. Unzip the download on your computer.
2. Create a repository (for example `sciaini-group`).
3. Choose **Add file → Upload files** and upload the **contents inside** the `sciaini-group-website` folder. Keep `index.html` at the repository root, not inside an extra wrapper folder. Include the entire `assets` and `data` folders.
4. Commit the files to `main`. If your file picker hides dotfiles, create an empty `.nojekyll` file in the repository separately.
5. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then branch **main** and folder **/(root)**. Save.
6. Use the published URL shown by GitHub. For a project repository it normally has the form `https://USERNAME.github.io/REPOSITORY/`.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

GitHub Pages hosting does not inherit the private access controls of the original site. Choose the intended repository and hosting visibility when publishing.

## Upload using Git (optional)

Run these commands from inside the extracted folder. Replace the example remote URL with your own empty repository's URL.

```sh
git init
git add .
git commit -m "Add Sciaini Group website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Then enable Pages using `main` and `/(root)` as above. No GitHub Actions workflow is needed.

## Preview locally

Open `index.html` in your browser, or run this command from the project folder:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. The website uses relative links so it works under a repository subpath as well as a domain root.

## Edit content

### People and portraits

Edit `assets/js/content.js`. Each person has `name`, `role`, `group`, `focus` and `photo` fields. Copy a photo to `assets/images/people/` and set, for example:

```js
"photo": "assets/images/people/name.jpg"
```

These image paths are relative to `index.html`, not to the JavaScript file. Empty values retain the initials placeholder. For the PI, replace the contents of the `pi-portrait` element in `index.html` with an image and descriptive alt text. Add an image rule such as `.pi-portrait img { width:100%; height:100%; object-fit:cover; }` if needed.

### Publication highlights

Edit the `publications` array in `assets/js/content.js`. Theme names must match the filter buttons in `index.html`. Current totals are 5 Ultrafast dynamics, 6 Quantum materials and 5 Liquid-phase microscopy. Totals are dynamically calculated, but double check correctness. Use a verified `doi` for an external paper link. For a highlight without a DOI, set `citationTitle` and `citationCategory` to match the corresponding record in `data/publications.json`; the homepage resolves its descriptive anchor automatically, so do not copy or construct a publication URL or ID. Keep conference proceedings labelled in `kind`.

### Complete bibliography

The complete bibliography is rendered from `data/publications.json` when the page loads, in the same order as its records. Serve the site over HTTP(S) so the page can load the JSON file.

#### Adding or editing an entry

Add a record to the `entries` array in `data/publications.json`. Its position in the array controls where it appears; moving a record does not change its anchor. Give every new record a unique, descriptive `cv-*` ID based on the paper's title (and, when useful, its year or category). Keep that ID unchanged when editing or reordering the entry, since publication highlights and external links may point to it. Numeric or other legacy aliases are not used.

Each record uses this structure:

```json
{
  "id": "cv-example-paper-title-2027-journal-articles",
  "category": "Journal articles",
  "year": "2027",
  "status": "",
  "citation": [
    { "text": "A. Author, ", "member": false },
    { "text": "B. Student", "member": true },
    { "text": ", and C. Author. “Example paper title”. Journal 12, 34 (2027).", "member": false }
  ],
  "link": "https://doi.org/10.0000/example",
  "linkText": "Read publication ↗"
}
```

Use `member: true` only for author names that should be underlined; keep punctuation and spaces in the appropriate citation segments. Use an empty string for `status` when there is no badge, or provide a status such as `"In press"`, `"Submitted"`, or `"Under review"`. For entries without a link, set `link` to `null` and `linkText` to an empty string. Use the existing category names so the category filter and totals continue to work.

If a homepage highlight links to an entry without a DOI, also set that bibliography record's `title` to its publication title. The highlight's `citationTitle`, year, and `citationCategory` are matched to this record; its `id` is used only to create the final page anchor. The `title` field is only required for records referenced by a homepage highlight.

### Research spotlights

The homepage links to the separate [Research Spotlights page](./spotlight.html). Its entries are rendered from `data/research-spotlights.json`; add a new object to the `entries` array to publish another story. The array order is the display order. Copy an existing object and replace the text and assets—no HTML changes are needed.

Each spotlight has a unique lowercase `id`, `date`, `title`, short `summary`, and a `paragraphs` array. The optional `author` field adds a byline only when present. Use `figures` to choose one or more existing images from `assets/images/` and provide their alt text, viewer title/caption, citation, and optional DOI. Figure `label` and `credit` are optional display text. Add an optional `datasets` array for files or external data links; each item has a `title` and `url`, with optional `format` and `description`. The optional `publication` object adds a DOI link for the story.

Example structure (all text is plain text; do not add HTML tags):

```json
{
  "id": "example-study-2027",
  "date": "2027",
  "title": "A clear title for the story",
  "author": "Optional author or team name",
  "summary": "A short introduction to the finding.",
  "paragraphs": [
    "Describe the question and approach.",
    "Explain the result and why it matters."
  ],
  "figures": [
    {
      "image": "assets/images/example-figure.webp",
      "alt": "Describe the scientific content and any meaningful labels.",
      "title": "Short figure title",
      "caption": "Explain what the figure shows.",
      "citation": "Full source citation for the figure.",
      "doi": "10.0000/example",
      "credit": "Figure 1 · Example et al. (2027)",
      "label": "OPTIONAL FIGURE LABEL"
    }
  ],
  "datasets": [
    {
      "title": "Download the measurement data",
      "url": "assets/data/example.csv",
      "format": "CSV",
      "description": "Processed time-resolved measurements"
    }
  ],
  "publication": {
    "label": "Read the paper",
    "doi": "10.0000/example"
  }
}
```

Omit `author`, `datasets`, or `publication` when they are not needed. For figures without a DOI, omit `doi`; keep the full citation so it remains available in the enlarged figure viewer. Add any new image or data file under `assets/` or `data/` and use its path from the site root.

### Figures

Replace the relevant file under `assets/images/`, or change its `src` in the HTML. A `figure-zoom` button supplies the enlarged viewer's title, caption and DOI through its `data-figure-*` attributes. Keep attribution and scientific labels/scale bars intact. Update `IMAGE-CREDITS.md` when changing images.

## Included version and checks

Exported October 13, 2026 from the current site source. Includes the latest differential diffraction illustration (~200 fs and >3 ps), time-resolved plots, expandable gallery, portrait placeholders, 16 themed highlights and full 94-entry CV list. Roster and bibliography refer to the September 25, 2026 CV.

Checked local assets, relative links and anchors, JavaScript syntax, and ZIP integrity. No visual browser QA was available. This package is an export; the hosted site was not modified and nothing was uploaded to GitHub.

## Rights

No blanket open-source license is applied. Publication figures remain subject to their respective rights holders and source licenses. See IMAGE-CREDITS.md. Full source PDFs and the private CV are not included.
