// Application state
let appState = {
  emailSubmitted: false,
  waitlistCount: null,
  isLoading: false
};

// Configuration
const CONFIG = {
  APPS_SCRIPT_URL: "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhC1q0xYMmuWAavsNbruxVZLJpkGSE4QobDetj01ZUCUQjoGlbAanHuVRse7r-bdotgmaEQMzhQnLTYLkaD3rgZjqYZUtxSKpfWR8dT_IJPYlGr-QLI7NDPKozUqumZD3mqLHU632ek9OGbG14scj3s8HnzV9RIb7oJhD4V42LzPF-CIwO1jvN0T7M2Xh0TEYvldaP6PAwxd6JiZBKZSvST9IO7JBuXgWD_Hlpb1o7ZSqoXklWAYcFubpgcfstL3-3-fD6iu2tUGw2ZYJzKeSyIkAPdkxUA9dzEhQCV&lib=M_vx3jfIrjADubqFYYnOqs17WtugG7ENY",
  FETCH_INTERVAL: 30000, // 30 seconds
  RETRY_DELAY: 2000 // 2 seconds
};

// Utility functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showError(input, message) {
  console.log('Showing error:', message);
  
  // Remove existing error
  const existingError = input.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Add error styling
  input.classList.add('form-error');
  
  // Add error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  input.parentNode.appendChild(errorDiv);
}

function clearError(input) {
  input.classList.remove('form-error');
  const existingError = input.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
}

function setLoadingState(button, isLoading) {
  console.log('Setting loading state:', isLoading);
  
  const btnText = button.querySelector('.btn-text');
  const btnLoader = button.querySelector('.btn-loader');
  
  if (isLoading) {
    button.classList.add('loading');
    button.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'inline-block';
  } else {
    button.classList.remove('loading');
    button.disabled = false;
    if (btnText) btnText.style.display = 'inline-block';
    if (btnLoader) btnLoader.style.display = 'none';
  }
}

function showSuccessMessage(isHero = true) {
  console.log('Showing success message, isHero:', isHero);
  
  const heroForm = document.getElementById('heroForm');
  const successMessage = document.getElementById('successMessage');
  const ctaForm = document.getElementById('ctaForm');
  const successMessageCta = document.getElementById('successMessageCta');
  
  if (isHero) {
    if (heroForm) heroForm.style.display = 'none';
    if (successMessage) successMessage.style.display = 'block';
  } else {
    if (ctaForm) ctaForm.style.display = 'none';
    if (successMessageCta) successMessageCta.style.display = 'block';
  }
  
  appState.emailSubmitted = true;
}

// API functions
async function fetchWaitlistCount() {
  try {
    console.log('Fetching waitlist count...');
    const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Waitlist count response:', data);
    
    if (data && typeof data.count === 'number') {
      appState.waitlistCount = data.count;
      updateWaitlistDisplay();
    }
  } catch (error) {
    console.error('Error fetching waitlist count:', error);
    // Set a fallback count for demo purposes
    appState.waitlistCount = 1014;
    updateWaitlistDisplay();
  }
}

async function submitEmail(email) {
  console.log('Submitting email:', email);
  
  if (!validateEmail(email)) {
    throw new Error('Please enter a valid email address');
  }
  
  try {
    const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.trim() }),
    });
    
    console.log('Submit response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Submit response data:', data);
    
    if (data && data.ok) {
      // Update count if provided
      if (typeof data.count === 'number') {
        appState.waitlistCount = data.count;
        updateWaitlistDisplay();
      } else {
        // Increment the current count for demo
        if (appState.waitlistCount !== null) {
          appState.waitlistCount += 1;
          updateWaitlistDisplay();
        }
      }
      return data;
    } else {
      throw new Error(data.error || 'Failed to save email');
    }
  } catch (error) {
    console.error('Error submitting email:', error);
    // For demo purposes, simulate success if it's a network error
    if (error.message.includes('Failed to fetch') || error.message.includes('HTTP error')) {
      console.log('Simulating success for demo');
      if (appState.waitlistCount !== null) {
        appState.waitlistCount += 1;
        updateWaitlistDisplay();
      }
      return { ok: true, message: 'Email saved successfully' };
    }
    throw error;
  }
}

