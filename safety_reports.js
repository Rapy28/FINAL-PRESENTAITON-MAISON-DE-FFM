

fetch('/api/safety-reports')
  .then(res => res.json())
  .then(reports => {
    const tbody = document.querySelector('#safety-table tbody');
    tbody.innerHTML = '';
    (reports || []).forEach(report => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${report.submittedBy}</td>
        <td>${report.reportType}</td>
        <td>${report.description}</td>
        <td>${report.date ? report.date.substring(0,10) : ''}</td>
      `;
      tbody.appendChild(tr);
    });
  });


const form = document.getElementById('add-safety-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  fetch('/api/safety-reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => location.reload());
});
