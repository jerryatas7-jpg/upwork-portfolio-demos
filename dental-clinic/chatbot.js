/* BrightSmile demo chatbot — portfolio sample.
   Rule-based demo only: answers come from the page FAQ, booking is simulated,
   nothing is sent to any server. */
(function () {
  "use strict";
  var btn = document.getElementById("bsChatBtn");
  var panel = document.getElementById("bsChatPanel");
  var body = document.getElementById("bsChatBody");
  var form = document.getElementById("bsChatForm");
  var input = document.getElementById("bsChatInput");
  var chipsBox = document.getElementById("bsChatChips");
  if (!btn || !panel || !body || !form || !input) return;

  var bookingStep = null; // null | service | day | contact
  var booking = {};
  var greeted = false;

  function addMsg(text, who, isHtml) {
    var div = document.createElement("div");
    div.className = "bs-msg " + (who === "user" ? "bs-user" : "bs-bot");
    if (isHtml) div.innerHTML = text;
    else div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }
  function bot(text) { return addMsg(text, "bot", true); }
  function setChips(labels) {
    chipsBox.innerHTML = "";
    labels.forEach(function (label) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "bs-chip"; b.textContent = label;
      b.addEventListener("click", function () { send(label); });
      chipsBox.appendChild(b);
    });
  }
  function startBooking() {
    bookingStep = "service"; booking = {};
    bot("Great — I can take a booking request. Which service do you need?");
    setChips(["Check-up & clean", "Teeth whitening", "Emergency", "Kids dentistry", "Implants consult", "Invisalign consult"]);
  }
  function reply(raw) {
    var q = raw.toLowerCase();

    if (bookingStep === "service") {
      booking.service = raw;
      bookingStep = "day";
      bot("Thanks. What day suits you best? (For example: Tuesday morning, or 12 Nov.)");
      setChips(["Monday morning", "Tuesday afternoon", "Saturday morning"]);
      return;
    }
    if (bookingStep === "day") {
      booking.day = raw;
      bookingStep = "contact";
      bot("Almost done — what is your name and phone number, so the clinic can confirm?");
      setChips([]);
      return;
    }
    if (bookingStep === "contact") {
      booking.contact = raw;
      bookingStep = null;
      bot("<strong>Demo booking received (simulated):</strong><br>" +
        booking.service + " · " + booking.day + " · " + booking.contact +
        "<br><br>In a real setup this request would go straight to the clinic calendar and staff, and you would get a confirmation by phone or SMS within one business hour. No data was sent from this demo.");
      setChips(["Opening hours", "Check-up price", "Emergency help"]);
      return;
    }

    if (/(emergency|toothache|pain|broken|swelling|bleed)/.test(q)) {
      bot("For toothache, a broken tooth, lost filling or swelling, we hold same-day emergency slots every weekday. Call before 10am on (07) 3000 1234 and we will fit you in that day.");
      setChips(["Book appointment", "Opening hours"]);
      return;
    }
    if (/(hour|open|close|sunday|weekend)/.test(q)) {
      bot("We are open Mon–Fri 8:00am–5:30pm and Saturday 8:00am–1:00pm. We are closed on Sundays.");
      return;
    }
    if (/(whiten)/.test(q)) {
      bot("In-chair teeth whitening starts from $499 for a single visit, with take-home kits available to maintain the result. Want me to take a booking request?");
      setChips(["Book appointment", "Check-up price"]);
      return;
    }
    if (/(implant)/.test(q)) {
      bot("Dental implants start from $3,800 per tooth, planned with 3D imaging and placed in-house. A consult is the best first step — want me to take a booking request?");
      setChips(["Book appointment"]);
      return;
    }
    if (/(invisalign|ortho|brace|aligner)/.test(q)) {
      bot("Invisalign starts from $6,500, and we offer a free smile assessment to see if you are a candidate. Dr James Chen has completed over 600 aligner cases.");
      setChips(["Book appointment"]);
      return;
    }
    if (/(kid|child|cdb|bulk)/.test(q)) {
      bot("Kids dentistry is friendly first-visit care, and bulk billing is available for eligible kids under the CDBS. No referral is needed.");
      setChips(["Book appointment"]);
      return;
    }
    if (/(price|cost|check-up|checkup|clean)/.test(q)) {
      bot("A new patient check-up & clean starts from $99. Treatment plans are itemised before we begin, so there are no surprises, and health fund claims are handled on the spot with HICAPS.");
      setChips(["Book appointment", "Teeth whitening"]);
      return;
    }
    if (/(where|address|location|parking|find)/.test(q)) {
      bot("We are at Level 2, 42 Adelaide Street, Brisbane QLD 4000. Free parking is available at the Adelaide St car park.");
      return;
    }
    if (/(insurance|health fund|hicaps|payment|pay)/.test(q)) {
      bot("We are a preferred provider for major health funds, claims are handled on the spot with HICAPS, and flexible payment plans are available for larger treatments.");
      return;
    }
    if (/(book|appointment|reserve|see a dentist)/.test(q)) {
      startBooking();
      return;
    }
    if (/(phone|call|contact|number)/.test(q)) {
      bot("You can call us on (07) 3000 1234, or email hello@brightsmiledental.com.au. Or I can take a booking request right here.");
      setChips(["Book appointment"]);
      return;
    }
    if (/(hello|hi|hey)/.test(q)) {
      bot("Hi! Ask me about prices, opening hours, emergency care, or booking an appointment.");
      return;
    }
    bot("I do not have that in this demo FAQ, so I will not guess. Leave your name, phone and question here and the clinic would reply within one business hour — in this demo, that message is not sent anywhere. Or try one of the topics below.");
    setChips(["Opening hours", "Check-up price", "Book appointment", "Emergency help"]);
  }
  function send(text) {
    var t = (text || "").trim();
    if (!t) return;
    addMsg(t, "user", false);
    input.value = "";
    setTimeout(function () { reply(t); }, 350);
  }
  function openPanel() {
    panel.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    if (!greeted) {
      greeted = true;
      bot("Hi, I am BrightSmile's demo assistant. Ask me about prices, opening hours, or booking — or tap a topic below.");
      setChips(["Opening hours", "Check-up price", "Book appointment", "Emergency help"]);
    }
    input.focus();
  }
  btn.addEventListener("click", function () {
    if (panel.hidden) openPanel();
    else { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); }
  });
  document.getElementById("bsChatClose").addEventListener("click", function () {
    panel.hidden = true; btn.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) { panel.hidden = true; btn.setAttribute("aria-expanded", "false"); }
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    send(input.value);
  });
})();
