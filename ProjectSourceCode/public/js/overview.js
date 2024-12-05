

// Announcement
// 1. SQL contains data of announcement description
// 2. Upon loading to an project, display that announcement description
        // Otherwise display "It's empty here..."
// When updating announcement description, it update the overview and saves the description in the SQL replacing the previous one.

function editAnnouncement() {
    const description = document.getElementById("description");
    const modalDescription = document.getElementById("announceDescription").value;

    description.innerHTML = modalDescription;
    //editProgress(); // TESTING REMOVE LATER
}

/////////////////////////

// Progress Bar
// Updates onload, and when a todo is marked incomplete/complete
// 1. Tally up how many todos. Each todos is either incomplete/complete, divide complete/incomplete and put progress to bar
// 2. If progressbar reaches 100%, turn it green confetti woo woo?
// When checked or unchecked it saves into the sql, sql counts total how many are checked
function editProgress() {
   var totalCompleted = 0;
   var totalCount = document.querySelectorAll('.btn-check');
   for (var i = 0; i < totalCount.length; i++) {
        if (totalCount[i].checked == true) {
            totalCompleted++;
        }
   }

   var progress = Math.floor((totalCompleted/totalCount.length)*100);
   const progressBar = document.getElementById("progressBar");
   progressBar.setAttribute("style", `width: ${progress}%`);

    //var testRandom = Math.floor(((Math.random() * 11)/10)*100) ;
   //progressBar.setAttribute("style", `width: ${testRandom}%`);

   // FIXME: when replace testrandom with progressbar when todo is done
   if (progress >= 100) {
    progressBar.setAttribute("class", "progress-bar progress-bar-striped bg-success progress-bar-animated");
   } else {
    progressBar.setAttribute("class", "progress-bar progress-bar-striped progress-bar-animated");
   }    
}

/////////////////////////

// Todos
// Display columns of 3 in each row of tasks.
// Each tasks/todo contains, the username, name of the todo, date (optional), and checkmark box (to complete/incomplete todo)
// You can add todos or delete them

// FIXME: for now i'll be making an temporyary todo to test, and add functionality

// This needs to be a modal, with title, a drop box containing each person name, date (optional), and a close / submit button
// If it is submit, add it to the SQL database and add a card into the overview (Or we could load the card thing again idk)
function addTodo() {

}
