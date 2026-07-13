// =========================================================
// Personal gift site — vanilla JS
// No localStorage / sessionStorage anywhere.
// =========================================================
(function () {
  "use strict";

  var SECRET = "disha";
  var TRANSITION_HOLD = 1800; // ms the transition line stays on screen

  // ---------- Elements ----------
  var gate = document.getElementById("gate");
  var gateForm = document.getElementById("gateForm");
  var gateCard = document.getElementById("gateCard");
  var codeInput = document.getElementById("codeInput");
  var transition = document.getElementById("transition");
  var site = document.getElementById("site");

  // ---------- Reveal main site ----------
  function revealSite() {
    site.classList.remove("is-hidden");
    site.classList.add("reveal-start");
    site.setAttribute("aria-hidden", "false");

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        site.classList.remove("reveal-start");
      });
    });

    var firstTab = document.getElementById("tab-hood");
    if (firstTab) firstTab.focus();
  }

  // ---------- Transition screen, then site ----------
  function playTransition() {
    transition.classList.remove("is-hidden");
    transition.setAttribute("aria-hidden", "false");

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        transition.classList.add("show");
      });
    });

    setTimeout(function () {
      transition.classList.remove("show");
      transition.classList.add("fade-out");

      var gone = false;
      function hideAndReveal() {
        if (gone) return;
        gone = true;
        transition.classList.add("is-hidden");
        transition.setAttribute("aria-hidden", "true");
        revealSite();
      }
      transition.addEventListener("transitionend", hideAndReveal, { once: true });
      setTimeout(hideAndReveal, 800); // fallback (e.g. reduced motion)
    }, TRANSITION_HOLD);
  }

  // ---------- Unlock flow ----------
  function unlock() {
    gate.classList.add("fade-out");

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      gate.style.display = "none";
      playTransition();
    }
    gate.addEventListener("transitionend", finish, { once: true });
    setTimeout(finish, 800); // fallback
  }

  function rejectCode() {
    gateCard.classList.add("shake");
    codeInput.value = "";
    codeInput.focus();
  }

  gateCard.addEventListener("animationend", function () {
    gateCard.classList.remove("shake");
  });

  gateForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var value = codeInput.value.trim().toLowerCase();
    if (value === SECRET) {
      unlock();
    } else {
      rejectCode();
    }
  });

  // ---------- Tabs ----------
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));

  function activateTab(tab) {
    var targetId = tab.getAttribute("aria-controls");

    tabs.forEach(function (t) {
      var selected = t === tab;
      t.classList.toggle("is-active", selected);
      t.setAttribute("aria-selected", selected ? "true" : "false");
    });

    document.querySelectorAll(".panel").forEach(function (panel) {
      var active = panel.id === targetId;
      if (active) {
        panel.hidden = false;
        requestAnimationFrame(function () {
          panel.classList.add("is-active");
        });
      } else {
        panel.classList.remove("is-active");
        panel.hidden = true;
      }
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { activateTab(tab); });

    tab.addEventListener("keydown", function (e) {
      var dir = 0;
      if (e.key === "ArrowRight") dir = 1;
      else if (e.key === "ArrowLeft") dir = -1;
      else return;
      e.preventDefault();
      var next = tabs[(index + dir + tabs.length) % tabs.length];
      next.focus();
      activateTab(next);
    });
  });

  // ---------- Food: order ticket reveal ----------
  var orderBtn = document.getElementById("orderBtn");
  var ticket = document.getElementById("ticket");
  var ticketStamp = document.getElementById("ticketStamp");

  function stampNow() {
    if (!ticketStamp) return;
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, "0");
    var mm = String(now.getMinutes()).padStart(2, "0");
    ticketStamp.textContent = "#0713 · " + hh + ":" + mm;
  }

  if (orderBtn && ticket) {
    orderBtn.addEventListener("click", function () {
      stampNow();
      // restart the animation if pressed again
      ticket.classList.remove("revealed");
      void ticket.offsetWidth; // reflow so the animation replays
      ticket.classList.add("revealed");
      orderBtn.textContent = "order again";
    });
  }

  // ---------- Style: rack hangers ----------
  var hangers = Array.prototype.slice.call(document.querySelectorAll(".hanger"));

  function toggleHanger(hanger) {
    var open = hanger.classList.contains("is-open");
    // retrigger swing each open
    hanger.classList.remove("is-open");
    void hanger.offsetWidth;
    if (!open) {
      hanger.classList.add("is-open");
      hanger.setAttribute("aria-pressed", "true");
    } else {
      hanger.setAttribute("aria-pressed", "false");
    }
  }

  hangers.forEach(function (hanger) {
    hanger.addEventListener("click", function () { toggleHanger(hanger); });
    hanger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        toggleHanger(hanger);
      }
    });
  });

  // ---------- Image fallback (no broken-image icons) ----------
  var imgs = Array.prototype.slice.call(document.querySelectorAll(".photo img"));

  function markFailed(img) {
    var box = img.closest(".photo");
    if (!box) return;
    box.classList.add("img-failed");
    box.setAttribute("data-fallback", img.getAttribute("alt") || "photo");
  }

  imgs.forEach(function (img) {
    img.addEventListener("error", function () { markFailed(img); });
    // catch images that errored before this script ran
    if (img.complete && img.naturalWidth === 0) markFailed(img);
  });
})();
