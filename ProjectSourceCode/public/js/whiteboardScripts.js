var stickies = document.getElementsByClassName('sticky');
var whiteboardBacking = document.getElementById('whiteBoard');

var whiteboardTop = whiteboardBacking.getBoundingClientRect().top;
var whiteboardRight = whiteboardBacking.getBoundingClientRect().right;
var whiteboardLeft = whiteboardBacking.getBoundingClientRect().left;
var whiteboardBottom = whiteboardBacking.getBoundingClientRect().bottom;

var maxElementY = whiteboardBottom-whiteboardTop-200;
var maxElementX = whiteboardRight-whiteboardLeft-200;
var minElementY = 0;
var minElementX = 0;

console.log(whiteboardBottom);
console.log(whiteboardTop);
console.log(whiteboardLeft);
console.log(whiteboardRight);

var dragStartX = 0;
var dragStartY = 0;

whiteboardBacking.addEventListener('dragover', allowDrop);
whiteboardBacking.addEventListener('drop', drop);

for(let i = 0; i<stickies.length; i++){
    stickies[i].addEventListener('dragstart', drag);
}

function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    //takes note of where the sticky note started when the drag began
    dragStartX = ev.pageX;
    dragStartY = ev.pageY;
}
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var el = document.getElementById(data);
    //calculates the difference between the drop location and dragstart
    var xDiff = ev.pageX - dragStartX;
    var yDiff = ev.pageY - dragStartY;
    //changes sitckynote left and top to be the current position (when drag started) plus the offset
    var elementLeft = +el.style.left.substring(0, el.style.left.length-2) + xDiff;
    var elementTop = +el.style.top.substring(0, el.style.top.length-2) + yDiff;
    //
    el.style.left = elementLeft + 'px';
    el.style.top = elementTop + 'px';
    el.style.zIndex += 1;
    el.style.position = 'absolute';


    if(elementTop < minElementY){
        el.style.top = minElementY + 'px';
    }
    if(elementTop > maxElementY){
        el.style.top = maxElementY + 'px';
    }
    if(elementLeft > maxElementX){
        el.style.left = maxElementX + 'px';
    }
    console.log(maxElementX);
    if(elementLeft < minElementX){
        el.style.left = minElementX + 'px';
    }
    if(ev.target == whiteboardBacking){
        whiteboardBacking.appendChild(document.getElementById(data));
    }
}

let stickyCounter = 0; //ensure unique id for each sticky

function createNewSticky() {
    const whiteBoard = document.getElementById('whiteBoard');
    const newSticky = document.createElement('div');
    const dropdown = document.getElementById('stickyColorDropdown');
    const selectedColor = dropdown.value;
    dropdown.style.display = 'none';
    
    //attributes and styles for new sticky
    newSticky.className = 'sticky';
    newSticky.id = `sticky${stickyCounter}`;
    newSticky.draggable = true;
    newSticky.style.backgroundColor = selectedColor;

    //intial position
    newSticky.style.left = '10px';
    newSticky.style.top = '10px';

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton');
    deleteButton.textContent = 'Delete';
    deleteButton.style.display = 'none';
    deleteButton.onclick = function() {
        deleteSticky(newSticky.id);
    };
    newSticky.appendChild(deleteButton);

    const stickyContent = document.createElement('p');
    stickyContent.contentEditable = 'true';
    stickyContent.textContent = 'Click to edit.';
    newSticky.appendChild(stickyContent);

    newSticky.addEventListener('dragstart', drag);

    newSticky.addEventListener('click', function(event) {
        if (deleteButton.style.display === 'none') {
            deleteButton.style.display = 'block';
            const rect = newSticky.getBoundingClientRect();
            deleteButton.style.left = `${rect.left + rect.width + 5}px`;
            deleteButton.style.top = `${rect.top + rect.height / 2 - 10}px`;
        } else {
            deleteButton.style.display = 'none';
        }

    });

    //click outside sticky to hide delete button
    document.addEventListener('click', function(event) {
        if (!newSticky.contains(event.target)) {
            deleteButton.style.display = 'none';
        }
    });
    whiteBoard.appendChild(newSticky);

    stickyCounter++;
}

function toggleColorDropdown(event) {
    const dropdown = document.getElementById('stickyColorDropdown');
    if (event.target.tagName === 'I' || event.target.id === 'newStickyButton') {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

function deleteSticky(id) {
    const sticky = document.getElementById(id);
    sticky.parentNode.removeChild(sticky);
}
