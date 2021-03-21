function addNote(){
    /*
    this function gets activated whenever an add note button is clicked.
    When this function is called it checks if the textarea contains any text at all,
    and if the time to finish is added if not it will notify the user that he should a finish date and time, and press again. 
    */
    const noteText  = document.getElementById("form-text").value;
    const dateAndTime  = document.getElementById("date-time-input").value;
    const notesBoard = document.getElementById("notes-board");
    if (noteText === ""){
        alert("You can't add an empty note!\nPlease enter a text in the box and don't forget to choose time and date :)");
        return;
    }
    if(dateAndTime === ""){
        alert("in order to add your note to the board, you will need to choose a date and time of when you will finish this task");
        return;
    }
    const dateAndTimeArray = dateAndTime.split("T") // separating the date and time because it is in this form: "dateTtime"   
    // our array is now in length of 2

    const id = saveToLocalStorage(noteText,dateAndTimeArray[0],dateAndTimeArray[1]);
    notesBoard.innerHTML += `<div class="task-card" id="${id}">
    ${noteText}
    <br>
    ${dateAndTimeArray[0]},${dateAndTimeArray[1]}
    </div>`;
}

function saveToLocalStorage(noteText,noteDate,noteTime){
    const noteId = Math.random().toString(36).substr(2);
    const note = {
        nid:noteId,
        body:noteText,
        date:noteDate,
        time:noteTime
    }
    let notes = [];
    const jsonArray = localStorage.getItem("notes");
    if (jsonArray) {
        notes = JSON.parse(jsonArray);
    }

    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
    return noteId;

}


console.log(Math.random().toString(36).substr(2));