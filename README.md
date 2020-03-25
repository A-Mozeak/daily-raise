# daily-raise
How to Implement a "Raise Your Hand" Feature Using the Daily.co API.

## Introduction
The Daily.co API makes it easy to add video call functionality to your web or mobile app. However, that's not the only thing it can do. In the few lines of code it takes to integrate the API into your app, you also gain access to a robust set of properties and methods that allow you to truly customize your video call experience. Let's take a look at one popular example: raising your hand virtually on a call.

In a real-world meeting, there are many situations in which you might want to raise your hand:
 - In a classroom, you might raise your hand to answer a teacher's question.
 - You might raise your hand to volunteer for a demonstration.
 - Members of political bodies may raise their hands to indicate a "yea" or "nay" vote.

 In digital meetings, we often find that hand-raising is just as useful and necessary as it is in the real world.

 In this tutorial, we will walk through implementing hand-raising functionality using the Daily.co API. I'll be setting up a live site 
 using Firebase and vanilla web technologies, but the same principles apply to any web host or framework that you'd prefer.

## Setup
To start, let's create a simple chat app using the [Super Simple Demo](https://docs.daily.co/docs/demos#section-1-super-simple-demo). The Super Simple Demo imports two scripts in the document header:
 - *daily.js* - imports the Daily.co API.
 - *create-demo-room.js* - provides functions for creating a meeting room on a demo domain ([View Source](https://github.com/daily-co/daily-demos/blob/master/static-demos/shared-assets/create-demo-room.js))

We're going to add our own *custom.js* file to the document, inside which we'll build our own functionality. Per the ```<script>``` at the bottom of *index.html*, copy and paste the following code into your *custom.js* file, then delete the script from the bottom of *index.html*:
```javascript
window.callFrame = window.DailyIframe.createFrame();

function showEvent(e) {
    console.log("video call event -->", e);
}
```
Be sure to either **defer** the script or add it to the end of the file so that the DOM content can load first.

### Testing Environment
For our use case, we will want to test some functionality that only works with multiple people on the call. This will require us to connect to our local host from two browser tabs (Incognito tabs work best for this). If you already have a Daily.co account (or would like to make one: [click here](https://dashboard.daily.co/)), you can join the same call from each tab using:
```javascript
async function startCall() {
    callFrame.join({ 
        url: 'https://your-domain.daily.co/hello',
        showLeaveButton: true
    });
}
```

The *create-demo-room* script allows us to test call functionality on a demo domain. This domain will be randomly generated, so we have to do a little more setup before we are able to join from two separate tabs. Add an input to *index.html* like so:
```html
<p id="callURL">Input this URL to join an existing call: </p>
<input id="joinURL" />
<button onclick="joinExisting()">Join Existing Call</button>
```

Then, modify *custom.js* so that it can provide the room link and handle the input.
```javascript
async function startCall() {
    room = await createMtgRoom();

    callFrame.join({ 
        url: room.url,
        showLeaveButton: true
    });

    document.getElementById("callURL").innerHTML += room.url;
}

function joinExisting() {
    let link = document.getElementById("joinURL").value;
    callFrame.join({ 
        url: link,
        showLeaveButton: true
    });
}
```
Now, when you want to test a feature that requires multiple call participants, you can simply copy the generated URL, point to your test server in a new tab, paste the URL into the input field, and click "Join Existing Call".

## Participant UI
We'd like to be able to see a live list of participants in the call and their individual hand states. Let's take a look at what the Daily.co API provides that can help us with this. 

First, there's the **participant object**, which provides us with state information for a given participant. The **callFrame.participants()** method provides us with the participant objects for everyone on the call ([see the full listing here](https://docs.daily.co/reference#%EF%B8%8F-participants)).

We are also provided with a set of events that we can listen for.
 - **"joined-meeting"**, fires when the local user joins the call.
 - **"participant-joined"** fires when a participant joins the call.
 - **"participant-left"** is fired when a participant leaves the call.
 - **"error"** fires on an error, which we can just log to the console for now.

 We can register the listeners like so, passing in a handler function that we'll write next:
```javascript
callFrame
    .on("joined-meeting", participantHandler)
    .on("participant-joined", participantHandler)
    .on("participant-left", participantHandler)
    .on("error", showEvent);
```

Our handler function will guide what we want to do in our UI. We set it to switch based on the **action** property of the event that has been passed in.
```javascript
function participantHandler(e) {
    switch (e.action) {
        case "joined-meeting":
            // Render the local participant.
            break;
        case "participant-joined":
            // Render the new participants in the local UI.
            break;
        case "participant-left":
            // Remove the participant from the UI.
            break;
    }
}
```

### Local Participant State
Let's take the opportunity to make a variable that will keep track of the local user's session_id and handState. This will come in handy (no pun intended) when we want to update other participants about our hand-raised state.
```javascript
let local_data = {
    session_id: "",
    handState: false,
}
```

### Rendering Participants
In our index.html file, we'll create an unordered list to contain the list of participants.
```html
<ul id="participants"></ul>
```

In the custom.js file, create a function that generates a UI element for each participant. We can later pass in the **session_id** property to id the elements.
```javascript
function renderParticipant(id, n) {
    let uiList = document.getElementById("participants");
    let render = `<li id="q${id}">
    <h3>${n}</h3>
    <p id="p${id}">Hand Lowered</p>
    </li>`;
    uiList.innerHTML += render;
}
```

We can now add this function to our **participantHandler()** function to handle the **"joined-meeting"** event. Be sure to assign the local user's **session_id** to the **local_data.session_id** variable for later use.
```javascript
case "joined-meeting":
    renderParticipant(e.participants.local.session_id, "Local");
    local_data.session_id = e.participants.local.session_id;
    break;
```

We can use the same function in case of a **"participant-joined"** event; whenever someone joins the call, their username and hand-raised state will be rendered in real-time. This event will also be emitted in a new user's browser for each participant already on the call. If you want to test this functionality, open a new Incognito tab, point it to your test environment, and join the call. You should see your participants list update accordingly.
```javascript
case "participant-joined":
    renderParticipant(e.participant.session_id, "Participant");
    break;
```

Next, let's make a function for when a participant leaves the call, and handle it in the case of a **"participant-left"** event:
```javascript
function deleteParticipant(id) {
    let el = document.getElementById("q" + id);
    el.remove();
}
```

Our participantHandler should end up looking like this:
```javascript
function participantHandler(e) {
    switch (e.action) {
      case "joined-meeting":
          renderParticipant(e.participants.local.session_id, "Local");
          local_data.session_id = e.participants.local.session_id;
          break;
      case "participant-joined":
          renderParticipant(e.participant.session_id, "Participant");
          break;
      case "participant-left":
          deleteParticipant(e.participant.session_id);
          break;
    }
}
```

Now that we have the Participant UI wired up, we can turn to raising/lowering hands.

## Toggling Hand State
We're going to set up our app so that each participant only keeps track of their hand state. They will be responsible for notifying other participants of their hand state, but this is easily accomplished using the Daily.co API. 

Create a function to toggle the local user's hand state. 
```javascript
function toggleMyHand() {
  let indicator = document.querySelector("#q" + local_data.session_id + ">p");

  if (local_data.handState == false) {
      indicator.innerHTML = "Hand Raised";
      local_data.handState = true;
  } else {
      indicator.innerHTML = "Hand Lowered";
      local_data.handState = false;
  };
}
```

We can make a new **toggleOtherHand()** function, so that we can also toggle the hand state of other participants when they send their state to us. 
```javascript
function toggleOtherHand(id, state) {
    let indicator = document.querySelector("#q" + id + ">p");
    if (state == false) {
        indicator.innerHTML = "Hand Raised";
    } else {
        indicator.innerHTML = "Hand Lowered";
    };
}
```
Now, how do we go about communicating hand state between participants on the call? The Daily.co API provides us with the **sendAppMessage()** method for just this type of occasion (see the listing [here](https://docs.daily.co/reference#%EF%B8%8F-sendappmessage)). By calling this method, we can send an **"app-message"** event to the other participants of the call. It's important to note that *an event won't be emitted for the caller of the method (the local user)*, but you can check the result of the call in a second browser tab in your test environment.

In the docs, you'll see that we need to pass in JSON serializable data to **sendAppMessage()**. This is a great opportunity to use that local_data object that we defined earlier. By default, the method sends a message to all participants of the call, but if we wanted to, we could use a second argument to specify which user to send our data to.
```javascript
callFrame.sendAppMessage(local_data);
```

Let's do a quick refactor to encapsulate the toggle behavior. We'll toggle our own hand when we get no arguments passed in, notifying the other participants in the process. We'll also be able to toggle another participant's hand when they send us their hand state.
```javascript
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
```

Now we can add an event handler to react whenever someone raises or lowers their hand on the call.
```javascript
callFrame
    .on("app-message", messageHandler)
```

Our messageHandler will call toggleRaised like so:
```javascript
function messageHandler(e) {
    toggleRaised(e.data.session_id, e.data.handState);
}
```

Let's not forget to send our hand state to new participants when they join. Update the participantHandler to match the following:
```javascript
function participantHandler(e) {
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
```

With that, were done! Join a test call from a couple of browser windows to demo the functionality.

## Conclusion
By this point, we have put together a simple video chat with a UI that displays the participants on the call and allows them to raise/lower their hands. Check below to see the full source code of the app. 

This is great functionality, but it is only a glimpse of what can be accomplished using the Daily.co API. For more, visit docs.daily.co.

### index.html
```html
<!DOCTYPE html>
<html>

  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Raise Your Hand!</title>
    <script crossorigin src="https://unpkg.com/@daily-co/daily-js"></script>

    <!-- Script "create-demo-room" sets us up with a room to join
        so that we don't have to log in or make a Daily account to test
        things out. -->
    <script src="create-demo-room.js"></script>
    <script src="custom.js" defer></script>
  </head>

  <body>
    <p><button onclick="startCall()">Start Call</button></p>
    <p id="callURL">Input this URL to join an existing call: </p>
    <h4>-OR-</h4>

    <!-- Allow joining an existing demo room. -->
    <input id="joinURL" />
    <button onclick="joinExisting()">Join Existing Call</button>

    <!-- UL "participants" contains the participants on the call. -->
    <ul id="participants"></ul>

    <!-- Button "raise-hand" will toggle the hand-raised state of the user. -->
    <p><button id="raise-hand" onclick="toggleRaised()">Raise Hand</button></p>
  </body>

</html>
```

### custom.js
```javascript
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
```

### create-demo-room.js (optional)
```javascript
const newRoomEndpoint = 'https://fu6720epic.execute-api.us-west-2.amazonaws.com/default/dailyWwwApiDemoNewCall',
    tokenEndpoint = 'https://dwdd5s2bp7.execute-api.us-west-2.amazonaws.com/default/dailyWWWApiDemoToken';

async function createMtgRoom() {
    try {
        let response = await fetch(newRoomEndpoint),
            room = await response.json();
        return room;
    } catch (e) {
        console.error(e);
    }
}

async function createMtgLinkWithToken(room, properties = {}) {
    try {
        let response = await fetch(
            tokenEndpoint, {
            method: 'POST',
            body: JSON.stringify({
                properties: {
                    room_name: room.name, ...properties
                }
            })
        },
        );
        let token = await response.text();
        return `${room.url}?t=${token}`;
    } catch (e) {
        console.error(e);
    }
}
```