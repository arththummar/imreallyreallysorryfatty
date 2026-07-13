// =========================================================
// Personal gift site — vanilla JS
// No localStorage / sessionStorage anywhere.
// =========================================================
(function () {
  "use strict";

  var SECRET = "disha";

  // ---------- Gate unlock ----------
  var gate = document.getElementById("gate");
  var gateForm = document.getElementById("gateForm");
  var gateCard = document.getElementById("gateCard");
  var codeInput = document.getElementById("codeInput");
  var site = document.getElementById("site");

  function revealSite() {
    // Bring the site into the DOM flow, then fade/slide it in.
    site.classList.remove("is-hidden");
    site.classList.add("reveal-start");
    site.setAttribute("aria-hidden", "false");

    // Next frame: remove the pre-reveal state so the transition runs.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        site.classList.remove("reveal-start");
      });
    });

    // Move focus to the first tab for keyboard users.
    var firstTab = document.getElementById("tab-hood");
    if (firstTab) firstTab.focus();
  }

  function unlock() {
    gate.classList.add("fade-out");

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      gate.style.display = "none";
      revealSite();
    }

    gate.addEventListener("transitionend", finish, { once: true });
    // Fallback in case transitionend doesn't fire (e.g. reduced motion).
    setTimeout(finish, 800);
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
        // allow display to apply before transitioning opacity
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
    tab.addEventListener("click", function () {
      activateTab(tab);
    });

    // Left/Right arrow navigation between tabs.
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

  // ---------- Flip cards ----------
  var cards = Array.prototype.slice.call(document.querySelectorAll(".flip-card"));

  function toggleCard(card) {
    var flipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", flipped ? "true" : "false");
  }

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      toggleCard(card);
    });

    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        toggleCard(card);
      }
    });
  });
})();
