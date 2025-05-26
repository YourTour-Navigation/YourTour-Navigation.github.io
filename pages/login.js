const API_BASE = "http://yourtourserv.duckdns.org:3000"; // Set to your backend base URL if needed
const form = document.getElementById('login-form');
const errorDiv = document.getElementById('login-error');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(async res => {
      if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
      return res.json();
    })
    .then(result => {
      localStorage.setItem('token', result.data.accessToken);
      window.location.href = '../index.html';
    })
    .catch(err => {
      errorDiv.textContent = err.message;
      errorDiv.style.display = 'block';
    });
}); 