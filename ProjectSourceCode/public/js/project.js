document.addEventListener('DOMContentLoaded', () => {
  const newProjectBtn = document.getElementById('newProjectBtn');
  const projectModal = document.getElementById('projectModal');
  const closeModal = document.getElementById('closeModal');
  const projectForm = document.getElementById('projectForm');
  const projectsContainer = document.getElementById('projectsContainer');

  // Open the modal
  newProjectBtn.addEventListener('click', () => {
    projectModal.classList.remove('hidden');
  });

  // Close the modal
  closeModal.addEventListener('click', () => {
    projectModal.classList.add('hidden');
  });

  // Handle form submission to add a new project
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get project name from input field
    const projectName = document.getElementById('projectName').value;

    if (!projectName) {
      alert('Project name is required.');
      return;
    }

    // Create new project card
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');

    // Add an image to the project card (optional placeholder image)
    const projectImage = document.createElement('img');
    projectImage.src = '/path/to/default-image.jpg'; // Update with your placeholder image
    projectImage.alt = projectName;
    projectImage.classList.add('project-image');

    // Add project name as a link
    const projectTitle = document.createElement('h1');
    const projectLink = document.createElement('a');
    projectLink.href = `/overview/${projectName.toLowerCase().replace(/\s+/g, '-')}`; // Generate URL-friendly link
    projectLink.textContent = projectName;

    projectTitle.appendChild(projectLink);

    // Append image and title to the card
    projectCard.appendChild(projectImage);
    projectCard.appendChild(projectTitle);

    // Add the new project card to the container
    projectsContainer.appendChild(projectCard);

    // Reset form and close the modal
    projectForm.reset();
    projectModal.classList.add('hidden');
  });
});

