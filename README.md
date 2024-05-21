# Charl & Nade Lists App

This is a Progressive Web Application (PWA) designed for Charl and Nade to manage their lists collaboratively. The app features functionalities to add, update, and delete lists and list items. It uses Firebase Realtime Database to sync data across different users in real-time and Tailwind CSS for styling.

## Functions of the App

### Add / Update / Delete Lists
- **Add a List**: Click on the `+` button at the bottom right to add a new list. Enter the name of the list in the input field that appears and press `Enter` or click the `Add` button.
- **Update a List**: Click on the name of the current list at the top. A modal will appear where you can update the list name. Press `Enter` or click the `Update` button to save changes.
- **Delete a List**: In the update modal, click the `Delete` button to remove the list.

### Add / Update / Delete List Items
- **Add a List Item**: Select a list by clicking on it. Click on the `+` button at the bottom right to add a new item to the list. Enter the name of the item in the input field that appears and press `Enter` or click the `Add` button.
- **Update a List Item**: Double-click on a list item to open the update modal. Change the item name and press `Enter` or click the `Update` button to save changes.
- **Delete a List Item**: In the update modal, click the `Delete` button to remove the item.

### Toggle Completed Items
- **Toggle Completed**: Use the switch at the bottom left to show or hide completed items. The switch will turn green when completed items are shown and grey when they are hidden.

### User Selection
- On the login screen, select either Charl or Nade by clicking on their respective images. This sets the user and customizes the app accordingly.

### Data Sync with Firebase Realtime Database
- The app uses Firebase Realtime Database to sync data across different users in real-time. Any changes made by one user are immediately reflected in the app of the other user. This is achieved using Firebase Realtime Database listeners.

### Custom Color Settings for Modals
- The modals have specific color settings for Charl and Nade:
  - **Charl**: Blue shadow
  - **Nade**: Pink shadow

## Technical Overview

### Tailwind CSS
- Tailwind CSS is used for styling the app. It is a utility-first CSS framework that provides low-level utility classes to build custom designs without writing CSS.

### Firebase
- Firebase is a platform developed by Google for creating mobile and web applications. It includes services like authentication, database, and hosting.
- **Firebase Realtime Database**: This NoSQL cloud database enables data to be synced across all clients in real-time. It is used in this app to store and sync lists and list items between users.

### Firebase SDK
- The Firebase SDK is a set of libraries that enables interaction with Firebase services. The app uses the Firebase Realtime Database SDK to read and write data.

### JavaScript and JS Modules
- The app is built using modern JavaScript (ES6+). It uses JavaScript modules to organize code into reusable components.
- The main application logic is encapsulated in a class called `ListApp`.

### Using a Class for the Main App
- The `ListApp` class encapsulates all the functionality of the app, including initializing Firebase, setting up event listeners, and handling CRUD operations for lists and list items. This approach promotes code reusability and maintainability.

## Roadmap

### Cool Features to be Added
- **User Authentication**: Add Firebase Authentication to allow multiple users to log in and manage their lists.
- **Notifications**: Implement push notifications to alert users when a list or list item is updated.
- **Dark Mode**: Add a dark mode toggle to switch between light and dark themes.
- **Sharing Lists**: Allow users to share lists with other users and collaborate in real-time.
- **Due Dates**: Add due dates to list items and send reminders for upcoming deadlines.
- **Categories**: Organize lists into categories for better organization.

## Contact Information
For any questions or support, please contact:

Charl Cronje
- Email: [charl@webally.co.za](mailto:charl@webally.co.za)
- Mobile: +27 66 332 481