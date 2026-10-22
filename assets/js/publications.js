'use strict';

const cvSearch = document.querySelector('#cv-search');
const cvCategory = document.querySelector('#cv-category');
const cvYear = document.querySelector('#cv-year');
const cvCategoryContainer = document.querySelector('#cv-categories');
const cvCount = document.querySelector('#cv-count');
const cvEmpty = document.querySelector('#cv-empty');
let cvEntries = [];
let cvDataEntries = null;

function createCVEntry(entry) {
  const item = document.createElement('li');
  item.id = entry.id;
  item.className = 'cv-entry';
  item.dataset.category = entry.category;
  item.dataset.year = entry.year;

  const year = document.createElement('div');
  year.className = 'cv-year';
  year.textContent = entry.year === 'Pending' || entry.year === 'In press' ? '—' : entry.year;
  item.appendChild(year);

  const content = document.createElement('div');
  if (entry.status) {
    const status = document.createElement('span');
    status.className = 'status-badge';
    status.textContent = entry.status;
    content.appendChild(status);
  }

  const citation = document.createElement('p');
  citation.className = 'cv-citation';
  for (const segment of entry.citation) {
    if (segment.member) {
      const member = document.createElement('span');
      member.className = 'cv-member';
      member.textContent = segment.text;
      citation.appendChild(member);
    } else {
      citation.appendChild(document.createTextNode(segment.text));
    }
  }
  content.appendChild(citation);

  if (entry.link) {
    const link = document.createElement('a');
    link.className = 'text-link cv-link';
    link.href = entry.link;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = entry.linkText;
    content.appendChild(link);
  }

  item.appendChild(content);
  return item;
}

function renderCV(entries) {
  const categories = new Map();
  for (const entry of entries) {
    if (!categories.has(entry.category)) {
      categories.set(entry.category, []);
    }
    categories.get(entry.category).push(entry);
  }

  const fragment = document.createDocumentFragment();
  let categoryIndex = 0;
  for (const [category, categoryEntries] of categories) {
    const section = document.createElement('section');
    section.className = 'cv-category';
    section.setAttribute('aria-labelledby', `category-${categoryIndex}`);

    const heading = document.createElement('h2');
    heading.id = `category-${categoryIndex}`;
    heading.appendChild(document.createTextNode(category));
    const total = document.createElement('span');
    total.dataset.cvCategoryTotal = category;
    total.textContent = `${categoryEntries.length} entries`;
    heading.appendChild(total);
    section.appendChild(heading);

    const list = document.createElement('ol');
    list.className = 'cv-list';
    for (const entry of categoryEntries) {
      const item = createCVEntry(entry);
      list.appendChild(item);
      cvEntries.push(item);
    }
    section.appendChild(list);
    fragment.appendChild(section);
    categoryIndex++;
  }
  while (cvCategoryContainer.firstChild) {
    cvCategoryContainer.removeChild(cvCategoryContainer.firstChild);
  }
  cvCategoryContainer.appendChild(fragment);
}

function filterCV() {
  if (!cvDataEntries) {
    return;
  }

  const term = cvSearch.value.trim().toLocaleLowerCase();
  let shown = 0;

  for (const [index, entry] of cvDataEntries.entries()) {
    const pageEntry = cvEntries[index];
    const citationText = entry.citation.map(segment => segment.text).join('');
    const match =
      (!term ||
        `${citationText} ${entry.status || ''} ${entry.linkText || ''}`
          .toLocaleLowerCase()
          .includes(term)) &&
      (cvCategory.value === 'All' || entry.category === cvCategory.value) &&
      (cvYear.value === 'All' || entry.year === cvYear.value);

    pageEntry.hidden = !match;
    if (match) {
      shown++;
    }
  }

  document.querySelectorAll('.cv-category').forEach(section => {
    section.hidden = ![...section.querySelectorAll('.cv-entry')].some(entry => !entry.hidden);
  });
  cvCount.textContent = `${shown} of ${cvDataEntries.length} entries`;
  cvEmpty.hidden = shown > 0;
}

async function loadCV() {
  const totals = [...document.querySelectorAll('[data-cv-total]')];
  const categoryTotals = [...document.querySelectorAll('[data-cv-category-total]')];

  try {
    const response = await fetch('data/publications.json');
    if (!response.ok) {
      throw new Error(`Publication data request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.entries)) {
      throw new Error('Publication data does not contain an entries array');
    }

    const ids = new Set();
    for (const [index, entry] of data.entries.entries()) {
      if (
        !entry ||
        typeof entry.id !== 'string' ||
        !/^cv-[a-z0-9-]+$/.test(entry.id) ||
        ids.has(entry.id) ||
        typeof entry.category !== 'string' ||
        typeof entry.year !== 'string' ||
        typeof entry.status !== 'string' ||
        !Array.isArray(entry.citation) ||
        entry.citation.some(segment =>
          !segment ||
          typeof segment.text !== 'string' ||
          typeof segment.member !== 'boolean',
        ) ||
        (entry.link !== null && typeof entry.link !== 'string') ||
        typeof entry.linkText !== 'string'
      ) {
        throw new Error(`Publication data entry ${index + 1} has an invalid format`);
      }
      ids.add(entry.id);
    }

    cvDataEntries = data.entries;
    renderCV(cvDataEntries);
    const fragmentTarget = document.getElementById(window.location.hash.substring(1));
    if (fragmentTarget && fragmentTarget.classList.contains('cv-entry')) {
      fragmentTarget.scrollIntoView();
    }
    const counts = new Map();
    for (const entry of cvDataEntries) {
      counts.set(entry.category, (counts.get(entry.category) || 0) + 1);
    }

    for (const total of totals) {
      total.textContent = String(counts.get(total.dataset.cvTotal) || 0);
    }
    for (const total of categoryTotals) {
      total.textContent = `${counts.get(total.dataset.cvCategoryTotal) || 0} entries`;
    }
    filterCV();
  } catch (error) {
    for (const total of totals) {
      total.textContent = '—';
    }
    for (const total of categoryTotals) {
      total.textContent = '— entries';
    }
    cvCount.textContent = 'Publication list unavailable';
    document.querySelector('#cv-totals-error').hidden = false;
    console.error('Unable to load data/publications.json.', error);
  }
}

cvSearch.addEventListener('input', filterCV);
cvCategory.addEventListener('change', filterCV);
cvYear.addEventListener('change', filterCV);

document.querySelector('#cv-reset').addEventListener('click', () => {
  cvSearch.value = '';
  cvCategory.value = 'All';
  cvYear.value = 'All';
  filterCV();
});

loadCV();
