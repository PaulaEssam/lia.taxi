const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const toast = (message) => {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
};

$('#year').textContent = new Date().getFullYear();
const dateInput = $('#ride-date');
if (dateInput) {
  const today = new Date();
  dateInput.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  dateInput.value = dateInput.min;
}

const menuToggle = $('.menu-toggle');
const nav = $('.main-nav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('.main-nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

$$('.booking-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.booking-tab').forEach(t => t.classList.toggle('active', t === tab));
  const isReturn = tab.dataset.mode === 'return';
  $('#return-fields').classList.toggle('hidden', !isReturn);
  $('#return-fields').querySelectorAll('input').forEach(input => input.required = isReturn);
}));

$('#swap-locations')?.addEventListener('click', () => {
  const pickup = $('input[name="pickup"]');
  const destination = $('input[name="destination"]');
  const value = pickup.value;
  pickup.value = destination.value;
  destination.value = value;
  toast('Pick-up and destination swapped.');
});

$('#booking-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form).entries());
  const summary = `Demo booking request: ${data.pickup} → ${data.destination}, ${data.date} at ${data.time}.`;
  $('#form-message').textContent = 'Looks good — your booking details are ready. Live booking confirmation requires a dispatch/backend connection.';
  toast('Demo only: booking details validated.');
  console.info(summary, data);
});

$('#contact-form')?.addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  $('#contact-message').textContent = 'Thanks! The form works as a front-end demo, but sending messages requires a backend connection.';
  toast('Demo only: message validated.');
  event.currentTarget.reset();
});

$('#newsletter-form')?.addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  $('#newsletter-message').textContent = 'Thanks — connect a mailing service to activate subscriptions.';
  toast('Demo only: email accepted.');
  event.currentTarget.reset();
});

// Smooth anchor navigation fallback and active link hint.
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
      history.replaceState(null, '', link.getAttribute('href'));
    }
  });
});

// Prevent accidental misleading live claims: all sample forms remain front-end only.
