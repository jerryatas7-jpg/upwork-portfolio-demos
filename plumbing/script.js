// RapidFlow Plumbing & Heating — concept demo site interactions
(function () {
  'use strict';

  // Mobile nav toggle
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header shadow on scroll
  var header = document.getElementById('siteHeader');
  var onScroll = function () {
    header.style.boxShadow = window.scrollY > 8
      ? '0 4px 18px rgba(10,35,66,.14)'
      : '0 2px 12px rgba(10,35,66,.08)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Quote form: front-end only, JS success message
  var form = document.getElementById('quoteForm');
  var success = document.getElementById('formSuccess');
  var error = document.getElementById('formError');
  var successName = document.getElementById('successName');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('qName').value.trim();
      var phone = document.getElementById('qPhone').value.trim();
      // Light NZ phone validation: digits, spaces, +, (), - — at least 7 digits
      var digits = phone.replace(/\D/g, '');
      var valid = name.length >= 2 && digits.length >= 7;

      if (!valid) {
        error.hidden = false;
        return;
      }
      error.hidden = true;
      successName.textContent = name.split(' ')[0];
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
})();
