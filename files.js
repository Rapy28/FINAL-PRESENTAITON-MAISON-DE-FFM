

fetch('/api/files')
  .then(res => res.json())
  .then(files => {
    const tbody = document.querySelector('#files-table tbody');
    tbody.innerHTML = '';
    (files || []).forEach(file => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${file.filename}</td>
        <td>${file.uploadedBy || ''}</td>
        <td>${file.type || ''}</td>
        <td>${file.uploadDate ? file.uploadDate.substring(0,10) : ''}</td>
        <td><a href="${file.path}" download>Download</a></td>
      `;
      tbody.appendChild(tr);
    });
  });


const form = document.getElementById('upload-file-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(form);
  fetch('/api/files', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(() => location.reload());
});
