# Combined Files

## Index
1. [app.js]("#app.js")
2. [index.html]("#index.html")
3. [login.js]("#login.js")
4. [main.html]("#main.html")
5. [manifest.json]("#manifest.json")
6. [service-worker.js]("#service-worker.js")

## app.js
```js
// app.js - Iteration 7

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    set,
    update,
    remove,
    push,
    child
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLD7N-GULmFzOApjgNC2SgQ_aln7ia96s",
    authDomain: "ally-lists.firebaseapp.com",
    databaseURL: "https://ally-lists-default-rtdb.firebaseio.com/",
    projectId: "ally-lists",
    storageBucket: "ally-lists.appspot.com",
    messagingSenderId: "644344431156",
    appId: "1:644344431156:web:22e737cae2efe67060c061"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentListId = null;
let showCompleted = true;

document.addEventListener('DOMContentLoaded', () => {
    // Function to set profile image and add click event listener
    function setProfileImage() {
        const user = localStorage.getItem('user');
        const profileImg = document.getElementById('profile-img');
        if (user) {
            profileImg.src = user === 'Charl' ? './img/charl.png' : './img/nade.png';
            profileImg.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = 'index.html';
            });
        }
    }

    // Call the function to set profile image when the document is loaded
    setProfileImage();
});

// Service worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}

document.getElementById('show-lists').addEventListener('click', showLists);
document.getElementById('toggle-completed').addEventListener('click', toggleCompletedItems);

const addButton = document.getElementById('add-button');
const inputContainer = document.getElementById('input-container');
const newInput = document.getElementById('new-input');
const submitButton = document.getElementById('submit-button');

addButton.addEventListener('click', () => {
    inputContainer.style.display = 'flex';
    newInput.focus();
});

submitButton.addEventListener('click', () => {
    if (currentListId) {
        addItem(currentListId);
    } else {
        addList();
    }
});

const editModal = document.getElementById('edit-modal');
const closeModal = document.getElementsByClassName('close')[0];
const updateItemButton = document.getElementById('update-item');
const deleteItemButton = document.getElementById('delete-item');
let editItemId = null;

closeModal.onclick = function() {
    editModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == editModal) {
        editModal.style.display = "none";
    }
}

updateItemButton.addEventListener('click', updateItem);
deleteItemButton.addEventListener('click', deleteItem);

// Load last accessed list or show lists
const lastList = localStorage.getItem('lastList');
if (lastList) {
    showListItems(lastList);
} else {
    showLists();
}

async function showLists() {
    inputContainer.style.display = 'none';
    addButton.querySelector('img').src = '/img/icons/add_list.png';
    currentListId = null;

    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `lists`));
    const container = document.getElementById('lists-container');
    container.innerHTML = '';

    container.classList.add('lists-container'); // Ensure this class is added

    const subtext = document.createElement('p');
    subtext.classList.add('text-sm', 'mb-4');
    subtext.innerText = 'Press the + button to add a list';
    container.appendChild(subtext);

    if (snapshot.exists()) {
        const lists = snapshot.val();
        if (Object.keys(lists).length === 0) {
            const noListsMessage = document.createElement('p');
            noListsMessage.classList.add('text-gray-400', 'text-center', 'mt-4');
            noListsMessage.innerText = 'No lists available. Tap on the + button to add a list.';
            container.appendChild(noListsMessage);
        } else {
            Object.keys(lists).forEach(key => {
                const list = lists[key];
                const listItem = document.createElement('div');
                listItem.classList.add('bg-gray-800', 'text-gray-200', 'p-2', 'rounded', 'shadow', 'mb-2', 'flex', 'items-center', 'list-item');
                const listImage = document.createElement('img');
                listImage.src = list.addedBy === 'Charl' ? './img/charl_small.png' : './img/nade_small.png';
                listImage.classList.add('w-8', 'h-8', 'rounded-full', 'mr-2');
                listItem.appendChild(listImage);
                const listText = document.createElement('span');
                listText.innerText = list.name;
                listItem.appendChild(listText);
                listItem.addEventListener('click', () => showListItems(key));

                container.appendChild(listItem);
            });
        }
    } else {
        const noListsMessage = document.createElement('p');
        noListsMessage.classList.add('text-gray-400', 'text-center', 'mt-4');
        noListsMessage.innerText = 'No lists available. Tap on the + button to add a list.';
        container.appendChild(noListsMessage);
    }
}

async function addList() {
    const listName = newInput.value;
    if (listName) {
        const user = localStorage.getItem('user');
        const newListRef = push(ref(db, 'lists'));
        await set(newListRef, {
            name: listName,
            items: [],
            addedBy: user
        });
        showLists();
    }
}

async function showListItems(listId) {
    inputContainer.style.display = 'none';
    addButton.querySelector('img').src = '/img/icons/add_item.png';
    currentListId = listId;

    localStorage.setItem('lastList', listId);
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `lists/${listId}`));
    const container = document.getElementById('lists-container');
    container.innerHTML = '';
    const listNameElement = document.getElementById('current-list');

    if (snapshot.exists()) {
        const list = snapshot.val();
        listNameElement.innerText = `List: ${list.name}`;

        if (!list.items || Object.keys(list.items).length === 0) {
            const noItemsMessage = document.createElement('p');
            noItemsMessage.classList.add('text-gray-400', 'text-center', 'mt-4');
            noItemsMessage.innerText = 'No items in this list. Tap on the + button to add an item.';
            container.appendChild(noItemsMessage);
        } else {
            Object.keys(list.items).forEach(key => {
                const item = list.items[key];
                if (showCompleted || !item.done) {
                    const listItem = document.createElement('div');
                    listItem.classList.add('bg-gray-800', 'text-gray-200', 'p-2', 'rounded', 'shadow', 'mb-2', 'flex', 'items-center', 'list-item');
                    
                    const itemImage = document.createElement('img');
                    itemImage.src = item.addedBy === 'Charl' ? './img/charl_small.png' : './img/nade_small.png';
                    itemImage.classList.add('w-8', 'h-8', 'rounded-full', 'mr-2');
                    listItem.appendChild(itemImage);

                    const itemText = document.createElement('span');
                    itemText.innerText = item.name;
                    listItem.appendChild(itemText);

                    const toggleLabel = document.createElement('label');
                    toggleLabel.classList.add('toggle-label');
                    
                    const toggleInput = document.createElement('input');
                    toggleInput.type = 'checkbox';
                    toggleInput.checked = item.done;
                    toggleInput.addEventListener('change', () => toggleItemDone(listId, key));
                    
                    toggleLabel.appendChild(toggleInput);
                    listItem.appendChild(toggleLabel);

                    container.appendChild(listItem);
                }
            });
        }
    }
}

async function addItem(listId) {
    const itemName = newInput.value;
    if (itemName) {
        const user = localStorage.getItem('user');
        const listRef = ref(db, `lists/${listId}/items`);
        const newItemRef = push(listRef);
        await set(newItemRef, {
            name: itemName,
            done: false,
            addedBy: user
        });
        showListItems(listId);
    }
}

async function toggleItemDone(listId, itemId) {
    const itemRef = ref(db, `lists/${listId}/items/${itemId}`);
    const snapshot = await get(itemRef);
    if (snapshot.exists()) {
        const item = snapshot.val();
        await update(itemRef, {
            done: !item.done
        });
        showListItems(listId);
    }
}

async function editListItem(listId, itemId, itemName) {
    editItemId = itemId;
    document.getElementById('edit-item-name').value = itemName;
    editModal.style.display = "block";
}

async function updateItem() {
    const itemName = document.getElementById('edit-item-name').value;
    const itemRef = ref(db, `lists/${currentListId}/items/${editItemId}`);
    await update(itemRef, {
        name: itemName
    });
    editModal.style.display = "none";
    showListItems(currentListId);
}

async function deleteItem() {
    const itemRef = ref(db, `lists/${currentListId}/items/${editItemId}`);
    await remove(itemRef);
    editModal.style.display = "none";
    showListItems(currentListId);
}

function toggleCompletedItems() {
    showCompleted = !showCompleted;
    if (currentListId) {
        showListItems(currentListId);
    }
}
```

