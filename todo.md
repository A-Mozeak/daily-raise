# TODO
1. Rewrite introduction.
    - Advertise Daily.co upfront.
1. ~~Complete Setup section~~
    - ~~3 paragraphs max.~~
    - ~~Point to Super Simple Demo.~~
    - ~~Lay out any extra features of index.html.~~
    - ~~Introduce custom.js.~~
    - ~~Testing Environment~~
1. ~~Remove Participant Object~~
    - ~~Point to the object in the API docs.~~
1. ~~Change the participants DIV in index.html to a UL.~~
    - ~~Rewrite the render function to reflect this change.~~
1. ~~Ensure proper participants list rendering for all participants.~~
    - ~~Refactor participant listener to use "joined-meeting" instead of passing the result from join().~~
1. ~~Refactor renderParticipant() so that usernames are handled properly.~~
1. ~~Move the "joined-meeting" paragraph to the other listener section above.~~
1. ~~Write derender function.~~
1. ~~Figure out what to do on "participant-updated".~~
1. ~~Declare top-level local_data object for local session_id and local handRaised.~~
    - ~~Refactor calls to renderParticipant, join, and toggleRaised where necessary.~~
1. Do a quick refactor of the toggle functions into toggleRaised.
    - This will illustrate the two modes of operation while also encapsulating behavior.
1. Move the "app-message" listener code to the other listener registration section.
    - Rewrite so that all the listeners are mentioned and it guides the flow of the post.
1. ~~End with the participant handler fully realised.~~
    - ~~"Our participantHandler should look like this:"~~
1. ~~Include full source code.~~
1. Generate alternate post where I explicitly stick to super simple demo.