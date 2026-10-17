/* BrightSmile Dental Clinic — concept demo site */
(function () {
  "use strict";

  /* ---------- Sticky nav shadow ---------- */
  var nav = document.getElementById("siteNav");
  var onScroll = function () {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Animated stat counters ---------- */
  var animateCount = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var dur = 1400;
    var start = null;
    var fmt = function (n) {
      var s = n.toFixed(decimals);
      if (decimals === 0) s = Number(s).toLocaleString("en-AU");
      return s;
    };
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    };
    requestAnimationFrame(step);
  };
  var statObserver = null;
  if ("IntersectionObserver" in window) {
    statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            animateCount(e.target);
            statObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll(".stat-num").forEach(function (el) { statObserver.observe(el); });
  } else {
    document.querySelectorAll(".stat-num").forEach(animateCount);
  }

  /* ---------- Booking form ---------- */
  var form = document.getElementById("bookingForm");
  var dateInput = document.getElementById("fDate");
  var today = new Date();
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  dateInput.min = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());

  var setError = function (id, msg) {
    var field = document.getElementById(id).closest(".field");
    var err = field.querySelector(".field-error");
    err.textContent = msg || "";
    field.classList.toggle("invalid", !!msg);
  };

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var ok = true;

    var name = document.getElementById("fName").value.trim();
    if (name.length < 2) { setError("fName", "Please enter your full name."); ok = false; }
    else setError("fName", "");

    var phone = document.getElementById("fPhone").value.trim();
    var digits = phone.replace(/\D/g, "");
    if (digits.length < 8) { setError("fPhone", "Please enter a valid phone number."); ok = false; }
    else setError("fPhone", "");

    var service = document.getElementById("fService").value;
    if (!service) { setError("fService", "Please choose a service."); ok = false; }
    else setError("fService", "");

    if (!dateInput.value) { setError("fDate", "Please pick a preferred date."); ok = false; }
    else setError("fDate", "");

    if (!ok) return;

    document.getElementById("successName").textContent = name.split(" ")[0];
    document.getElementById("successService").textContent = service;
    var success = document.getElementById("formSuccess");
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    form.querySelector('button[type="submit"]').disabled = true;
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
