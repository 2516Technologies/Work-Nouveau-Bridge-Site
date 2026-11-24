/* Work Nouveau static-site helpers (replaces WordPress form handling). */
(function () {
  // ---- CONFIG ---------------------------------------------------------
  // 1) Contact form: create a free form at formspree.io (recipient hello@worknouveau.co)
  //    and paste its endpoint here, e.g. https://formspree.io/f/abcdwxyz
  var CONTACT_ENDPOINT = 'https://formspree.io/f/REPLACE_WITH_FORMSPREE_ID';
  // 2) Newsletter: paste the "form action" URL from a Mailchimp embedded form
  //    (Audience > Signup forms > Embedded forms). Leave empty to use an email fallback.
  var NEWSLETTER_URL = '';
  var CONTACT_EMAIL = 'hello@worknouveau.co';
  // ---------------------------------------------------------------------

  function mailto(subject, body) {
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }
  function setMsg(el, text, ok) {
    if (!el) return;
    el.style.display = 'block';
    el.textContent = text;
    el.style.color = ok ? '#1a6b3c' : '#b00020';
  }

  // ---- Contact form ---------------------------------------------------
  function initContact() {
    var form = document.getElementById('wn-contact-form');
    if (!form) return;
    var msg = document.createElement('div');
    msg.setAttribute('role', 'status');
    msg.style.cssText = 'display:none;margin-top:12px;font-weight:600';
    form.appendChild(msg);
    function val(sel) { var e = form.querySelector(sel); return e ? e.value.trim() : ''; }
    function send(e) {
      if (e) e.preventDefault();
      if (val('[data-wn="hp"]')) return; /* honeypot */
      var name = val('[data-wn="name"]'), org = val('[data-wn="organization"]'),
          email = val('[data-wn="email"]'), message = val('[data-wn="message"]');
      if (!name || !email || !message || email.indexOf('@') < 1) {
        setMsg(msg, 'Please fill in your name, a valid email, and a message.', false);
        return;
      }
      if (CONTACT_ENDPOINT.indexOf('REPLACE_WITH') > -1) {
        mailto('New message from ' + name, message + '\n\n' + name + (org ? ' / ' + org : '') + '\n' + email);
        return;
      }
      var fd = new FormData();
      fd.append('name', name); fd.append('organization', org); fd.append('email', email);
      fd.append('message', message); fd.append('_subject', 'New message from ' + name);
      setMsg(msg, 'Sending...', true);
      fetch(CONTACT_ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) { form.reset(); setMsg(msg, 'Thank you ' + name + '! Your message was sent. We will follow up soon.', true); }
          else { setMsg(msg, 'Something went wrong. Please email ' + CONTACT_EMAIL + '.', false); }
        })
        .catch(function () { setMsg(msg, 'Something went wrong. Please email ' + CONTACT_EMAIL + '.', false); });
    }
    form.addEventListener('submit', send);
    var btn = form.querySelector('[data-wn="submit"]');
    if (btn) btn.addEventListener('click', send);
  }

  // ---- Newsletter signup (Beaver Builder subscribe module) -------------
  function initNewsletter() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('.uabb-subscribe-form .uabb-button') : null;
      if (!a) return;
      e.preventDefault(); e.stopImmediatePropagation();
      var wrap = a.closest('.uabb-subscribe-form');
      var input = wrap.querySelector('input[type=email]');
      var email = input ? input.value.trim() : '';
      var err = wrap.querySelector('.uabb-form-error-message');
      if (email.indexOf('@') < 1) { if (input) input.focus(); return; }
      if (!NEWSLETTER_URL) {
        mailto('Newsletter sign-up', 'Please add me to the Work Nouveau newsletter: ' + email);
        return;
      }
      var fd = new FormData(); fd.append('EMAIL', email);
      fetch(NEWSLETTER_URL, { method: 'POST', mode: 'no-cors', body: fd }).then(function () {
        if (input) input.value = '';
        var t = wrap.querySelector('.uabb-button-text'); if (t) t.textContent = 'Thank you!';
      });
    }, true);
  }

  function init() { initContact(); initNewsletter(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
