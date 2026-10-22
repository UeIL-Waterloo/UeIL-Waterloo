'use strict';

const figureViewer = document.querySelector('#figure-viewer');

document.addEventListener('click', event => {
  let button = event.target;
  while (button && !(button.classList && button.classList.contains('figure-zoom'))) {
    button = button.parentNode;
  }
  if (!button || !document.body.contains(button)) {
    return;
  }

  const source = button.querySelector('img');
  const image = document.querySelector('#figure-viewer-img');

  image.src = source.src;
  image.alt = source.alt;
  document.querySelector('#figure-viewer-title').textContent = button.dataset.figureTitle;
  document.querySelector('#figure-viewer-caption').textContent = button.dataset.figureCaption;
  document.querySelector('#figure-viewer-citation').textContent = button.dataset.figureCitation;
  const publicationLink = document.querySelector('#figure-viewer-link');
  if (button.dataset.figureDoi) {
    publicationLink.href = `https://doi.org/${button.dataset.figureDoi}`;
    publicationLink.hidden = false;
  } else {
    publicationLink.removeAttribute('href');
    publicationLink.hidden = true;
  }
  figureViewer.showModal();
});

figureViewer.querySelector('.close').addEventListener('click', () => figureViewer.close());
figureViewer.addEventListener('click', event => {
  if (event.target === figureViewer) {
    const rect = figureViewer.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      figureViewer.close();
    }
  }
});
