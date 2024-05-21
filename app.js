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
    child,
    onValue
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

class ListApp {
    constructor(firebaseConfig) {
        this.firebaseConfig = firebaseConfig;
        this.app = initializeApp(firebaseConfig);
        this.db = getDatabase(this.app);

        this.currentListId = null;
        this.showCompleted = true;
        this.userSettings = {
            Charl: {
                name: 'Charl',
                image: './img/charl.png',
                smallImage: './img/charl_small.png',
                shadowColor: 'rgba(0, 0, 255, 0.5)'
            },
            Nade: {
                name: 'Nade',
                image: './img/nade.png',
                smallImage: './img/nade_small.png',
                shadowColor: 'rgba(255, 20, 147, 0.5)'
            }
        };
        this.defaultSettings = {
            image: './img/default.png',
            smallImage: './img/default_small.png',
            shadowColor: 'rgba(0, 0, 0, 0.5)'
        };

        document.addEventListener('DOMContentLoaded', () => {
            this.setProfileImage();
            this.setupDatabaseListeners();
        });

        this.initializeEventListeners();
    }

    setProfileImage() {
        const user = localStorage.getItem('user');
        const profileImg = document.getElementById('profile-img');
        if (user && this.userSettings[user]) {
            profileImg.src = this.userSettings[user].image;
        } else {
            profileImg.src = this.defaultSettings.image;
        }
        profileImg.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    }

