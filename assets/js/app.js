'use strict';

const { people, publications } = window.siteContent;

const escapeHtml = value =>
  String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));

let selectedTopic = 'Ultrafast dynamics';
const search = document.querySelector('#publication-search');
const topicCounts = publications.reduce((counts, publication) => {
  counts.set(publication.topic, (counts.get(publication.topic) || 0) + 1);
  return counts;
}, new Map());
const topicButtons = [...document.querySelectorAll('[data-filter]')];

topicButtons.forEach(button => {
  const topic = button.dataset.filter;
  button.textContent = `${topic} · ${topicCounts.get(topic) || 0}`;
});

function renderPublications() {
  const term = search.value.trim().toLowerCase();
  const matches = publications.filter(p =>
    p.topic === selectedTopic &&
    [p.title, p.authors, p.journal, p.year, p.topic].join(' ').toLowerCase().includes(term));

  document.querySelector('#publication-list').innerHTML = matches.map(p => {
    const url = p.doi ? 'https://doi.org/' + p.doi : p.citationUrl;
    const external = p.doi ? ' target="_blank" rel="noopener"' : '';
    const action = p.doi ? 'Read publication' : 'View full citation';

    return '<article class="publication">' +
      `<div class="pub-year">${p.year}</div>` +
      '<div><div class="pub-meta">' +
      `${escapeHtml(p.journal)}${p.kind ? ' &nbsp; / &nbsp; ' + escapeHtml(p.kind) : ''}` +
      '</div><h3><a href="' + escapeHtml(url) + '"' + external + '>' +
      `${escapeHtml(p.title)}</a></h3>` +
      `<p class="pub-authors">${escapeHtml(p.authors)}</p>` +
      `<p class="pub-summary">${escapeHtml(p.summary)}</p></div>` +
      '<a class="pub-arrow" href="' + escapeHtml(url) + '"' + external +
      ' aria-label="' + action + ': ' + escapeHtml(p.title) + '" title="' + action + '">' +
      (p.doi ? '↗' : '→') + '</a></article>';
  }).join('');

  const total = topicCounts.get(selectedTopic) || 0;
  document.querySelector('#result-count').textContent =
    `${selectedTopic} · ${matches.length} of ${total} highlights`;
  document.querySelector('#empty-results').hidden = matches.length > 0;
}

function setTopic(topic) {
  selectedTopic = topic;
  topicButtons.forEach(button => {
    const active = button.dataset.filter === topic;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderPublications();
}

topicButtons.forEach(button => {
  button.addEventListener('click', () => setTopic(button.dataset.filter));
});

document.querySelectorAll('[data-topic-link]').forEach(link => {
  link.addEventListener('click', () => {
    search.value = '';
    setTopic(link.dataset.topicLink);
  });
});

search.addEventListener('input', renderPublications);

function renderPeople(group = 'All') {
  const filteredPeople = people.filter(p => group === 'All' || p.group === group);
  const picturedPeople = filteredPeople.filter(p => p.pictured);
  const nonPicturedPeople = filteredPeople.filter(p => !p.pictured);

  function renderGroup(selector, groupSelector, members) {
    document.querySelector(selector).innerHTML = members
      .map(p => `<article class="person">${
        p.pictured
          ? '<div class="portrait">' +
            `<span class="initials" aria-hidden="true">${escapeHtml(p.name.split(' ').map(n => n[0]).slice(0, 2).join(''))}</span>` +
            (p.photo
              ? `<img src="${escapeHtml(p.photo)}" alt="${escapeHtml(p.name)}" loading="lazy">`
              : '<span class="photo-label">PORTRAIT TO COME</span>') +
            '</div>'
          : ''
      }<h3>${escapeHtml(p.name)}</h3>` +
      `<p class="role">${escapeHtml(p.role)}</p><p class="focus">${escapeHtml(p.focus)}</p></article>`)
      .join('');
    document.querySelector(groupSelector).hidden = members.length === 0;
  }

  renderGroup('#pictured-people-grid', '#pictured-people-group', picturedPeople);
  renderGroup('#non-pictured-people-grid', '#non-pictured-people-group', nonPicturedPeople);
}

document.querySelectorAll('[data-people]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-people]').forEach(option => {
      option.classList.toggle('active', option === button);
      option.setAttribute('aria-pressed', String(option === button));
    });
    renderPeople(button.dataset.people);
  });
});

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
});

const credits = document.querySelector('#credits');

document.querySelector('#credits-open').addEventListener('click', event => {
  event.preventDefault();
  credits.showModal();
});

credits.querySelector('.close').addEventListener('click', () => credits.close());
credits.addEventListener('click', event => {
  if (event.target === credits) {
    const rect = credits.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      credits.close();
    }
  }
});

renderPublications();
renderPeople();
