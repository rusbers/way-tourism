'use strict'

document.body.classList.add('js-enabled');

// MENU TOGGLE

const menuToggle = document.querySelector('.menu-toggle'),
      mainNav    = document.querySelector('.main-nav');

function menuToggling() {
  menuToggle.classList.toggle('menu-toggle--opened');
  mainNav.classList.toggle('main-nav--show');
}

menuToggle.addEventListener('click', menuToggling);

// TABS

document.querySelectorAll('.tabs__triggers-item').forEach((item) =>
  item.addEventListener('click', function(e) {
    e.preventDefault();

    const id = e.target.getAttribute('href').replace('#', '');

    document.querySelectorAll('.tabs__triggers-item').forEach(
      (child) => child.classList.remove('tabs__triggers-item--active')
    );

    document.querySelectorAll('.tabs__item').forEach(
      (child) => child.classList.remove('tabs__item--active')
    );

    item.classList.add('tabs__triggers-item--active');
    document.getElementById(id).classList.add('tabs__item--active');
  })
);

document.querySelector('.tabs__triggers-item').click();

// custom scrollbar

new SimpleBar(document.querySelector('.tabs__triggers'));

// POPUP