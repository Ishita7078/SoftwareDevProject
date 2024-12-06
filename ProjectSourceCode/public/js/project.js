document.addEventListener('DOMContentLoaded', () => {
  const newProjectBtn = document.getElementById('newProjectBtn');
  const projectModal = document.getElementById('projectModal');
  const closeModal = document.getElementById('closeModal');
  const projectForm = document.getElementById('projectForm');

  // Open the modal
  newProjectBtn.addEventListener('click', () => {
    projectModal.classList.remove('hidden');
  });

  // Close the modal
  closeModal.addEventListener('click', () => {
    projectModal.classList.add('hidden');
  });

  // Handle project creation form submission
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const projectName = document.getElementById('projectName').value;
    const teamId = document.getElementById('teamId').value || null;

    if (!projectName) {
      alert('Project name is required.');
      return;
    }

    fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ project_name: projectName, team_id: teamId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert('Error: ' + data.error);
        } else {
          alert('Project created successfully!');
          location.reload(); // Refresh to show new project
        }
      })
      .catch((err) => console.error('Error creating project:', err));
  });
});
