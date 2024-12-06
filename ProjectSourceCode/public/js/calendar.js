const CALENDAR_EVENTS = [];

const CALENDAR_DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

let EVENT_MODAL;

// Function to create a bootstrap card for a day
function createBootstrapCard(day) {
  const card = document.createElement('div');
  card.className = 'col-sm m-1 bg-white rounded px-1 px-md-2';
  card.id = day.toLowerCase();
  return card;
}

// Function to create a title for a day card
function createTitle(day) {
  const title = document.createElement('div');
  title.className = 'h6 text-center position-relative py-2';
  title.innerHTML = day;
  return title;
}

// Function to add the "add event" icon to the day card
function createEventIcon(card) {
  const icon = document.createElement('i');
  icon.className =
      'bi bi-calendar-plus btn position-absolute translate-middle start-100 rounded p-0 btn-link';
  icon.setAttribute('onclick', `openEventModal({day: '${card.id}'})`); // Pass the day as a string
  return icon;
}

// Function to create a container for events within a day card
function createEventDiv() {
  const eventsDiv = document.createElement('div');
  eventsDiv.classList.add('event-container');
  return eventsDiv;
}

// Function to initialize the calendar
function initializeCalendar() {
  initializeEventModal();

  const calendarElement = document.getElementById('calendar');

  CALENDAR_DAYS.forEach((day) => {
      const card = createBootstrapCard(day);
      calendarElement.appendChild(card);

      const title = createTitle(day);
      title.style.fontWeight = 'bold';
      title.style.fontSize = '24px';
      title.style.color = '#FF9721';
      card.appendChild(title);

      const icon = createEventIcon(card);
      title.appendChild(icon);

      const eventsDiv = createEventDiv();
      card.appendChild(eventsDiv);
  });

  // Populate the calendar with any existing events
  updateDOM();
}

// Function to initialize the event modal
function initializeEventModal() {
  const modalElement = document.getElementById('event-modal');
  EVENT_MODAL = new bootstrap.Modal(modalElement);

  // Add an event listener for the submit button
  const submitButton = document.querySelector('#submit_button');
  submitButton.addEventListener('click', handleEventCreation);
}

// Function to handle the creation or update of an event
function handleEventCreation() {
  const form = document.querySelector('#event-modal form');
  const id = form.getAttribute('data-id');

  const newEvent = {
      name: document.querySelector('#event_name').value,
      day: document.querySelector('#event_weekday').value.toLowerCase(),
      time: document.querySelector('#event_time').value,
      modality: document.querySelector('#event_modality').value,
      location: document.querySelector('#event_location').value,
      url: document.querySelector('#event_url').value,
      attendees: document.querySelector('#event_attendees').value,
  };

  if (id === 'new') {
      // Add new event
      CALENDAR_EVENTS.push(newEvent);
      console.log('New Event Added:', newEvent);
  } else {
      // Update existing event
      CALENDAR_EVENTS[id] = newEvent;
      console.log('Event Updated:', newEvent);
  }

  updateDOM();
  EVENT_MODAL.hide();
}

// Function to open the event modal (for creating or updating events)
function openEventModal({ id, day }) {
  const modalTitle = document.querySelector('.modal-title');
  const submitButton = document.querySelector('#submit_button');

  let event;

  if (id === undefined) {
      // Create a new event
      event = {
          name: '',
          day: day.toLowerCase(),
          time: '',
          modality: 'in-person',
          location: '',
          url: '',
          attendees: '',
      };
      modalTitle.innerHTML = 'Create Event';
      submitButton.innerHTML = 'Create Event';
      document.querySelector('#event-modal form').setAttribute('data-id', 'new');
  } else {
      // Update an existing event
      event = CALENDAR_EVENTS[id];
      modalTitle.innerHTML = 'Update Event';
      submitButton.innerHTML = 'Update Event';
      document.querySelector('#event-modal form').setAttribute('data-id', id);
  }

  // Populate modal fields
  document.querySelector('#event_name').value = event.name;
  document.querySelector('#event_weekday').value = event.day;
  document.querySelector('#event_time').value = event.time;
  document.querySelector('#event_modality').value = event.modality;
  document.querySelector('#event_location').value = event.location;
  document.querySelector('#event_url').value = event.url;
  document.querySelector('#event_attendees').value = event.attendees;

  updateLocationOptions(event.modality);

  EVENT_MODAL.show();
}

// Function to toggle between location and URL fields based on event modality
function updateLocationOptions(modality_value) {
  const location = document.getElementById('location-container');
  const remoteUrl = document.getElementById('remote-url-container');
  if (modality_value === 'remote') {
      location.classList.add('d-none');
      remoteUrl.classList.remove('d-none');
  } else {
      location.classList.remove('d-none');
      remoteUrl.classList.add('d-none');
  }
}

// Function to create an event element
function createEventElement(id) {
  const eventElement = document.createElement('div');
  eventElement.classList = 'event row border rounded m-1 py-1';
  eventElement.id = `event-${id}`;
  return eventElement;
}

// Function to create a title for an event
function createTitleForEvent(event) {
  const title = document.createElement('div');
  title.classList.add('col', 'event-title');
  title.innerHTML = event.name;
  return title;
}

// Function to update the DOM with events
function updateDOM() {
  document.querySelectorAll('.event-container').forEach((container) => {
      container.innerHTML = ''; // Clear existing events
  });

  CALENDAR_EVENTS.forEach((event, id) => {
      const dayContainer = document.querySelector(`#${event.day.toLowerCase()} .event-container`);
      if (dayContainer) {
          const eventElement = createEventElement(id);
          const title = createTitleForEvent(event);
          eventElement.appendChild(title);
          eventElement.setAttribute('onclick', `openEventModal({ id: ${id}, day: '${event.day}' })`);
          dayContainer.appendChild(eventElement);
      }
  });

  console.log('DOM Updated:', CALENDAR_EVENTS);
}

initializeCalendar();
