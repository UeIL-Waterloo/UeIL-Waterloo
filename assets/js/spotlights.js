'use strict';

const spotlightList = document.querySelector('#spotlight-list');
const spotlightError = document.querySelector('#spotlight-error');

function appendText(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function renderFigure(figure, publicationFigure, publication) {
  const item = document.createElement('figure');
  item.className = 'spotlight-figure';
  if (figure.label) {
    appendText(item, 'p', 'eyebrow', figure.label);
  }

  const button = document.createElement('button');
  button.className = 'figure-zoom';
  button.type = 'button';
  button.dataset.figureTitle = figure.title;
  button.dataset.figureCaption = figure.caption;
  button.dataset.figureCitation = publication.citation.map(segment => segment.text).join('');
  button.dataset.figureDoi = typeof publication.link === 'string' &&
    publication.link.startsWith('https://doi.org/')
    ? publication.link.slice('https://doi.org/'.length)
    : '';
  button.setAttribute('aria-label', `Enlarge figure: ${figure.title}`);

  const image = document.createElement('img');
  image.src = publicationFigure.src;
  image.alt = figure.alt;
  image.loading = 'lazy';
  button.appendChild(image);
  const hint = appendText(button, 'span', 'zoom-hint', 'View figure ⤢');
  hint.setAttribute('aria-hidden', 'true');
  item.appendChild(button);

  const credit = document.createElement('figcaption');
  credit.appendChild(document.createTextNode(figure.credit));
  item.appendChild(credit);
  return item;
}

function renderTableOfContents(entries) {
  const list = document.querySelector('#spotlight-toc-list');
  for (const entry of entries) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${entry.id}`;
    link.textContent = `${entry.title} (${entry.date})`;
    listItem.appendChild(link);
    list.appendChild(listItem);
  }
}

function renderPublication(publication) {
  const section = document.createElement('div');
  section.className = 'spotlight-publication';
  appendText(section, 'p', 'eyebrow', 'PAPER CITATION');
  const citation = appendText(section, 'p', 'spotlight-publication-citation', '');
  citation.textContent = publication.citation.map(segment => segment.text).join('');

  const link = document.createElement('a');
  link.className = 'source-link';
  link.href = publication.link;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = publication.linkText;
  section.appendChild(link);
  return section;
}

function renderDatasets(datasets) {
  const section = document.createElement('section');
  section.className = 'spotlight-data';
  appendText(section, 'h3', '', 'Research data');
  const list = document.createElement('ul');

  for (const dataset of datasets) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = dataset.url;
    link.textContent = dataset.title;
    if (/^https:\/\//i.test(dataset.url)) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
    item.appendChild(link);
    const details = [dataset.format, dataset.description].filter(Boolean).join(' · ');
    if (details) {
      item.appendChild(document.createTextNode(` — ${details}`));
    }
    list.appendChild(item);
  }

  section.appendChild(list);
  return section;
}

function renderSpotlight(entry, publication) {
  const article = document.createElement('article');
  article.id = entry.id;
  article.className = 'spotlight-entry';

  const panel = document.createElement('div');
  panel.className = 'spotlight-panel';

  const header = document.createElement('header');
  header.className = 'spotlight-header';
  appendText(header, 'p', 'eyebrow', `RESEARCH SPOTLIGHT / ${entry.date}`);
  appendText(header, 'h2', '', entry.title);
  if (entry.author) {
    appendText(header, 'p', 'spotlight-author', `Spotlight author: ${entry.author}`);
  }
  if (publication) {
    header.appendChild(renderPublication(publication));
  }
  appendText(header, 'p', 'spotlight-summary', entry.summary);
  panel.appendChild(header);

  const paragraphs = document.createElement('div');
  paragraphs.className = 'spotlight-prose';
  for (const paragraph of entry.paragraphs) {
    appendText(paragraphs, 'p', '', paragraph);
  }

  const datasets = entry.datasets || [];
  if (datasets.length) {
    paragraphs.appendChild(renderDatasets(datasets));
  }
  const content = document.createElement('div');
  content.className = 'spotlight-content';
  content.appendChild(paragraphs);

  const figures = document.createElement('div');
  figures.className = 'spotlight-figures';
  const publicationFigures = new Map(
    (publication && publication.figures ? publication.figures : [])
      .map(figure => [figure.id, figure]),
  );
  entry.figures.forEach(figure => {
    figures.appendChild(renderFigure(
      figure,
      publicationFigures.get(figure.publicationFigureId),
      publication,
    ));
  });
  content.appendChild(figures);
  panel.appendChild(content);
  article.appendChild(panel);
  return article;
}

async function loadSpotlights() {
  try {
    const [spotlightResponse, publicationResponse] = await Promise.all([
      fetch('data/research-spotlights.json'),
      fetch('data/publications.json'),
    ]);
    if (!spotlightResponse.ok) {
      throw new Error(`Research spotlight data request failed with status ${spotlightResponse.status}`);
    }
    if (!publicationResponse.ok) {
      throw new Error(`Publication data request failed with status ${publicationResponse.status}`);
    }
    const [data, publicationData] = await Promise.all([
      spotlightResponse.json(),
      publicationResponse.json(),
    ]);
    if (!Array.isArray(data.entries)) {
      throw new Error('Research spotlight data does not contain an entries array');
    }
    if (!Array.isArray(publicationData.entries)) {
      throw new Error('Publication data does not contain an entries array');
    }
    const publications = new Map(publicationData.entries.map(publication => [publication.id, publication]));

    const ids = new Set();
    for (const [index, entry] of data.entries.entries()) {
      if (
        !entry ||
        typeof entry.id !== 'string' ||
        !/^[a-z0-9-]+$/.test(entry.id) ||
        ids.has(entry.id) ||
        typeof entry.date !== 'string' ||
        typeof entry.title !== 'string' ||
        typeof entry.summary !== 'string' ||
        !Array.isArray(entry.paragraphs) ||
        entry.paragraphs.some(paragraph => typeof paragraph !== 'string') ||
        !Array.isArray(entry.figures) ||
        entry.figures.some(figure =>
          !figure ||
          typeof figure.publicationFigureId !== 'string' ||
          typeof figure.alt !== 'string' ||
          typeof figure.title !== 'string' ||
          typeof figure.caption !== 'string' ||
          typeof figure.credit !== 'string',
        ) ||
        (entry.author !== undefined && typeof entry.author !== 'string') ||
        (entry.publicationId !== undefined && typeof entry.publicationId !== 'string') ||
        (entry.datasets !== undefined && !Array.isArray(entry.datasets))
      ) {
        throw new Error(`Research spotlight entry ${index + 1} has an invalid format`);
      }
      ids.add(entry.id);
      entry.datasets = entry.datasets || [];
      entry.datasets.forEach((dataset, datasetIndex) => {
        if (
          !dataset ||
          typeof dataset.title !== 'string' ||
          typeof dataset.url !== 'string' ||
          (dataset.description !== undefined && typeof dataset.description !== 'string') ||
          (dataset.format !== undefined && typeof dataset.format !== 'string')
        ) {
          throw new Error(`Dataset ${datasetIndex + 1} in spotlight ${entry.id} has an invalid format`);
        }
      });
      if (entry.publicationId) {
        const publication = publications.get(entry.publicationId);
        if (
          !publication ||
          !Array.isArray(publication.citation) ||
          publication.citation.some(segment => !segment || typeof segment.text !== 'string') ||
          (publication.link !== null && typeof publication.link !== 'string') ||
          typeof publication.linkText !== 'string' ||
          !Array.isArray(publication.figures) ||
          publication.figures.some(figure =>
            !figure ||
            typeof figure.id !== 'string' ||
            typeof figure.src !== 'string',
          ) ||
          entry.figures.some(figure =>
            !publication.figures.some(sourceFigure => sourceFigure.id === figure.publicationFigureId),
          )
        ) {
          throw new Error(`Publication ${entry.publicationId} referenced by spotlight ${entry.id} is invalid`);
        }
      } else if (entry.figures.length > 0) {
        throw new Error(`Spotlight ${entry.id} figures must use shared publication figure credits`);
      }
    }

    const fragment = document.createDocumentFragment();
    data.entries.forEach(entry => {
      const publication = entry.publicationId ? publications.get(entry.publicationId) : null;
      fragment.appendChild(renderSpotlight(entry, publication));
    });
    renderTableOfContents(data.entries);
    spotlightList.appendChild(fragment);

    const target = document.getElementById(decodeURIComponent(window.location.hash.substring(1)));
    if (target) {
      target.scrollIntoView();
    }
  } catch (error) {
    spotlightError.hidden = false;
    console.error('Unable to load data/research-spotlights.json.', error);
  }
}

loadSpotlights();
