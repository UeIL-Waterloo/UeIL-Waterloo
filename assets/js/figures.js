'use strict';

const figureViewer = document.querySelector('#figure-viewer');

document.querySelectorAll('.figure-zoom').forEach(button => {
  button.addEventListener('click', () => {
    const source = button.querySelector('img');
    const image = document.querySelector('#figure-viewer-img');

    image.src = source.src;
    image.alt = source.alt;
    document.querySelector('#figure-viewer-title').textContent = button.dataset.figureTitle;
    document.querySelector('#figure-viewer-caption').textContent = button.dataset.figureCaption;
    document.querySelector('#figure-viewer-link').href =
      `https://doi.org/${button.dataset.figureDoi}`;
    figureViewer.showModal();
  });
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
