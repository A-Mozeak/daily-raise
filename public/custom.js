function showEvent(e) {
    console.log("video call event -->", e);
}

let participants;
let handState = false;

// First, attach the video call iframe to the browser window.
window.callFrame = window.DailyIframe.createFrame();

// Then register event listeners on the callFrame for:
// When participants enter, update state (like turning their camera off), and leave the call.
// When there is a message to the app (to update on hand-raise/-lower).
// If there is an error.
callFrame
    .on("participant-joined", participantHandler)
    .on("participant-updated", participantHandler)
    .on("participant-left", participantHandler)
    .on("app-message", messageHandler)
    .on("error", showEvent);

// StartCall creates and joins the video call, and registers event handlers that will let us
// update our UI based on call events.
async function startCall() {
    // Then create a meeting room using a function from our helper script 
    // and join that room.
    //room = await createMtgRoom();

    //callFrame.join({ url: room.url });
    participants = await callFrame.join({ url: "https://amozeak.daily.co/hello" });
    renderParticipant(participants.local, "Local");
    sendHandState();
}

// EndCall destroys the callFrame.
function endCall() {
    callFrame.destroy();
}

// ParticipantHandler runs different strategies when participants join,
// update, and leave the call.
function participantHandler(e) {
    console.log(e.action);
    switch (e.action) {
        case "participant-joined":
            renderParticipant(e.participant);
            break;
        case "participant-updated":
            showEvent(e);
            break;
        case "participant-left":
            // Remove the participant from the UI.
            break;
    }
}

// MessageHandler runs strategies for handling messages from objects that
// use the sendAppMessage() function.
function messageHandler(e) {
    console.log("message received! ", e);
    toggleRaised(e.data.pid, e.data.handState);
}

// ToggleRaised toggles whether or not the local user's hand is raised.
function toggleRaised(id, s) {
    let pid;
    let state;
    if (id == undefined) {
        pid = participants.local.session_id;
        state = handState;
        handState = !handState;
    } else {
        pid = id;
        state = s;
    }
    let indicator = document.querySelector("#q" + pid + ">p");
    if(state == false) {
        indicator.innerHTML = "Hand Raised";
    } else {
        indicator.innerHTML = "Hand Lowered";
    };
    sendHandState();
}

// SendHandState packages the local user's hand state and id, then sends it.
function sendHandState() {
    let data = {
        pid: participants.local.session_id,
        handState: handState
    };
    callFrame.sendAppMessage(data, "*");
}

// RenderParticipant creates a UI element for a participant.
function renderParticipant(part, n) {
    let name = n == undefined ? "Participant " + (Object.keys(participants).length) : n;
    let uiList = document.getElementById("participants");
    let render = `<div id="q${part.session_id}">
    <h3>${name}</h3>
    <p>Hand Lowered</p>
    </div>`;
    uiList.innerHTML += render;
}