const API_URL = 'http://localhost:3000/api';

function showPopup(message, type) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.className = `popup ${type}`;
    popup.style.display = 'block';
    setTimeout(() => popup.style.display = 'none', 3000);
}

// 1. Signup Logic
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            
            if (res.status === 201) {
                showPopup(data.message, 'success');
                setTimeout(() => window.location.href = 'login.html', 2000);
            } else {
                showPopup(data.message, 'error');
            }
        } catch (err) {
            showPopup('Something went wrong', 'error');
        }
    });
}

// 2. Login Logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.status === 200) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                showPopup(data.message, 'error');
            }
        } catch (err) {
            showPopup('Login failed', 'error');
        }
    });
}

// 3. Forgot Password Logic
const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        try {
            const res = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (res.status === 200) {
                showPopup(data.message, 'success');
                localStorage.setItem('resetEmail', email);
                setTimeout(() => window.location.href = 'reset_password.html', 2000);
            } else {
                showPopup(data.message, 'error');
            }
        } catch (err) {
            showPopup('Error sending OTP', 'error');
        }
    });
}

// 4. Reset Password Logic
const resetForm = document.getElementById('resetForm');
if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('resetEmail');
        const otp = document.getElementById('otp').value;
        const newPassword = document.getElementById('newPassword').value;

        if(!email) return showPopup('Session expired. Go back.', 'error');

        try {
            const res = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const data = await res.json();

            if (res.status === 200) {
                showPopup(data.message, 'success');
                localStorage.removeItem('resetEmail');
                setTimeout(() => window.location.href = 'login.html', 2000);
            } else {
                showPopup(data.message, 'error');
            }
        } catch (err) {
            showPopup('Reset failed', 'error');
        }
    });
}