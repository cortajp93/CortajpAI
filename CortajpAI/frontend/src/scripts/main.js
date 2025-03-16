// Variables globales
let currentUser = null;
let authToken = null;

// Elementos del DOM
const authModal = document.getElementById('authModal');
const loggedInMenu = document.querySelector('.user-menu.logged-in');
const loggedOutMenu = document.querySelector('.user-menu.logged-out');

// Mostrar Modal de Auth
function showAuthModal(tab = 'login') {
    authModal.style.display = 'flex';
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`#${tab}Form`).classList.add('active');
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
}

// Cerrar Modal
function closeAuthModal() {
    authModal.style.display = 'none';
}

// Actualizar UI según autenticación
function updateAuthUI(isLoggedIn) {
    if(isLoggedIn) {
        loggedOutMenu.style.display = 'none';
        loggedInMenu.style.display = 'flex';
        document.getElementById('creditCount').textContent = currentUser.credits;
    } else {
        loggedInMenu.style.display = 'none';
        loggedOutMenu.style.display = 'flex';
    }
}

// Event Listeners
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        showAuthModal(tab);
    });
});

document.getElementById('openLoginModal').addEventListener('click', () => showAuthModal('login'));
document.getElementById('openRegisterModal').addEventListener('click', () => showAuthModal('register'));

document.querySelector('.close').addEventListener('click', closeAuthModal);
window.addEventListener('click', (e) => e.target === authModal && closeAuthModal());

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if(response.ok) {
            const data = await response.json();
            currentUser = data.user;
            authToken = data.token;
            localStorage.setItem('authToken', data.token);
            updateAuthUI(true);
            closeAuthModal();
        }
    } catch(error) {
        console.error('Login error:', error);
    }
});

// Registro
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if(response.ok) {
            alert('Registro exitoso. Por favor inicia sesión.');
            showAuthModal('login');
        }
    } catch(error) {
        console.error('Register error:', error);
    }
});

// Logout
document.querySelector('.logout').addEventListener('click', () => {
    localStorage.removeItem('authToken');
    currentUser = null;
    authToken = null;
    updateAuthUI(false);
});

// Verificar autenticación al cargar
window.addEventListener('load', () => {
    const token = localStorage.getItem('authToken');
    if(token) {
        // Verificar token con el backend
        fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            currentUser = data.user;
            updateAuthUI(true);
        });
    }
});

// Elementos del DOM
const authRequiredPopup = document.getElementById('authRequiredPopup');
const generateBtn = document.getElementById('generateBtn');
const uploadBox = document.getElementById('uploadBox');
const buyCreditsLink = document.querySelector('.buy-credits');

// Mostrar popup de autenticación requerida
function showAuthRequiredPopup() {
    authRequiredPopup.style.display = 'flex';
}

// Ocultar popup de autenticación requerida
function closeAuthRequiredPopup() {
    authRequiredPopup.style.display = 'none';
}

// Event listeners para acciones que requieren autenticación
generateBtn.addEventListener('click', (e) => {
    if (!currentUser) {
        e.preventDefault();
        showAuthRequiredPopup();
    }
});

uploadBox.addEventListener('click', (e) => {
    if (!currentUser) {
        e.preventDefault();
        showAuthRequiredPopup();
    }
});

buyCreditsLink.addEventListener('click', (e) => {
    if (!currentUser) {
        e.preventDefault();
        showAuthRequiredPopup();
    }
});

// Cerrar popup al hacer clic en la X o fuera del modal
document.querySelector('#authRequiredPopup .close').addEventListener('click', closeAuthRequiredPopup);
window.addEventListener('click', (e) => {
    if (e.target === authRequiredPopup) {
        closeAuthRequiredPopup();
    }
});