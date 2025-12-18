// =====================
// AUTH & SESSION CONTROL
// =====================

// Clear all auth-related data
function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isLoggedIn');
  sessionStorage.clear();
}

// Force login if user is not authenticated
function enforceAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    // Not logged in: send to login page and prevent back navigation
    window.location.replace('login.html');
  }
}

// Logout + redirect to login, blocking back button to protected pages
function logoutAndRedirect() {
  clearSession();
  window.location.replace('login.html');
}

// =====================
// PAGE INITIALIZATION
// =====================

document.addEventListener('DOMContentLoaded', () => {
  // 1) Attach logout handler if logout button exists
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutAndRedirect();
    });
  }

  // 2) Protect specific pages (require login)
  // Add any protected HTML filenames to this array
  const protectedPages = [
    'home.html',
    'profile.html',
    'admin.html',
    'beautician.html',
    'bookings.html'
  ];

  const currentPage = window.location.pathname.split('/').pop();
  if (protectedPages.includes(currentPage)) {
    enforceAuth();
    
  }
});

// =====================
// AUTO-LOGOUT ON EXIT
// =====================

// Clear session when tab/window is closed or reloaded
window.addEventListener('beforeunload', () => {
  clearSession();
  
});
  