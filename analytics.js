// Lightweight GA4 loader for this static site.
// Enable by setting: <meta name="uplink-ga4-measurement-id" content="G-XXXXXXX">
// Respects browser Do Not Track.

(function initAnalytics() {
  const dnt =
    navigator.doNotTrack === '1' ||
    window.doNotTrack === '1' ||
    navigator.msDoNotTrack === '1';
  if (dnt) return;

  const meta = document.querySelector('meta[name="uplink-ga4-measurement-id"]');
  const measurementId = meta?.getAttribute('content')?.trim();

  if (!measurementId) return;
  if (!/^G-[A-Z0-9]+$/i.test(measurementId)) {
    // Avoid breaking the page if misconfigured.
    console.warn(
      '[analytics] Invalid GA4 Measurement ID in meta "uplink-ga4-measurement-id":',
      measurementId,
    );
    return;
  }

  // Load gtag.js
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(gtagScript);

  // Initialize
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    // Let GA4 handle page_view automatically for a simple static site.
    send_page_view: true,
  });
})();

