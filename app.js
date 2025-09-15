// Application state
let appState = {
  emailSubmitted: false,
  waitlistCount: null,
  isLoading: false
};

// Configuration
const CONFIG = {
  APPS_SCRIPT_URL: "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhR22-E31mdolpwqXIk3wSEBopO5ZgHouJHFboHQWPm9hfDBoWmpKNPLMsyx1FDKKF09hoH_4KOXVccnDL2wBc9zMKNXPaoyjKrKyL7_rAxcTlW0wSrNcmoSnc8m0KJGKQRDzzEMx0_tnOcHtgnC2B_HJpwra4ofxEC-1nD3i3zyvJLZ_i0JeSOW4WxDIp6pENa5ZOxaRjhC1ddjaoM7Ia7W2QxElfmF8iSGgGKisOPbusjxSlfvuoEoKOmhFtCxTctJPCmLC3K9JktZl2rCdGxF4CcVA&lib=M_vx3jfIrjADubqFYYnOqs17WtugG7ENY",
  FETCH_INTERVAL: 30000
};

// Validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Show error below an input
function showError(input, message) {
  clearError(input);
  input.classList.add('form-error');
  const div = document.createElement('div');
  div.className = 'error-message';
  div.textContent = message;
  input.parentNode.appendChild(div);
}

// Clear input errors
function clearError(input) {
  input.classList.remove('form-error');
  const err = input.parentNode.querySelector('.error-message');
  if (err) err.remove();
}

// Toggle button loading state
function setLoadingState(btn, loading) {
  const txt = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  if (loading) {
    btn.classList.add('loading');
    btn.disabled = true;
    txt.style.display = 'none';
    loader.style.display = 'inline-block';
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
    txt.style.display = 'inline-block';
    loader.style.display = 'none';
  }
}

// Fetch waitlist count
async function fetchWaitlistCount() {
  try {
    const res = await fetch(CONFIG.APPS_SCRIPT_URL);
    if (!res.ok) throw new Error(res.status);
    const { count } = await res.json();
    appState.waitlistCount = count;
    const wc = document.getElementById('waitlistCount');
    const num = document.getElementById('countNumber');
    if (count > 0) {
      num.textContent = count;
      wc.style.display = 'block';
    } else {
      wc.style.display = 'none';
    }
  } catch (e) {
    console.error('Count error:', e);
    const wc = document.getElementById('waitlistCount');
    if (wc) wc.style.display = 'none';
  }
}

// Submit email
async function submitEmail(email) {
  const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw new Error(`Status ${res.status}`);
  return res.json();
}

// Handle form submits
async function handleSubmit(e, hero=true) {
  e.preventDefault();
  if (appState.isLoading) return;

  const emailEl = document.getElementById(hero?'emailInput':'emailInputCta');
  const btn = document.getElementById(hero?'submitBtn':'submitBtnCta');
  const email = emailEl.value.trim();

  clearError(emailEl);
  if (!email) return showError(emailEl,'Email is required');
  if (!validateEmail(email)) return showError(emailEl,'Invalid email');

  appState.isLoading = true;
  setLoadingState(btn,true);

  try {
    await submitEmail(email);
    document.getElementById(hero?'heroForm':'ctaForm').style.display='none';
    document.getElementById(hero?'successMessage':'successMessageCta').style.display='block';
    fetchWaitlistCount();
  } catch (err) {
    console.error('Submit error:', err);
    showError(emailEl,err.message.includes('Status')?'Network/server error':'Submission failed');
  } finally {
    appState.isLoading = false;
    setLoadingState(btn,false);
  }
}

// Initialize
function init() {
  document.getElementById('signupForm').addEventListener('submit',e=>handleSubmit(e,true));
  document.getElementById('signupFormCta').addEventListener('submit',e=>handleSubmit(e,false));
  fetchWaitlistCount();
  setInterval(fetchWaitlistCount,CONFIG.FETCH_INTERVAL);
}

if (document.readyState==='loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
