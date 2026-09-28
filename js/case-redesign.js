/* Judy Lai — portfolio
 * Case study redesign (draft): count the stat figures up when they scroll into
 * view. Progressive enhancement — without JS the final numbers are already in
 * the markup, and motion is skipped for anyone who asks for reduced motion.
 */
(function () {
  'use strict';

  var DURATION = 900; // ms

  // "3x" -> ["", "3", "x"], "$5.50" -> ["$", "5.50", ""], "Top 3" -> ["Top ", "3", ""]
  function split(text) {
    var match = /^(\D*?)([\d][\d,]*(?:\.\d+)?)(\D*)$/.exec(text.trim());
    if (!match) return null;
    return { prefix: match[1], number: match[2], suffix: match[3] };
  }

  function animate(el) {
    var parts = split(el.textContent);
    if (!parts) return;                       // no digits — leave it alone

    // A word in front of the number means it's a ranking, not a quantity
    // ("Top 3"), so it stays still. data-count="off" opts any figure out.
    if (/[A-Za-z]/.test(parts.prefix)) return;
    if (el.getAttribute('data-count') === 'off') return;

    var target = parseFloat(parts.number.replace(/,/g, ''));
    if (!isFinite(target)) return;

    var decimals = (parts.number.split('.')[1] || '').length;
    var grouped = parts.number.indexOf(',') !== -1;

    function render(value) {
      var shown = value.toFixed(decimals);
      if (grouped) shown = Number(shown).toLocaleString('en-AU', {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      });
      el.textContent = parts.prefix + shown + parts.suffix;
    }

    var start = null;
    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / DURATION, 1);
      var eased = 1 - Math.pow(1 - t, 3);     // ease-out, fast then settling
      render(target * eased);
      if (t < 1) window.requestAnimationFrame(frame);
      else render(target);                    // land exactly on the real value
    }

    render(0);
    window.requestAnimationFrame(frame);
  }

  function init() {
    var figures = document.querySelectorAll('.case2__figure');
    if (!figures.length) return;

    var still = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (still.matches) return;                // leave the final numbers in place

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);     // count once, not on every pass
        animate(entry.target);
      });
    }, { threshold: 0.6 });

    figures.forEach(function (figure) { observer.observe(figure); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