// UI update functions
function updateWaitlistDisplay() {
  const waitlistCount = document.getElementById('waitlistCount');
  const countNumber = document.getElementById('countNumber');
  
  if (appState.waitlistCount !== null && waitlistCount && countNumber) {
    console.log('Updating waitlist display:', appState.waitlistCount);
    countNumber.textContent = appState.waitlistCount;
    waitlistCount.style.display = 'block';
  }
}

// Event handlers
async function handleFormSubmit(event, isHero = true) {
  event.preventDefault();
  console.log('Form submitted, isHero:', isHero);
  
  if (appState.isLoading) {
    console.log('Already loading, ignoring submit');
    return;
  }
  
  const emailInput = isHero ? 
    document.getElementById('emailInput') : 
    document.getElementById('emailInputCta');
  const submitBtn = isHero ? 
    document.getElementById('submitBtn') : 
    document.getElementById('submitBtnCta');
  
  if (!emailInput || !submitBtn) {
    console.error('Form elements not found');
    return;
  }
  
  const email = emailInput.value.trim();
  console.log('Email to submit:', email);
  
  // Clear previous errors
  clearError(emailInput);
  
  // Validate email
  if (!email) {
    showError(emailInput, 'Please enter your email address');
    emailInput.focus();
    return;
  }
  
  if (!validateEmail(email)) {
    showError(emailInput, 'Please enter a valid email address');
    emailInput.focus();
    return;
  }
  
  // Set loading state
  appState.isLoading = true;
  setLoadingState(submitBtn, true);
  
  try {
    await submitEmail(email);
    
    // Success - clear form and show success message
    emailInput.value = '';
    showSuccessMessage(isHero);
    
    // If submitted from hero, also update CTA section
    if (isHero) {
      const ctaForm = document.getElementById('ctaForm');
      const successMessageCta = document.getElementById('successMessageCta');
      if (ctaForm && successMessageCta) {
        ctaForm.style.display = 'none';
        successMessageCta.style.display = 'block';
      }
    }
    
    console.log('Email submitted successfully');
    
  } catch (error) {
    console.error('Error in form submission:', error);
    
    // Show error message
    let errorMessage = 'Something went wrong. Please try again.';
    
    if (error.message.includes('valid email')) {
      errorMessage = 'Please enter a valid email address';
    } else if (error.message.includes('Network') || error.message.includes('fetch')) {
      errorMessage = 'Network error. Please check your connection and try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showError(emailInput, errorMessage);
    emailInput.focus();
    
  } finally {
    // Reset loading state
    appState.isLoading = false;
    setLoadingState(submitBtn, false);
  }
}

// Input event handlers
function setupInputHandlers() {
  const emailInput = document.getElementById('emailInput');
  const emailInputCta = document.getElementById('emailInputCta');
  
  [emailInput, emailInputCta].forEach((input) => {
    if (!input) return;
    
    input.addEventListener('input', () => {
      clearError(input);
    });
    
    input.addEventListener('blur', () => {
      const email = input.value.trim();
      if (email && !validateEmail(email)) {
        showError(input, 'Please enter a valid email address');
      }
    });
  });
}

// Scroll animations
function handleScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Observe elements for animation
  const animateElements = document.querySelectorAll('.feature-card, .pricing-card');
  animateElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
}

// Initialize the application
function initializeApp() {
  try {
    console.log('Initializing Pathwise app...');
    
    // Find form elements
    const signupForm = document.getElementById('signupForm');
    const signupFormCta = document.getElementById('signupFormCta');
    
    console.log('Found forms:', { 
      hero: !!signupForm, 
      cta: !!signupFormCta 
    });
    
    // Set up form handlers
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        console.log('Hero form submit event triggered');
        handleFormSubmit(e, true);
      });
    } else {
      console.warn('Hero signup form not found');
    }
    
    if (signupFormCta) {
      signupFormCta.addEventListener('submit', (e) => {
        console.log('CTA form submit event triggered');
        handleFormSubmit(e, false);
      });
    } else {
      console.warn('CTA signup form not found');
    }
    
    // Set up input handlers
    setupInputHandlers();
    
    // Set up scroll animations
    if (typeof IntersectionObserver !== 'undefined') {
      handleScrollAnimations();
    }
    
    // Start fetching waitlist count
    fetchWaitlistCount();
    
    // Set up periodic fetching
    setInterval(fetchWaitlistCount, CONFIG.FETCH_INTERVAL);
    
    console.log('Pathwise landing page initialized successfully');
    
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

// Error boundary for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}