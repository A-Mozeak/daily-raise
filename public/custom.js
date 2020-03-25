window.callFrame = window.DailyIframe.createFrame();

// Local_data stores the session_id and hand state of the local user.
let local_data = {
    session_id: "",
    handState: false,
}

// StartCall creates and joins the video call.
async function startCall() {
    room = await createMtgRoom();

    callFrame.join({ 
        url: room.url,
        showLeaveButton: true
    });

    document.getElementById("callURL").innerHTML += room.url;
}

// JoinExisting joins an existing call based on the joinURL input element.
function joinExisting() {
    let link = document.getElementById("joinURL").value;
    callFrame.join({ 
        url: link,
        showLeaveButton: true
    });
}

// Register event listeners here.
callFrame
  .on("joined-meeting", participantHandler)
  .on("participant-joined", participantHandler)
  .on("participant-left", participantHandler)
  .on("app-message", messageHandler)
  .on("error", showEvent);

// ParticipantHandler runs different strategies when participants join,
// update, and leave the call.
function participantHandler(e) {
    console.log(e.action);
    switch (e.action) {
        case "joined-meeting":
            renderParticipant(e.participants.local.session_id, "Local");
            local_data.session_id = e.participants.local.session_id;
            break;
        case "participant-joined":
            renderParticipant(e.participant.session_id, "Participant");
            callFrame.sendAppMessage(local_data);
            break;
        case "participant-left":
            deleteParticipant(e.participant.session_id);
            break;
    }
}

// MessageHandler runs strategies for handling messages from the 
// sendAppMessage() function.
function messageHandler(e) {
    toggleRaised(e.data.session_id, e.data.handState);
}

// RenderParticipant creates a UI element for a participant.
function renderParticipant(id, n) {
    let uiList = document.getElementById("participants");
    let render = `<li id="q${id}">
    <h3>${n}</h3>
    <p id="p${id}">Hand Lowered</p>
    </li>`;
    uiList.innerHTML += render;
}

// DeleteParticipant removes a participant's UI element from the page.
function deleteParticipant(id) {
    let el = document.getElementById("q" + id);
    el.remove();
}

// ToggleRaised toggles the hand state of a call participant.
function toggleRaised(id, s) {
    let pid;
    let state;
    if (id == undefined) {
        pid = local_data.session_id;
        state = local_data.handState;
        callFrame.sendAppMessage(local_data);
        local_data.handState = !local_data.handState;
    } else {
        pid = id;
        state = s;
    };

    let indicator = document.getElementById("p" + pid);
    indicator.innerHTML = (state == false) ? "Hand Raised" : "Hand Lowered";
}

// ShowEvent logs video call events to the console.
function showEvent(e) {
    console.log("video call event -->", e);
}