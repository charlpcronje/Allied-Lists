// login.js
document.getElementById('charl').addEventListener('click', () => login('Charl'));
document.getElementById('nade').addEventListener('click', () => login('Nade'));

function login(user) {
    localStorage.setItem('user', user);
    localStorage.setItem('lastList', ''); // Clear last accessed list on login
    window.location.href = 'main.html';
}