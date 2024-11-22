// Announcement
// 1. SQL contains data of announcement description
// 2. Upon loading to an project, display that announcement description
        // Otherwise display "It's empty here..."
// When updating announcement description, it update the overview and saves the description in the SQL replacing the previous one.

function editAnnouncement() {
    const description = document.getElementById("description");
    const modalDescription = document.getElementById("announceDescription").value;

    description.innerHTML = modalDescription;
    editProgress(); // TESTING REMOVE LATER
}

/////////////////////////

// Progress Bar
// Updates onload, and when a todo is marked incomplete/complete
// 1. Tally up how many todos. Each todos is either incomplete/complete, divide complete/incomplete and put progress to bar
// 2. If progressbar reaches 100%, turn it green confetti woo woo?
function editProgress() {
   var totalCompleted;
   var totalCount;
   var progress = Math.floor((totalCompleted/totalCount)*100);
   const progressBar = document.getElementById("progressBar");
   progressBar.setAttribute("style", `width: ${progress}%`);

   var testRandom = Math.floor(((Math.random() * 11)/10)*100) ;
   progressBar.setAttribute("style", `width: ${testRandom}%`);

   // FIXME: when replace testrandom with progressbar when todo is done
   if (testRandom >= 100) {
    progressBar.setAttribute("class", "progress-bar progress-bar-striped bg-success progress-bar-animated");
   } else {
    progressBar.setAttribute("class", "progress-bar progress-bar-striped progress-bar-animated");
   }
}