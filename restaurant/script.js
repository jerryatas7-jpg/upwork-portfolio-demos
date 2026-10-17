/* ============ EMBER & OAK — interactions ============ */
(function () {
  "use strict";

  /* ---- Sticky nav background ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile hamburger ---- */
  var burger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");
  burger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      navLinks.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---- Menu tab switching ---- */
  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".menu-panel");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      panels.forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      var panel = document.getElementById("panel-" + tab.dataset.tab);
      if (panel) panel.classList.add("active");
    });
  });

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---- Reservation form (front-end only demo) ---- */
  var form = document.getElementById("resForm");
  var success = document.getElementById("resSuccess");
  var successText = document.getElementById("resSuccessText");
  var againBtn = document.getElementById("resAgain");
  var dateInput = document.getElementById("resDate");

  // No past dates
  var today = new Date();
  var iso = today.toISOString().split("T")[0];
  dateInput.setAttribute("min", iso);

  // Closed Mondays — nudge the user if they pick one
  dateInput.addEventListener("change", function () {
    if (!dateInput.value) return;
    var d = new Date(dateInput.value + "T12:00:00");
    if (d.getDay() === 1) {
      dateInput.classList.add("invalid");
      dateInput.setCustomValidity("We're closed on Mondays — please pick another day.");
    } else {
      dateInput.classList.remove("invalid");
      dateInput.setCustomValidity("");
    }
    dateInput.reportValidity();
  });

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var name = document.getElementById("resName").value.trim().split(" ")[0] || "friend";
    var date = new Date(dateInput.value + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric"
    });
    var time = document.getElementById("resTime").value;
    var party = document.getElementById("resParty").value;
    successText.textContent =
      "Thanks, " + name + "! Your request for " + party +
      " on " + date + " at " + time +
      " is in. We'll text you within the hour to confirm.";
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  againBtn.addEventListener("click", function () {
    form.reset();
    form.hidden = false;
    success.hidden = true;
  });
})();
