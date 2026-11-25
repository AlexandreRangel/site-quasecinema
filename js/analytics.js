/* Quase-Cinema Lab - analytics.js
   GA4 (gtag) com Google Consent Mode v2.
   Para ativar: preencha GA4_ID com o ID de fluxo do GA4 (ex.: 'G-XXXXXXXXXX').
   Enquanto GA4_ID estiver vazio, nada e carregado, nenhum cookie e criado e o
   aviso de consentimento nao aparece. */
(function () {
  'use strict';

  var GA4_ID = 'G-5C44THF9QT'; // fluxo "http://www.quasecinema.org - GA4"
  var CONSENT_KEY = 'qc-analytics-consent';
  var root = document.documentElement;
  var lang = root.lang === 'en' || root.classList.contains('en') ? 'en' : 'pt';

  var TEXT = {
    pt: {
      message: 'Usamos o Google Analytics para entender como o site \u00e9 usado, sem publicidade. Podemos medir a audi\u00eancia?',
      accept: 'Aceitar',
      decline: 'Recusar',
      policy: 'Pol\u00edtica de Privacidade',
      label: 'Consentimento para an\u00e1lise de audi\u00eancia'
    },
    en: {
      message: 'We use Google Analytics to understand how the site is used, with no advertising. May we measure audience?',
      accept: 'Accept',
      decline: 'Decline',
      policy: 'Privacy Policy',
      label: 'Analytics consent'
    }
  };

  function readConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function saveConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* modo privado */ }
  }

  function loadTag() {
    if (window.__qcGaLoaded) return;
    window.__qcGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted'
    });
    window.gtag('config', GA4_ID, { page_language: lang });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID);
    document.head.appendChild(s);
  }

  function showBanner() {
    var t = TEXT[lang];
    var box = document.createElement('div');
    box.className = 'consent';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', t.label);
    box.innerHTML =
      '<p class="consent-text">' + t.message + '</p>' +
      '<div class="consent-actions">' +
      '<button type="button" class="btn consent-accept">' + t.accept + '</button>' +
      '<button type="button" class="btn consent-decline">' + t.decline + '</button>' +
      '<a class="consent-policy" href="' +
      (lang === 'en' ? 'privacidade.html?lang=en' : 'privacidade.html') +
      '">' + t.policy + '</a>' +
      '</div>';

    box.querySelector('.consent-accept').addEventListener('click', function () {
      saveConsent('granted');
      loadTag();
      box.remove();
      document.body.classList.remove('consent-open');
    });
    box.querySelector('.consent-decline').addEventListener('click', function () {
      saveConsent('denied');
      box.remove();
      document.body.classList.remove('consent-open');
    });

    document.body.classList.add('consent-open');
    document.body.appendChild(box);
  }

  if (!GA4_ID) return;
  if (readConsent() === 'granted') loadTag();
  else if (readConsent() === null) showBanner();
})();
