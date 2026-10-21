'use strict';

const cvSearch = document.querySelector('#cv-search');
const cvCategory = document.querySelector('#cv-category');
const cvYear = document.querySelector('#cv-year');
const cvEntries = [...document.querySelectorAll('.cv-entry')];
const cvCount = document.querySelector('#cv-count');
let cvDataEntries = null;

async function updateCVTotals() {
  const totals = [...document.querySelectorAll('[data-cv-total]')];
  const categoryTotals = [...document.querySelectorAll('[data-cv-category-total]')];

  try {
    const response = await fetch('data/cv-publications.json');
    if (!response.ok) {
      throw new Error(`CV data request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.entries)) {
      throw new Error('CV data does not contain an entries array');
    }

    if (data.entries.length !== cvEntries.length) {
      throw new Error(
        `CV data contains ${data.entries.length} entries, but the page contains ${cvEntries.length}`,
      );
    }

    const counts = new Map();
    for (const [index, entry] of data.entries.entries()) {
      if (
        !entry ||
        typeof entry.category !== 'string' ||
        typeof entry.year !== 'string' ||
        typeof entry.text !== 'string'
      ) {
        throw new Error(`CV data entry ${index + 1} is missing its category, year, or text`);
      }

      if (
        cvEntries[index].dataset.category !== entry.category ||
        cvEntries[index].dataset.year !== entry.year
      ) {
        throw new Error(`CV data entry ${index + 1} does not match the page entry`);
      }

      counts.set(entry.category, (counts.get(entry.category) || 0) + 1);
    }

    cvDataEntries = data.entries;

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
    cvCount.textContent = 'Publication counts unavailable';
    document.querySelector('#cv-totals-error').hidden = false;
    console.error('Unable to calculate CV totals from data/cv-publications.json.', error);
  }
}

function filterCV() {
  if (!cvDataEntries) {
    return;
  }

  const term = cvSearch.value.trim().toLocaleLowerCase();
  let shown = 0;

  for (const [index, entry] of cvDataEntries.entries()) {
    const pageEntry = cvEntries[index];
    const match =
      (!term ||
        `${entry.text} ${entry.status || ''} ${pageEntry.textContent}`
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
  document.querySelector('#cv-empty').hidden = shown > 0;
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

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

menu.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', String(navigation.classList.toggle('open')));
});

navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }
});

updateCVTotals();
