function clearForm() {
    document.getElementById("form-text").value = "";
    document.getElementById("date-input").value = "";
    document.getElementById("time-input").value = "";
}

function showOnLoadNotes(note) {
    //if the task is from yesterday
    if (validateDate(note.date, false)) {
        const notesBoard = document.getElementById("notes-board");
        note.body = note.body.replaceAll("\n", "<br>");//FOR ADDING NEW LINE
        notesBoard.innerHTML += `
    <div class="note" id="${note.nid}">
        <i class="fa fa-minus" onclick="deleteNote(${note.nid})" ></i>
        <div class="note-body">
            ${note.body}
        </div>
        <div class="row note-footer">
            ${note.date}
            <br>
            ${note.time}    
        </div>
    </div>
    `;
    }
    else {
        return;
    }
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
    noteFooter.classList.add("row", "note-footer");
    noteFooter.innerHTML = `${note.date}<br>${note.time}`;
    noteDiv.appendChild(noteFooter);

    const notesBoard = document.getElementById("notes-board");
    notesBoard.appendChild(noteDiv);
}

function validateDate(date, showAlert) {
    const currentDate = new Date();
    const currDateObject = {
        year: parseInt(currentDate.getFullYear()),
        month: parseInt(currentDate.getMonth() + 1),
        day: parseInt(currentDate.getDate())
    }
    const dateArray = date.split("-")
    const dateObject = {
        year: parseInt(dateArray[0]),
        month: parseInt(dateArray[1]),
        day: parseInt(dateArray[2])
    }

    if (dateObject.year < currDateObject.year) {
        if (showAlert) {
            alert("The date of the note can't be before the current year");
        }
        return false;
    }
    else if (dateObject.year === currDateObject.year) {
        if (dateObject.month < currDateObject.month) {
            if (showAlert) {
                alert("The date of the note can't be before the current month");
            }
            return false;
        }
        else if (dateObject.month === currDateObject.month) {
            if (dateObject.day < currDateObject.day) {
                if (showAlert) {
                    alert("The date of the note can't be before the current day");
                }
                return false;
            }
        }
    }
    return true;
}

function addNote() {
    /*
    this function gets activated whenever an add note button is clicked.
    When this function is called it checks if the textarea contains any text at all,
    and if the time to finish is added if not it will notify the user that he should a finish date and time, and press again. 
    */
    const noteText = document.getElementById("form-text").value;
    const dateInput = document.getElementById("date-input").value;
    const timeInput = document.getElementById("time-input").value;

    if (noteText === "") {
        alert("You can't add an empty note!\nPlease enter a text in the box and don't forget to a due date :)");
        return;
    }
    if (dateInput === "") {
        alert("in order to add your note to the board, you will need to choose a due date of when you will finish this task\nAdding a time is optional.");
        return;
    }
    const checkDate = validateDate(dateInput, true);
    if (checkDate) {
        const note = saveToLocalStorage(noteText, dateInput, timeInput);
        showNote(note);
        clearForm();

    }

}
function createId() {

    let randomSmallLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // because an id in an element can't have a number as a first letter 
    //so we need the first values in the id to be a letter
    console.log();
    return randomSmallLetter + Math.random().toString(36).substr(2);

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

function onLoad() {

    const jsonArray = localStorage.getItem("notes");
    if (!jsonArray) return;

    const notes = JSON.parse(jsonArray);

    for (const note of notes) {
        showOnLoadNotes(note);
    }


}
function deleteNote(noteDiv) {
    //the noteDiv is the parent element of the whole note, we take it's id and remove it from local storage and remove the element from the
    // body of the page. 
    deleteFromLocalStorage(noteDiv.id);
    noteDiv.remove();
}
function deleteFromLocalStorage(id) {
    const jsonArray = localStorage.getItem("notes");
    if (!jsonArray) return;
    const notes = JSON.parse(jsonArray);

    for (const note of notes) {
        if (note.nid == id) {
            const index = notes.indexOf(note);
            if (index > -1) {
                notes.splice(index, 1);
            }
        }
    }
    localStorage.removeItem("notes");
    localStorage.setItem("notes", JSON.stringify(notes));
}
onLoad()