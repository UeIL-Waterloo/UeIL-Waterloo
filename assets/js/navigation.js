'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const educationDropdown = document.querySelector('.education-dropdown');

menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    educationDropdown.open = false;
  });
});

const supportsHover = window.matchMedia
  ? window.matchMedia('(hover: hover)').matches
  : !('ontouchstart' in window);

if (supportsHover) {
  educationDropdown.addEventListener('mouseenter', () => {
    educationDropdown.open = true;
  });

  educationDropdown.addEventListener('mouseleave', () => {
    if (!educationDropdown.contains(document.activeElement)) {
      educationDropdown.open = false;
    }
  });
}

educationDropdown.addEventListener('focusin', () => {
  educationDropdown.open = true;
});

educationDropdown.addEventListener('focusout', event => {
  if (!educationDropdown.contains(event.relatedTarget)) {
    educationDropdown.open = false;
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    educationDropdown.open = false;
  }
});
