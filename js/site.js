/* Judy Lai — portfolio
 * Two small behaviours, both progressive enhancements:
 *   1. Pause offscreen video (the case studies stack several MB of autoplaying
 *      loops; without this they all decode at once).
 *   2. Mount Lottie animations from `data-lottie`, lazily — these JSON files
 *      run to several MB each, so they are only fetched once near the viewport.
 * Neither is required for the page to render.
 */
(function () {
  'use strict';

  var nearViewport = { rootMargin: '200px 0px', threshold: 0 };

  /* --- 1. Video ---------------------------------------------------------- */
  function manageVideo() {
    var videos = document.querySelectorAll('video');
    if (!videos.length) return;

    if (!('IntersectionObserver' in window)) return; // markup autoplays anyway

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          var played = video.play();
          if (played && played.catch) played.catch(function () {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.25 });

    videos.forEach(function (video) {
      video.pause();          // let the observer decide what plays
      observer.observe(video);

      // Safari occasionally drops the loop on `object-fit: cover` video.
      video.addEventListener('ended', function () {
        if (!video.loop) return;
        video.currentTime = 0;
        var played = video.play();
        if (played && played.catch) played.catch(function () {});
      });
    });
  }

  /* --- 2. Lottie --------------------------------------------------------- */
  function mountLottie(el) {
    if (el.dataset.lottieMounted) return;
    el.dataset.lottieMounted = 'true';

    fetch(el.dataset.lottie)
      .then(function (response) {
        if (!response.ok) throw new Error('Lottie ' + response.status);
        return response.json();
      })
      .then(function (animationData) {
        if (!window.lottie) return;
        window.lottie.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: el.dataset.lottieFit === 'slice'
              ? 'xMidYMid slice'
              : 'xMidYMid meet'
          }
        });
      })
      .catch(function () {
        /* Leave the container empty rather than breaking the page. */
      });
  }

  function manageLottie() {
    var slots = document.querySelectorAll('[data-lottie]');
    if (!slots.length) return;

    if (!('IntersectionObserver' in window)) {
      slots.forEach(mountLottie);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        mountLottie(entry.target);
      });
    }, nearViewport);

    slots.forEach(function (slot) { observer.observe(slot); });
  }

  function init() {
    manageVideo();
    manageLottie();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
