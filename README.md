# daily-raise
How to Implement a "Raise Your Hand" Feature Using the Daily.co API.

## Introduction
When people gather in real life, there are many situations where it makes sense to raise our hands:
 - In a classroom, you might raise your hand to answer a teacher's question.
 - You may raise your hand to volunteer for a demonstration.
 - Members of political bodies may raise their hands to indicate a "yea" or "nay" vote.

 What about when we gather online? It turns out that hand-raising is just as popular and necessary 
 in digital spaces as it is in physical ones.

 In this tutorial, we will walk through implementing hand-raising functionality using the Daily.co API,
 which makes it easy to add video chat to your web or mobile app. I'll be setting up a live site 
 using Firebase and vanilla web technologies, but you can use any web host or framework you'd like.

## Setup
To start, let's create a simple chat app using the Super Simple Demo. The Super Simple Demo imports two scripts in the document header:
 - *daily.js* - imports the Daily.co API.
 - *create-demo-room.js* - provides functions for creating a meeting room on a demo domain.

## Participant UI
We'd like to be able to see a live list of participants in the call and their individual hand states. Let's take a look at what the Daily.co API provides that can help us with this. 

First, there's the **participant object**, which provides us with state information for a given participant. The **callFrame.participants()** method provides us with the participant objects for everyone on the call.

### callFrame.participants()
 ```
{
  local: {
    user_id: "user_123",
    audio: true,
    cam_info: {
      height: 180,
      left: 286,
      top: 16,
      video_height: 720,
      video_width: 1280,
      width: 320,
    },
    video: true,
    screen: false,
    screen_info: {},
    joinedAt: Date(2019-04-30T00:06:16.011Z),
    local: true,
    owner: true,
    session_id: "3c9ba1ea-baab-4876-d501-21a1d49c0902",
    user_name: "A. User Name",
    audioTrack: <MediaStreamTrack>,
    videoTrack: <MediaStreamTrack>,
    screenVideoTrack: <MediaStreamTrack>
  },
  "e20b7ead-54c3-459e-800a-ca4f21882f2f": {
    user_id: "e20b7ead-54c3-459e-800a-ca4f21882f2f",
    audio: true,
    cam_info: {}
    video: false,
    screen: false,
    screen_info: {}.
    joinedAt: Date(2019-04-30T00:06:32.485Z),
    local: false,
    owner: false,
    session_id: "e20b7ead-54c3-459e-800a-ca4f21882f2f",
    user_name: ""
  }
}
 ```

We are also provided with a set of events that we can listen for. **"participant-joined"** fires when a participant joins the call. **"participant-updated"** fires when a change is made to a participant's state (like when their camera is turned on/off). **"participant-left"** is fired when a participant leaves the call. We can register the listeners like so, with a handler that we'll write next.

### Participant Events
```
callFrame
    .on("participant-joined", participantHandler)
    .on("participant-updated", participantHandler)
    .on("participant-left", participantHandler)
```

Our handler function will guide what we want to do in our UI.
```javascript
function participantHandler(e) {
    switch (e.action) {
        case "participant-joined":
            // Render the participant in the UI.
            break;
        case "participant-updated":
            // Make changes to the UI based on changes to the participant's state.
            break;
        case "participant-left":
            // Remove the participant from the UI.
            break;
    }
}
```

Create an index.html file.
 - Simple Demo file uses scripts daily-js and create-demo-room.
 - Create a button to start the call, no frills.
 - Simple Demo runs a custom script that shows events in the console, creates the meeting room, adds the iframe to the window, registers event listeners, joins the call, and starts logging events.
 - Simple Demo also demonstrates some properties and methods of the callFrame object.

