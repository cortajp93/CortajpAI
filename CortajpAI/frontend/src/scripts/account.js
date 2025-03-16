// Elementos del DOM
const authPopup = document.getElementById('authPopup');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');
const tabs = document.querySelectorAll('.tab');

// Mostrar el formulario de login por defecto
authPopup.style.display = 'flex';

// Alternar entre login y registro
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.tab[data-tab="register"]').click();
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.tab[data-tab="login"]').click();
});

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        document.querySelector(`#${tab}Form`).classList.add('active');
        e.target.classList.add('active');
    });
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            window.location.href = 'account.html'; // Redirigir a la página de cuenta
        } else {
            alert('Error al iniciar sesión. Verifica tus credenciales.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            alert('Registro exitoso. Por favor inicia sesión.');
            document.querySelector('.tab[data-tab="login"]').click();
        } else {
            alert('Error al registrar el usuario.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Elementos del DOM
const authPopup = document.getElementById('authPopup');
// Mostrar el popup de login/registro al cargar la página
authPopup.style.display = 'flex';

// Alternar entre login y registro
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.tab[data-tab="register"]').click();
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.tab[data-tab="login"]').click();
});

tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        document.querySelector(`#${tab}Form`).classList.add('active');
        e.target.classList.add('active');
    });
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            window.location.href = 'index.html'; // Redirigir a la página principal
        } else {
            alert('Error al iniciar sesión. Verifica tus credenciales.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            alert('Registro exitoso. Por favor inicia sesión.');
            document.querySelector('.tab[data-tab="login"]').click();
        } else {
            alert('Error al registrar el usuario.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});