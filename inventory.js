

fetch('/api/inventory')
  .then(res => res.json())
  .then(items => {
    const tbody = document.querySelector('#inventory-table tbody');
    tbody.innerHTML = '';
    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.itemName}</td>
        <td>${item.quantity}</td>
        <td>${item.reorderLevel}</td>
        <td>${item.cost}</td>
      `;
      tbody.appendChild(tr);
    });
  });


const form = document.getElementById('add-inventory-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  fetch('/api/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => location.reload());
});
