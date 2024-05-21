    - **Functions and Features**:
    - **Login Page**:
        - Display two profile images (Charl and Nade) for user selection.
        - Save the selected user to local storage.
        - Redirect to the main app after selection.
    - **Main App**:
        - **Header**:
        - Display the current user’s profile image at the right of the header.
        - Display a "Lists" button in the middle.
        - Clicking the profile image redirects back to the login screen.
        - Display a heading showing the current list the user is viewing.
        - **Lists Screen**:
        - Display a heading and subtext indicating how to add a new list.
        - Display a list of existing lists, each with the creator’s profile image and list name.
        - Provide a way to delete or edit lists.
        - Button to add a new list, fixed at the bottom right.
        - **Items Screen**:
        - Display the items within the selected list.
        - Each item should display the profile image of the user who added it, with small round images (32x32).
        - Provide a way to mark items as done/undone.
        - Provide a button to add new items to the list.
        - Provide a way to delete or edit items.
        - **Navigation**:
        - After login, redirect to the screen listing all lists.
        - Load the last accessed list when the user returns to the app.
        - **Responsiveness**:
        - Ensure the app is mobile-friendly and responsive.

    - **Layout Details**:
    - **Login Page (`index.html`)**:
        - **Header**:
        - Display a title with the text "Charl & Nade Lists" using the `Pacifico` font.
        - **Main Section**:
        - Display two profile images (Charl and Nade) centered on the page.
        - Each image should have the user's name below it.
        - The profile images should be clickable to select the user.
    - **Main App (`main.html`)**:
        - **Header**:
        - Left: "Lists" button with a distinct background color.
        - Center: Dynamic heading showing the current list name, styled with the `Pacifico` font.
        - Right: Profile image of the current user.
        - **Main Section**:
        - **Lists Screen**:
            - A heading and subtext indicating how to add a new list.
            - A list of existing lists, each with the creator’s profile image and list name.
            - Button to add a new list, fixed at the bottom right.
        - **Items Screen**:
            - A heading showing the list name.
            - A list of items, each with the creator’s profile image and item name.
            - Button to add a new item, fixed at the bottom right.

    - **Image Paths**:
    - Profile images: `./img/charl.png`, `./img/nade.png`
    - Small profile images: `./img/charl_small.png`, `./img/nade_small.png`

    - **Database Usage**:
    - **Firebase Realtime Database**:
        - Save user information, lists, and items.
        - Structure:
    ```json
    {
        "lists": {
            "listId1": {
                "name": "List Name",
                "addedBy": "Charl",
                "items": {
                    "itemId1": {
                    "name": "Item Name",
                    "done": false,
                    "addedBy": "Nade"
                    }
                }
            }
        }
    }
    ```

    **Firebase Configuration**:

    ```json
    const firebaseConfig = {
        apiKey: "AIzaSyBLD7N-GULmFzOApjgNC2SgQ_aln7ia96s",
        authDomain: "ally-lists.firebaseapp.com",
        databaseURL: "https://ally-lists-default-rtdb.firebaseio.com/",
        projectId: "ally-lists",
        storageBucket: "ally-lists.appspot.com",
        messagingSenderId: "644344431156",
        appId: "1:644344431156:web:22e737cae2efe67060c061"
    };
    ```

    ## File Names:
    - index.html: Login page
    - main.html: Main app page
    - login.js: Logic for the login page
    - app.js: Logic for the main app
    - service-worker.js: Service worker for offline support
    - manifest.json: Manifest file for PWA
    - Icons:
    - icons/apple-touch-icon.png
    - icons/android-chrome-192x192.png
    - icons/android-chrome-512x512.png
    - icons/favicon-16x16.png
    - icons/favicon-32x32.png
    - icons/safari-pinned-tab.svg
    - icons/mstile-150x150.png


