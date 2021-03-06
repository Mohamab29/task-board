function validateDate(date) {
    const currentDate = new Date();
    const currentDateObject = {
        year: parseInt(currentDate.getFullYear()),
        month: parseInt(currentDate.getMonth() + 1),
        day: parseInt(currentDate.getDate())
    }
    const dateArray = date.split("-");
    const dateObject = {
        year: parseInt(dateArray[0]),
        month: parseInt(dateArray[1]),
        day: parseInt(dateArray[2])
    }

    if (dateObject.year < currentDateObject.year) {
        return false;
    }
    else if (dateObject.year === currentDateObject.year) {
        if (dateObject.month < currentDateObject.month) {
            return false;
        }
        else if (dateObject.month === currentDateObject.month) {
            if (dateObject.day < currentDateObject.day) {

                return false;
            }
        }
    }
    return true;
}
function validateTime(time) {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    const [hour, minutes] = time.split(":");
    const [intHour, intMinutes] = [parseInt(hour), parseInt(minutes)];

    if (currentHour > intHour) {
        return false;
    }
    else if (currentHour === intHour) {
        if (currentMinutes > intMinutes) {
            return false;
        }
    }
    return true;
}

function isToday(dateInput) {
    const currentDate = new Date();
    const dateObject = new Date(dateInput);
    return dateObject.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0);
}

function deleteNote(noteDiv) {
    //the noteDiv is the parent element of the whole note, we take it's id and remove it from local storage and remove the element from the
    // body of the page. 
    deleteFromLocalStorage(noteDiv.id);
    noteDiv.style.animation = "fadeOut 1s";
    setTimeout(() => {
        noteDiv.remove()
    }, 900);
}

function deleteFromLocalStorage(id) {
    const jsonArray = localStorage.getItem("notes");
    if (!jsonArray) return;
    const notes = JSON.parse(jsonArray);

    for (const note of notes) {
        if (note.nid === id) {
            const index = notes.indexOf(note);
            if (index > -1) {
                notes.splice(index, 1);
            }
        }
    }
    localStorage.removeItem("notes");
    localStorage.setItem("notes", JSON.stringify(notes));
}

function clearForm() {
    document.getElementById("form-text").value = "";
    document.getElementById("date-input").value = "";
    document.getElementById("time-input").value = "";
}

function createId() {

    const randomSmallLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // because an id in an element can't have a number as a first letter 
    //so we need the first values in the id to be a letter
    console.log();
    return randomSmallLetter + Math.random().toString(36).substr(2); // [a-z](a-z1-9)*

}
function saveToLocalStorage(noteText, noteDate, noteTime) {

    // giving each note a unique id so it can be used later,e.g.:removal of the note. 
    const noteId = createId();

    const note = {
        nid: noteId,
        body: noteText,
        date: noteDate,
        time: noteTime
    }

    let notes = [];
    const jsonArray = localStorage.getItem("notes");
    if (jsonArray) {
        notes = JSON.parse(jsonArray);
    }

    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
    return note;

}
function showNote(note) {
    //creating note element
    const noteDiv = document.createElement("Div");
    noteDiv.className = "note";
    noteDiv.id = note.nid;

    //adding glyph icon to the note
    const glyphIcon = document.createElement("i");
    glyphIcon.classList.add("fa", "fa-minus");
    glyphIcon.setAttribute("onclick", `deleteNote(${note.nid})`)
    noteDiv.appendChild(glyphIcon);

    //adding the body of the note
    const noteBody = document.createElement("Div");
    noteBody.className = ("note-body");
    note.body = note.body.replaceAll("\n", "<br>");//FOR ADDING NEW LINE
    noteBody.innerHTML = note.body;
    noteDiv.appendChild(noteBody);

    //adding the footer of the note
    const noteFooter = document.createElement("Div");
    noteFooter.classList.add("note-footer");
    const changeDate = (date) => {
        const [year, month, day] = date.split('-');
        return day + "/" + month + "/" + year;
    }
    noteFooter.innerHTML = `${changeDate(note.date)}<br>${note.time}`;
    noteDiv.appendChild(noteFooter);

    const notesBoard = document.getElementById("notes-board");
    notesBoard.appendChild(noteDiv);
}

function addNote() {
    /*
    this function gets activated whenever an add note button is clicked.
    When this function is called it checks if the textarea contains any text at all,
    and if the time to finish is added if not it will notify the user that he should a finish date and time, and press again. 
    */
    let noteText = document.getElementById("form-text").value;
    const dateInput = document.getElementById("date-input").value;
    const timeInput = document.getElementById("time-input").value;

    if (!noteText.replace(/\s/g, "").length) {
        noteText = "";
    }
    if (noteText === "") {
        alert("You can't add an empty note!\nPlease enter a text in the box and don't forget to a due date :)");
        return;
    }
    if (dateInput === "") {
        alert("To add your note to the board, you will need to choose a due date of when you will finish this task.");
        return;
    }

    if (!validateDate(dateInput)) {
        alert("The date you have entered is not valid, please enter a valid one.");
        return;
    }

    if (isToday(dateInput) && !validateTime(timeInput)) {
        alert("the time to add (which is optional) cannot be before the current time if it is on the same day.");
        return;
    }

    const note = saveToLocalStorage(noteText, dateInput, timeInput);
    showNote(note);
    clearForm();

}

window.onload = () => {

    const jsonArray = localStorage.getItem("notes");
    if (!jsonArray) return;

    const notes = JSON.parse(jsonArray);

    for (const note of notes) {
        if (!validateDate(note.date)) {
            deleteFromLocalStorage(note.nid);
            continue;
        }
        if (isToday(note.date) && !validateTime(note.time)) {
            deleteFromLocalStorage(note.nid);
            continue;
        }
        showNote(note);
    }
}
