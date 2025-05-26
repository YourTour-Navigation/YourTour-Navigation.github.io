const API_BASE = "http://yourtourserv.duckdns.org:3000"; // Set to your backend base URL if needed
const TOKEN = localStorage.getItem("token") || "";

function fetchAds() {
  fetch(`${API_BASE}/advertisements/admin/all`, {
    headers: { 'authorization': TOKEN }
  })
    .then(res => res.json())
    .then(ads => renderAds(ads))
    .catch(() => renderAds([]));
}

function renderAds(ads) {
  const tbody = document.querySelector('#ads-table tbody');
  tbody.innerHTML = '';
  if (!ads.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#888;">No advertisements found.</td></tr>';
    return;
  }
  ads.forEach(ad => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${ad.title}</td>
      <td>${ad.city}</td>
      <td>${ad.state}</td>
      <td>${ad.address}</td>
      <td>${ad.description}</td>
      <td><button onclick="deleteAd(${ad.id})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteAd(id) {
  if (!confirm('Delete this advertisement?')) return;
  fetch(`${API_BASE}/advertisements/delete/${id}`, {
    method: 'DELETE',
    headers: { 'authorization': TOKEN }
  })
    .then(res => res.json())
    .then(() => fetchAds());
}

const form = document.getElementById('add-ad-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  fetch(`${API_BASE}/advertisements/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': TOKEN
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => {
      form.reset();
      fetchAds();
    });
});

document.addEventListener('DOMContentLoaded', fetchAds); 