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
   
   
   /********************** PART B: 6.1: CREATE CALENDAR *************************/
   
   
   function createBootstrapCard(day) {
    // @TODO: Use `document.createElement()` function to create a `div`
    var card = document.createElement('div');
      // Let's add some bootstrap classes to the div to upgrade its appearance
      // This is the equivalent of <div class="col-sm m-1 bg-white rounded px-1 px-md-2"> in HTML
      (card.className = 'col-sm m-1 bg-white rounded px-1 px-md-2');
   
   
    // This the equivalent of <div id="monday"> in HTML
    card.id = day.toLowerCase();
    return card;
   }
   
   
   function createTitle(day) {
    // Create weekday as the title.
   
   
    // @TODO: Use `document.createElement()` function to create a `div` for title
    const title = document.createElement('div');
    title.className = 'h6 text-center position-relative py-2';
    title.innerHTML = day;
   
   
    return title;
   }
   
   
   function createEventIcon(card) {
    // @TODO: Use `document.createElement()` function to add an icon button to the card. Use `i` to create an icon.
    const icon = document.createElement('i');
    icon.className =
      'bi bi-calendar-plus btn position-absolute translate-middle start-100  rounded p-0 btn-link';
   
   
    // adding an event listener to the click event of the icon to open the modal
    // the below line of code would be the equivalent of:
    // <i onclick="openEventModal({day: 'monday'})"> in HTML.
    icon.setAttribute('onclick', `openEventModal({day: ${card.id}})`);
    return icon;
   }
   
   
   function createEventDiv() {
    //  @TODO: Use `document.createElement()` function to add a `div` to the weekday card, which will be populated with events later.
    const eventsDiv = document.createElement('div');
      // We are adding a class for this container to able to call it when we're populating the days
      // with the events
      eventsDiv.classList.add('event-container');
   
   
    return eventsDiv;
   }
   
   
   /* The function initializeCalendar() initializes the Calendar for your events and it gets called `onload` of your page.
   We will complete the TODOs to render the Calendar in the next few steps. */
   
   
   // You will be implementing this function in section 2: Create Modal
   function initializeCalendar() {
   
   
    // Step 1: Initialize the modal (No changes required here).
   
   
   initializeEventModal();
   
   
    // @TODO: Step 2: Select the calendar div element by its id. Replace '...' with the correct code to get the div.
    // Hint: Use either `document.getElementById('id')` or `document.querySelector('#id')` to find the element.
    const calendarElement = document.getElementById('calendar');
   
   
    // Step 3: Loop through each day in the CALENDAR_DAYS array(No changes required here).
    // This array contains the days of the week (e.g., 'Monday', 'Tuesday', etc.).
    CALENDAR_DAYS.forEach(day => {
      // @TODO: Step 4: Uncomment the following line and complete the function call createBootstrapCard(day) function
      var card = createBootstrapCard(day);
      // @TODO: Step 5: Filling below lines and add the created card to the calendar element using appendChild().
      calendarElement.appendChild(card);
   
   
      // @TODO: Step 6: Uncomment the below line and call createTitle(day) function.
      var title = createTitle(day);
      // @TODO: Step 7: Filling below lines and add title to the card. Use appendChild()
      card.appendChild(title);
   
      // @TODO: Step 8: Uncomment the below line and call createEventIcon(card) function.
      var icon = createEventIcon(card);
      // @TODO: Step 9:  Filling below lines and add icon to the title. Use appendChild()
      title.appendChild(icon);
   
      // @TODO: Step 10: Uncomment the below line and and call createEventDiv() function.
      var eventsDiv = createEventDiv();
   
      // @TODO: Step 11: Filling below lines and add eventsDiv to the card. Use appendChild()
      card.appendChild(eventsDiv);
  
      // @TODO: Step 12: Filling below lines and do a console.log(card) to verify the output on your console.
      console.log(card);
   
   
      });
   
   
    // @TODO: Step 13: Uncomment this after you implement the updateDOM() function
    // updateDOM()
   }
   // end of initializeCalendar()
   
   
   /********************** PART B: 6.2: CREATE MODAL ****************************/
   
   
   function initializeEventModal() {
     const modalElement = document.getElementById('event-modal');
    // @TODO: Create a modal using JS. The id will be `event-modal`:
    // Reference: https://getbootstrap.com/docs/5.3/components/modal/#via-javascript
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
   //   <!-- "this.value" passed to updateLocationOptions() refers to the text in the "value" attribute
   
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
   
   
   
   
   
   
   /********************** PART B: 6.3: UPDATE DOM ******************************/
   
   
   function createEventElement(id) {
       // @TODO: create a new div element. Use document.createElement().
      var eventElement = document.createElement('div');
       // Adding classes to the <div> element.
      eventElement.classList = "event row border rounded m-1 py-1";
       // @TODO: Set the id attribute of the eventElement to be the same as the input id.
      // Replace <> with the correct HTML attribute
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
   
   
    // Call updateTooltips() to apply tooltips to all events
    updateTooltips();
    }
     
   /********************** PART C: 1. Display Tooltip ***************************/
   
   
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