fetch('https://sqlite-2jup.onrender.com/users')
  .then(res => res.json())
  .then(users => {
    const tbody = document.querySelector('#userTable tbody');
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td><input type="text" value="${user.name}" data-id="${user.id}" data-field="name" /></td>
        <td><input type="text" value="${user.role}" data-id="${user.id}" data-field="role" /></td>
        <td>
        <button onclick="saveRow(${user.id})">💾 Save</button>
        <button onclick="deleteRow(${user.id})" style="margin-left: 0.4rem;">🗑️ Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  });

function saveRow(id) {
  const name = document.querySelector(`input[data-id="${id}"][data-field="name"]`).value;
  const role = document.querySelector(`input[data-id="${id}"][data-field="role"]`).value;

  fetch(`https://sqlite-2jup.onrender.com/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role })
  })
  .then(res => {
    if (res.ok) {
      alert('✅ User updated');
    } else {
      alert('❌ Update failed');
    }
  });
}
function deleteRow(id) {
  if (!confirm('Delete this user?')) return;

  fetch(`https://sqlite-2jup.onrender.com/users/${id}`, {
    method: 'DELETE'
  })
  .then(res => {
    if (res.ok) {
      alert('🗑️ User deleted');
      location.reload();
    } else {
      alert('❌ Delete failed');
    }
  });
}

document.getElementById('createForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('newName').value;
  const role = document.getElementById('newRole').value;

  fetch('https://sqlite-2jup.onrender.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, role })
  })
  .then(res => res.json())
  .then(newUser => {
    alert('✅ User created!');
    location.reload(); // quick refresh to show new user
  })
  .catch(err => alert('❌ Creation failed'));
});