    initializeEventListeners() {
        document.getElementById('show-lists').addEventListener('click', () => this.showLists());
        document.getElementById('toggle-completed').addEventListener('click', () => this.toggleCompletedItems());
        document.getElementById('current-list').addEventListener('click', () => this.showListEditModal());

        const addButton = document.getElementById('add-button');
        const inputContainer = document.getElementById('input-container');
        const newInput = document.getElementById('new-input');
        const submitButton = document.getElementById('submit-button');

        addButton.addEventListener('click', () => {
            inputContainer.style.display = 'flex';
            newInput.focus();
        });

        submitButton.addEventListener('click', () => {
            if (this.currentListId) {
                this.addItem(this.currentListId);
            } else {
                this.addList();
            }
        });

        newInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                if (this.currentListId) {
                    this.addItem(this.currentListId);
                } else {
                    this.addList();
                }
            }
        });

        const editModal = document.getElementById('edit-modal');
        const closeModal = document.getElementsByClassName('close')[0];
        const updateItemButton = document.getElementById('update-item');
        const deleteItemButton = document.getElementById('delete-item');

        closeModal.onclick = () => {
            editModal.style.display = "none";
        };

        window.onclick = (event) => {
            if (event.target == editModal) {
                editModal.style.display = "none";
            }
        };

        updateItemButton.addEventListener('click', () => this.updateItem());
        deleteItemButton.addEventListener('click', () => this.deleteItem());

        // Initialize List Edit Modal event listeners
        const listEditModal = document.getElementById('list-edit-modal');
        const closeListEditModal = document.getElementById('close-list-edit-modal');
        const updateListButton = document.getElementById('update-list');
        const deleteListButton = document.getElementById('delete-list');

        closeListEditModal.onclick = () => {
            listEditModal.style.display = "none";
        };

        window.onclick = (event) => {
            if (event.target == listEditModal) {
                listEditModal.style.display = "none";
            }
        };

        updateListButton.addEventListener('click', () => this.updateList());
        deleteListButton.addEventListener('click', () => this.deleteList());
    }

    async showLists() {
        const inputContainer = document.getElementById('input-container');
        const addButton = document.getElementById('add-button');
        const newInput = document.getElementById('new-input');
        inputContainer.style.display = 'none';
        newInput.value = ''; // Clear input
        this.currentListId = null;

        const dbRef = ref(this.db);
        const snapshot = await get(child(dbRef, `lists`));
        const container = document.getElementById('lists-container');
        container.innerHTML = '';

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
                    const userSetting = this.userSettings[list.addedBy] || this.defaultSettings;
                    listImage.src = userSetting.smallImage;
                    listImage.classList.add('w-8', 'h-8', 'rounded-full', 'mr-2');
                    listItem.appendChild(listImage);
                    const listText = document.createElement('span');
                    listText.innerText = list.name;
                    listItem.appendChild(listText);
                    listItem.addEventListener('click', () => this.showListItems(key));
                    container.appendChild(listItem);
                });
            }
        } else {
            const noListsMessage = document.createElement('p');
            noListsMessage.classList.add('text-gray-400', 'text-center', 'mt-4');
            noListsMessage.innerText = 'No lists available. Tap on the + button to add a list.';
            container.appendChild(noListsMessage);
        }
        this.updateToggleCompletedButton(); // Update the toggle button state on initial load
    }


    async addList() {
        const listName = document.getElementById('new-input').value;
        const newInput = document.getElementById('new-input');
        if (listName) {
            const user = localStorage.getItem('user');
            const newListRef = push(ref(this.db, 'lists'));
            await set(newListRef, {
                name: listName,
                items: [],
                addedBy: user
            });
            newInput.value = ''; // Clear input
            newInput.focus(); // Focus input
            this.showLists();
        }
    }

    async showListItems(listId) {
        const inputContainer = document.getElementById('input-container');
        const addButton = document.getElementById('add-button');
        const newInput = document.getElementById('new-input');
        inputContainer.style.display = 'none';
        newInput.value = ''; // Clear input
        newInput.focus(); // Focus input
        this.currentListId = listId;

        localStorage.setItem('lastList', listId);
        const dbRef = ref(this.db);
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
                    if (this.showCompleted || !item.done) {
                        const listItem = document.createElement('div');
                        listItem.classList.add('bg-gray-800', 'text-gray-200', 'p-2', 'rounded', 'shadow', 'mb-2', 'flex', 'items-center', 'list-item');

                        const itemImage = document.createElement('img');
                        const userSetting = this.userSettings[item.addedBy] || this.defaultSettings;
                        itemImage.src = userSetting.smallImage;
                        itemImage.classList.add('w-8', 'h-8', 'rounded-full', 'mr-2');
                        listItem.appendChild(itemImage);

                        const itemText = document.createElement('span');
                        itemText.classList.add('mx-2', 'flex-grow'); // Add margin and flex-grow
                        itemText.innerText = item.name;
                        listItem.appendChild(itemText);

                        const toggleLabel = document.createElement('label');
                        toggleLabel.classList.add('toggle-label');

                        const toggleInput = document.createElement('input');
                        toggleInput.type = 'checkbox';
                        toggleInput.checked = item.done;
                        toggleInput.addEventListener('change', () => this.toggleItemDone(listId, key));

                        toggleLabel.appendChild(toggleInput);
                        listItem.appendChild(toggleLabel);

                        listItem.addEventListener('dblclick', () => this.showEditModal(listId, key, item.name)); // Add double-click event listener

                        container.appendChild(listItem);
                    }
                });
            }
        }
        this.updateToggleCompletedButton(); // Update the toggle button state when showing list items
    }


    async addItem(listId) {
        const itemName = document.getElementById('new-input').value;
        const newInput = document.getElementById('new-input');
        if (itemName) {
            const user = localStorage.getItem('user');
            const listRef = ref(this.db, `lists/${listId}/items`);
            const newItemRef = push(listRef);
            await set(newItemRef, {
                name: itemName,
                done: false,
                addedBy: user
            });
            newInput.value = ''; // Clear input
            newInput.focus(); // Focus input
            this.showListItems(listId);
        }
    }

    async toggleItemDone(listId, itemId) {
        const itemRef = ref(this.db, `lists/${listId}/items/${itemId}`);
        const snapshot = await get(itemRef);
        if (snapshot.exists()) {
            const item = snapshot.val();
            await update(itemRef, {
                done: !item.done
            });
            this.showListItems(listId);
        }
    }

    setupDatabaseListeners() {
        const listsRef = ref(this.db, 'lists');
        onValue(listsRef, (snapshot) => {
            if (snapshot.exists()) {
                this.showLists();
            }
        });

        const itemsRef = ref(this.db, `lists/${this.currentListId}/items`);
        onValue(itemsRef, (snapshot) => {
            if (snapshot.exists()) {
                this.showListItems(this.currentListId);
            }
        });
    }

    showEditModal(listId, itemId, itemName) {
        this.editItemId = itemId;
        const editModal = document.getElementById('edit-modal');
        document.getElementById('edit-item-name').value = itemName;
        editModal.style.display = 'block';
        document.getElementById('edit-item-name').focus(); // Set focus on the text input

        // Set the shadow color based on the user
        const user = localStorage.getItem('user');
        const modalContent = document.querySelector('.modal-content');
        const userSetting = this.userSettings[user] || this.defaultSettings;
        modalContent.style.boxShadow = `0 4px 8px 0 ${userSetting.shadowColor}, 0 6px 20px 0 ${userSetting.shadowColor}`;
    }

    async updateItem() {
        const itemName = document.getElementById('edit-item-name').value;
        const itemRef = ref(this.db, `lists/${this.currentListId}/items/${this.editItemId}`);
        await update(itemRef, {
            name: itemName
        });
        document.getElementById('edit-modal').style.display = 'none';
        this.showListItems(this.currentListId);
    }

    async deleteItem() {
        const itemRef = ref(this.db, `lists/${this.currentListId}/items/${this.editItemId}`);
        await remove(itemRef);
        document.getElementById('edit-modal').style.display = 'none';
        this.showListItems(this.currentListId);
    }

    showListEditModal() {
        const listEditModal = document.getElementById('list-edit-modal');
        const listNameInput = document.getElementById('edit-list-name');
        listNameInput.value = document.getElementById('current-list').innerText.replace('List: ', '');
        listEditModal.style.display = 'block';
        listNameInput.focus(); // Set focus on the text input

        // Set the shadow color based on the user
        const user = localStorage.getItem('user');
        const modalContent = document.querySelector('.modal-content');
        const userSetting = this.userSettings[user] || this.defaultSettings;
        modalContent.style.boxShadow = `0 4px 8px 0 ${userSetting.shadowColor}, 0 6px 20px 0 ${userSetting.shadowColor}`;
    }

    async updateList() {
        const listName = document.getElementById('edit-list-name').value;
        const listRef = ref(this.db, `lists/${this.currentListId}`);
        await update(listRef, {
            name: listName
        });
        document.getElementById('list-edit-modal').style.display = 'none';
        this.showListItems(this.currentListId);
    }

    async deleteList() {
        const listRef = ref(this.db, `lists/${this.currentListId}`);
        await remove(listRef);
        document.getElementById('list-edit-modal').style.display = 'none';
        this.showLists();
    }

    updateToggleCompletedButton() {
        const toggleCompletedButton = document.getElementById('toggle-completed');
        if (this.showCompleted) {
            toggleCompletedButton.classList.add('bg-green-500');
            toggleCompletedButton.classList.remove('bg-gray-500');
        } else {
            toggleCompletedButton.classList.add('bg-gray-500');
            toggleCompletedButton.classList.remove('bg-green-500');
        }
    }

    toggleCompletedItems() {
        this.showCompleted = !this.showCompleted;
        const toggleCompletedCheckbox = document.getElementById('toggle-completed');
        toggleCompletedCheckbox.checked = this.showCompleted;
        if (this.showCompleted) {
            toggleCompletedCheckbox.parentElement.querySelector('.slider').style.backgroundColor = '#4caf50';
        } else {
            toggleCompletedCheckbox.parentElement.querySelector('.slider').style.backgroundColor = '#ccc';
        }
        if (this.currentListId) {
            this.showListItems(this.currentListId);
        }
    }

}

const listApp = new ListApp(firebaseConfig);