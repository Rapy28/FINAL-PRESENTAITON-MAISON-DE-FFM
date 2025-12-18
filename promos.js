

fetch('/api/promos')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#promos-table tbody');
    tbody.innerHTML = '';
    (data.promos || []).forEach(promo => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${promo.name}</td>
        <td>${promo.discountRate}</td>
        <td>${promo.validFrom ? promo.validFrom.substring(0,10) : ''}</td>
        <td>${promo.validTo ? promo.validTo.substring(0,10) : ''}</td>
        <td>${(promo.eligibleUsers || []).join(', ')}</td>
      `;
      tbody.appendChild(tr);
    });
  });


const form = document.getElementById('add-promo-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.eligibleUsers = data.eligibleUsers ? data.eligibleUsers.split(',').map(u => u.trim()) : [];
  fetch('/api/promos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => location.reload());
});