## index.html
```html
// index.html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" sizes="180x180" href="/img/icons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/img/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/img/icons/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/img/icons/android-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/img/icons/android-chrome-512x512.png">
    <link rel="mask-icon" href="/img/icons/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#00aba9">
    <meta name="theme-color" content="#ffffff">
    <title>Charl & Nade Lists</title>
    <style>
        body {
            background-color: #1a202c;
            /* Dark background */
            color: #cbd5e0;
            /* Light text color */
        }

        .header,
        .button {
            background-color: #2d3748;
            /* Darker background for header and buttons */
        }

        .user-selection {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
            margin-top: 20%;
        }

        .user-selection img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            cursor: pointer;
        }

        @media (min-width: 768px) {
            .user-selection img {
                width: 150px;
                height: 150px;
            }
        }

        .pacifico-font {
            font-family: 'Pacifico', cursive;
        }
    </style>
</head>

<body class="bg-gray-900">
    <header class="header bg-blue-800 p-4 text-white text-center">
        <h1 class="text-4xl font-bold text-center text-white mb-2 pacifico-font">Charl & Nade Lists</h1>
    </header>
    <main class="user-selection">
        <div id="charl" class="user">
            <img src="./img/charl.png" alt="Charl">
            <p class="text-center mt-2">Charl</p>
        </div>
        <div id="nade" class="user">
            <img src="./img/nade.png" alt="Nade">
            <p class="text-center mt-2">Nade</p>
        </div>
    </main>
    <script type="module" src="login.js"></script>
</body>

</html>
```

