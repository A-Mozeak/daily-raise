# Getting Started

## One-click, No-Download Video Calls
Quick links: [REST API docs](https://docs.daily.co/reference) | [Front-End API docs](https://docs.daily.co/reference#using-the-dailyco-front-end-library)

We've made video calls so easy to set up that you can add video chat to your website or mobile app with just a few lines of code. Daily.co video calls use WebRTC, which allows them to work in the browser; there's no need to coordinate app downloads for your team, friends, customers, or anyone else you want to meet with. The below image, from one of our online demos, shows our video call UI embedded in an app:

Our goals for the Daily.co API are:
 1. To get you up and running with video calls in just a few minutes.
 2. To enable a wide variety of use cases and workflows.
 3. To give you a complete, ready to go, user interface.

The following code is all you need to add a video call to a web page:

```html
<script crossorigin src="https://unpkg.com/@daily-co/daily-js"></script>
<script>
callFrame = window.DailyIframe.createFrame();
callFrame.join({ url: 'https://your-team.daily.co/hello' })
</script>             
```
See more demos and code samples [here](https://docs.daily.co/docs/demos#section-1-super-simple-demo).

If you don't want to write any code, you can simply send Daily.co room links directly to your users. These links will open a full-page video call experience in the participant's browser.

## Front-End Library
To add video calls in your web page or mobile app, you can use our front-end JavaScript library, which is illustrated in the example above. 

To further illustrate, here's an example that uses custom styling to create a full-page video call. This is just one of the many ways you can customize your video calls using the front-end JavaScript library.
```html
<script crossorigin src="https://unpkg.com/@daily-co/daily-js"></script>
<script>
callFrame = window.DailyIframe.createFrame({
  showLeaveButton: true,
  iframeStyle: {
    position: 'fixed',
    width: '100%',
    height: '100%'
  }
});
callFrame.join({ url: 'https://your-team.daily.co/hello' })
</script>
```
Demo this code live [here](https://docs.daily.co/docs/demos#section-2-standardcustom-ui-demo) or view the [API Reference Docs](https://docs.daily.co/reference).

## Back-End Library

You can also create video call rooms, configure room features, and manage users and permissions using our back-end REST API. Be sure to [register here](https://dashboard.daily.co/) to claim your free API Key.

A simple POST request can be used to create a new meeting room:
```bash
curl --request POST \
  --url https://api.daily.co/v1/rooms \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json'
```
You'll receive a ```200: Status OK``` response with the following body:
```json
{
  "id": "d61cd7b2-a273-42b4-89bd-be763fd562c1",
  "name": "w2pp2cf4kltgFACPKXmX",
  "api_created": true,
  "privacy":"public",
  "url":"https://api-demo.daily.co/w2pp2cf4kltgFACPKXmX",
  "created_at":"2019-01-26T09:01:22.000Z",
  "config":{
    "start_video_off": true
  }
}
```
---
How about controlling access to a room? POST to the **/meeting-tokens** endpoint to generate an access token:
```bash
curl --request POST \
  --url https://api.daily.co/v1/meeting-tokens \
  --header 'authorization: Bearer YOUR_API_KEY' \
  --header 'content-type: application/json'
```
### Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyIjoicm9vbS0wMjUzIiwiZCI6IjI1ZGY1MDU3LWVmMGQtNGQ5Ny1iZGU2LTBjZjI4NzI3NmNiYiIsImlhdCI6MTU0ODcyMjIwN30.LXZtTnksTjWLTNvucr0MCHL6cOaqCa2m3DKk4ugnkSQ"
}
```

Now, participants can only join the call through a URL with a valid token reference:
```
https://api-demo.daily.co/room-0253?t=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyIjoicm9vbS0wMjUzIiwiZCI6IjI1ZGY1MDU3LWVmMGQtNGQ5Ny1iZGU2LTBjZjI4NzI3NmNiYiIsImlhdCI6MTU0ODcyMjIwN30.LXZtTnksTjWLTNvucr0MCHL6cOaqCa2m3DKk4ugnkSQ
```

From call recordings to meeting analytics, the back-end REST API provides plenty of features for you to get the most out of your video calls. For more information, see the [API Reference Docs](https://docs.daily.co/reference).

## Iframes, Mobile Devices, and Browser support
Under the hood, Daily.co video calls embed a WebRTC-enabled ```<iframe>``` into your site or app. Here's a little more on supporting this technology across various platforms:

### Browser Support
Daily.co is supported on the following web browsers:

 - Chrome 74 and above
 - Safari 12.1 and above
 - Firefox 66 and above
 - Microsoft Edge 18
   - *Note: Microsoft Edge can only participate in 1:1 calls (no group calls).*
 - Electron 6 and above

*Note: Sharing a user's screen is only supported by the Chrome browser. (All browsers can view screen shares, but only a call participant using Chrome can share their screen.)*

### Mobile Support
#### iOS 12.1 and later versions
If you are starting calls from a web application on iOS, it usually makes sense to open a new tab because mobile device screen sizes tend to be small enough that there's not much room to embed the call as an iframe.

If you are starting a call from within a native application, you have to open a Safari tab from your application, because the native iOS WebView component does not (yet) allow access to the necessary camera, microphone, and network protocols.

We provide a couple of configuration parameters that help streamline the user flow into and out of a new Safari tab, though.

#### Android 5.0 and above with current security and platform updates
On Android, you can embed calls inside a WebView in your application.

For more information on embedding Daily.co calls in native mobile apps, please [see this blog post](https://www.daily.co/blog/mobile-video-chat-for-ios-and-android-app).

## How to Contact Us
If you need technical support or have questions, suggestions, or feature requests, please send us an email: help@daily.co

You can also message us through the live chat on the Daily.co website; we are responsive to your needs and will get back to you as quickly as possible.