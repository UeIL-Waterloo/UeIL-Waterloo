# Sciaini Group website

A complete static website, ready for a GitHub repository and GitHub Pages. No build, npm install, framework, API key or server backend is required.

## Folder contents

| Path | Purpose |
| --- | --- |
| `index.html` | Homepage, research, image gallery, publication highlights, people and contact |
| `publications.html` | Complete 94-entry CV bibliography |
| `assets/css/style.css` | Responsive styles for both pages |
| `assets/js/content.js` | Editable team roster and 16 themed publication highlights |
| `assets/js/app.js` | Homepage filters, search, navigation and credits |
| `assets/js/figures.js` | Enlarged publication figure viewer |
| `assets/js/publications.js` | Complete bibliography search and filters |
| `assets/images/` | Optimized publication figures, including diffraction dynamics |
| `assets/images/people/` | Place future member portraits here |
| `data/cv-publications.json` | Bibliography transcription for future editing |
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

Edit the `publications` array in `assets/js/content.js`. Theme names must match the filter buttons in `index.html`. Current totals are 5 Ultrafast dynamics, 6 Quantum materials and 5 Liquid microscopy. Totals are dynamically calculated, but double check correctness. Use a verified `doi`, or an internal `citationUrl` pointing to a bibliography entry. Keep conference proceedings labelled in `kind`.

### Complete bibliography

The displayed complete list is authored directly in `publications.html`. JavaScript calculates the overall and per-category entry counts and the filtered result count from `data/cv-publications.json` when the page loads. It verifies that each JSON record matches the corresponding page entry before showing counts. The JSON does **not** automatically regenerate citation markup, so update both when changing records. Preserve existing `cv-entry-*` IDs because highlights link to them. Serve the site over HTTP(S) so the page can load the JSON file.

### Figures

Replace the relevant file under `assets/images/`, or change its `src` in the HTML. A `figure-zoom` button supplies the enlarged viewer's title, caption and DOI through its `data-figure-*` attributes. Keep attribution and scientific labels/scale bars intact. Update `IMAGE-CREDITS.md` when changing images.

## Included version and checks

Exported October 13, 2026 from the current site source. Includes the latest differential diffraction illustration (~200 fs and >3 ps), time-resolved plots, expandable gallery, portrait placeholders, 16 themed highlights and full 94-entry CV list. Roster and bibliography refer to the September 25, 2026 CV.

Checked local assets, relative links and anchors, JavaScript syntax, and ZIP integrity. No visual browser QA was available. This package is an export; the hosted site was not modified and nothing was uploaded to GitHub.

## Rights

No blanket open-source license is applied. Publication figures remain subject to their respective rights holders and source licenses. See IMAGE-CREDITS.md. Full source PDFs and the private CV are not included.