## login.js
```js
// login.js
document.getElementById('charl').addEventListener('click', () => login('Charl'));
document.getElementById('nade').addEventListener('click', () => login('Nade'));

function login(user) {
    localStorage.setItem('user', user);
    localStorage.setItem('lastList', ''); // Clear last accessed list on login
    window.location.href = 'main.html';
}
```

## main.html
```html
<!-- main.html -->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" sizes="180x180" href="/img/icons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/img/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/img/icons/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/img/icons/android-chrome-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/img/icons/android-chrome-512x512.png">
    <link rel="mask-icon" href="/img/icons/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#00aba9">
    <meta name="theme-color" content="#ffffff">
    <title>Charl & Nade Lists</title>
    <style>
        body {
            background-color: #1a202c;
            color: #cbd5e0;
        }

        .header {
            background-color: #2d3748;
        }

        .button {
            background-color: #4A5568;
        }

        .profile-img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
        }

        @media (min-width: 768px) {
            .profile-img {
                width: 50px;
                height: 50px;
            }
        }

        .pacifico-font {
            font-family: 'Pacifico', cursive;
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0, 0, 0);
            background-color: rgba(0, 0, 0, 0.4);
        }

        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }

        /* Add button styles */
        .add-button {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background-color: #2d3748;
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .add-button img {
            width: 24px;
            height: 24px;
        }

        .input-container {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
        }

        .input-container input {
            flex: 1;
            padding: 8px;
            border: 1px solid #4a5568;
            border-radius: 4px;
            margin-right: 8px;
        }

        .input-container button {
            background-color: #4a5568;
            padding: 8px;
            border: none;
            border-radius: 4px;
        }

        .input-container button img {
            width: 24px;
            height: 24px;
        }
    </style>
</head>

<body class="bg-gray-900">
    <header class="header bg-blue-800 p-4 text-white flex justify-between items-center">
        <button id="show-lists" class="button bg-green-500 text-white p-2 rounded">Lists</button>
        <h1 id="current-list" class="text-center flex-1 pacifico-font">Simple PWA List App</h1>
        <img id="profile-img" class="profile-img" src="" alt="Profile Image">
    </header>
    <main class="p-4">
        <div class="input-container" id="input-container" style="display: none;">
            <input type="text" id="new-input" placeholder="Enter name">
            <button id="submit-button"><img src="./img/icons/add_list.png" alt="Add"></button>
        </div>
        <div id="lists-container" class="mt-4"></div>
        <button id="toggle-completed" class="button fixed bottom-4 left-4 bg-gray-500 text-white p-4 rounded-full">Toggle Completed</button>
        <div class="add-button" id="add-button">
            <img src="./img/icons/add_list.png" alt="Add">
        </div>
    </main>

    <!-- Edit Modal -->
    <div id="edit-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Edit Item</h2>
            <input type="text" id="edit-item-name" class="border p-2 mb-2 w-full">
            <button id="update-item" class="bg-blue-500 text-white p-2 rounded">Update</button>
            <button id="delete-item" class="bg-red-500 text-white p-2 rounded">Delete</button>
        </div>
    </div>

    <script type="module" src="app.js?test1"></script>
</body>

</html>
```

## manifest.json
```json
// manifest.json
{
    "name": "C & N Lists",
    "short_name": "C & N Lists",
    "start_url": "/index.html",
    "display": "standalone",
    "background_color": "#1a202c",
    "theme_color": "#1a202c",
    "icons": [{
            "src": "img/icons/apple-touch-icon.png",
            "sizes": "180x180",
            "type": "image/png"
        },
        {
            "src": "img/icons/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "img/icons/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        },
        {
            "src": "img/icons/favicon-16x16.png",
            "sizes": "16x16",
            "type": "image/png"
        },
        {
            "src": "img/icons/favicon-32x32.png",
            "sizes": "32x32",
            "type": "image/png"
        },
        {
            "src": "img/icons/mstile-150x150.png",
            "sizes": "150x150",
            "type": "image/png"
        }
    ]
}
```

## service-worker.js
```js
// service-worker.js - Iteration 2

const CACHE_NAME = 'pwa-list-app-cache';
const urlsToCache = [
    '/',
    '/index.html',
    '/main.html',
    '/login.js',
    '/app.js',
    '/service-worker.js',
    'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Check if the URL contains the reset parameter
    if (requestUrl.searchParams.has('reset')) {
        // Reset the cache
        event.respondWith(
            caches.delete(CACHE_NAME).then(() => {
                return fetch(event.request).then(response => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    } else {
        // Normal caching strategy
        event.respondWith(
            caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).then(fetchResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
        );
    }
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
```

