# daily-raise
How to Implement a "Raise Your Hand" Feature Using the Daily.co API.

## Introduction
When people gather in real life, there are many situations where it makes sense to raise our hands:
 - In a classroom, you might raise your hand to answer a teacher's question.
 - You may raise your hand to volunteer for an improv comedy routine.
 - Members of political bodies may raise their hands to indicate a "yea" or "nay" vote.

 What about when we gather online? It turns out that hand-raising is just as popular and necessary 
 in digital spaces as it is in physical ones.

 In this tutorial, we will walk through implementing hand-raising functionality using the Daily.co API,
 which makes it easy peasy to add video chat to any web or mobile app. I'll be setting up a live site 
 using Firebase and vanilla web technologies, but you can use any web host or framework you'd like.

## Setup
Create an index.html file.
 - How much should I write about setting up the room?
 - Simple Demo file uses scripts daily-js and create-demo-room.
 - Create a button to start the call, no frills.
 - Simple Demo runs a custom script that shows events in the console, creates the meeting room, adds the iframe to the window, registers event listeners, joins the call, and starts logging events.
 - Simple Demo also demonstrates some properties and methods of the callFrame object.

Create-demo-room.js is used to create a room using the demo url (aws instance) instead of 'your-daily-account.daily.co/hello'.

It looks like I'll have to emit the app-message event on my own to raise hands. SendAppMessage doesn't broadcast to the local user.

I should also break out fake user creation to a factory function, that way I can set multiple properties at once and generate a text-based UI element.
