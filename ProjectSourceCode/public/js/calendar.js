const CALENDAR_EVENTS = [
    {
      name: 'Running',
      day: 'wednesday',
      time: '09:00',
      modality: 'In-person',
      location: 'Boulder',
      url: '',
      attendees: 'Alice, Jack, Ben',
    },
   ];
   
   
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
   
  
   
   
   function createBootstrapCard(day) {
    var card = document.createElement('div');
      (card.className = 'col-sm m-1 bg-white rounded px-1 px-md-2');
   
   
    card.id = day.toLowerCase();
    return card;
   }
   
   
   function createTitle(day) {
    const title = document.createElement('div');
    title.className = 'h6 text-center position-relative py-2';
    title.innerHTML = day;
   
   
    return title;
   }
   
   
   function createEventIcon(card) {
    const icon = document.createElement('i');
    icon.className =
      'bi bi-calendar-plus btn position-absolute translate-middle start-100  rounded p-0 btn-link';
   
   
    icon.setAttribute('onclick', `openEventModal({day: ${card.id}})`);
    return icon;
   }
   
   
   function createEventDiv() {
    const eventsDiv = document.createElement('div');
      eventsDiv.classList.add('event-container');
   
   
    return eventsDiv;
   }
   
   
   function initializeCalendar() {
   
   
   initializeEventModal();
   
  
    const calendarElement = document.getElementById('calendar');
   
  
    CALENDAR_DAYS.forEach(day => {
      var card = createBootstrapCard(day);

      calendarElement.appendChild(card);
   
   
      var title = createTitle(day);
      title.style.fontWeight = "bold";
      title.style.fontSize = "24px";
      title.style.color = "#FF9721";
      card.appendChild(title);
  
      var icon = createEventIcon(card);
      title.appendChild(icon);
   
      var eventsDiv = createEventDiv();
   
      card.appendChild(eventsDiv);
  
      console.log(card);
   
   
      });
   
   }
   
   function initializeEventModal() {
     const modalElement = document.getElementById('event-modal');
    EVENT_MODAL = new bootstrap.Modal(modalElement);
   
   
   }
   function updateEventFromModal(id) {
   
   
    CALENDAR_EVENTS[id] = {
   
   
        name: document.querySelector('#event_name').value,
        day: document.querySelector('#event_weekday').value,
        time: document.querySelector('#event_time').value,
   
   
        modality: document.querySelector('#event_modality').value,
        location: document.querySelector('#event_location').value,
        url: document.querySelector('#event_url').value,
        attendees: document.querySelector('#event_attendees').value,
   
   
    };
    updateDOM();
   
   
    EVENT_MODAL.hide();
   
   
   }
   
   
   function openEventModal({id, day}) {
    const submit_button = document.querySelector("#submit_button");
    const modal_title = document.querySelector(".modal-title");
  
   
   
    let event = CALENDAR_EVENTS[id];
   
    if (!event) {
   
   
        event = {
            name: "",
            day: day,
            time: "",
            modality: "",
            location: "",
            url: "",
            attendees: "",
        };
   
   
        modal_title.innerHTML = "Create Event";
   
   
        submit_button.innerHTML = "Create Event";
        id = CALENDAR_EVENTS.length;
   
   
    } else {
        modal_title.innerHTML = "Update Event";
        submit_button.innerHTML = "Update Event";
   
   
    }
  
   
    document.querySelector("#event_name").value = event.name;
    document.querySelector("#event_time").value = event.time;
    document.querySelector("#event_modality").value = event.modality;
    document.querySelector("#event_location").value = event.location;
    document.querySelector("#event_url").value = event.url;
    document.querySelector("#event_attendees").value = event.attendees;
   
  
    updateLocationOptions(event.modality);
    const form = document.querySelector("#event-modal form");
    form.setAttribute("action", `javascript:updateEventFromModal(${id})`);
   
   
    EVENT_MODAL.show();
   }
   function updateLocationOptions(modality_value) {

   
   const location = document.getElementById('location-container');
   const remoteUrl = document.getElementById('remote-url-container');
    if (modality_value === 'remote') {
      location.classList.add('d-none');
      remoteUrl.classList.remove('d-none');
   
   
    }
    else
    {
      location.classList.remove('d-none');
      remoteUrl.classList.add('d-none');
    }
   
   
   }
   
   
   
   
   
  
   
   
   function createEventElement(id) {
      var eventElement = document.createElement('div');
      eventElement.classList = "event row border rounded m-1 py-1";
      eventElement.id = `event-${id}`;
      return eventElement;
   
   
   }
   
   
   function createTitleForEvent(event) {
    var title = document.createElement('div');
    title.classList.add('col', 'event-title');
    title.innerHTML = event.name;
    return title;
   }
   
   
   function updateDOM() {
     const events = CALENDAR_EVENTS;
    events.forEach((event, id) => {
      let eventElement = document.querySelector(`#event-${id}`);
      if (!eventElement) {
        eventElement = createEventElement(id);
      } else {
        eventElement.remove();
        eventElement = createEventElement(id);
      }
   
   
      const title = createTitleForEvent(event);
      eventElement.appendChild(title);
      eventElement.setAttribute('onclick', `openEventModal({id: ${id}, day: '${event.day}'})`);
      const dayContainer = document.querySelector(`#${event.day.toLowerCase()} .event-container`);
      if (dayContainer) {
        dayContainer.appendChild(eventElement);
      }
    });
   
   
    updateTooltips();
    }
     
   
   
   function updateTooltips() {
   
    const eventCards = document.querySelectorAll('.event-container .alert');
    eventCards.forEach(card => {
        const eventName = card.querySelector('strong').innerText;
        const timeText = card.innerText.match(/Time: (.+)/)[1];
        const locationText = card.innerText.match(/Location: (.+)/)[1];
   
   
        const tooltipContent = `
   
   
            <strong>${eventName}</strong><br>
            Time: ${timeText}<br>
            Location: ${locationText}`
   
   
        $(card).tooltip({
            title: tooltipContent,
            html: true, 
            placement: 'top', 
            trigger: 'hover' 
   
   
        });
   
   
    });
   
   
   }