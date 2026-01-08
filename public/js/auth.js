document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            // Save user session
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                name: data.name,
                role: data.role
            }));
            window.location.href = '/dashboard.html';
        } else {
            errorMsg.textContent = data.message;
            errorMsg.style.display = 'block';
        }
    } catch (err) {
        errorMsg.textContent = 'Connection error. Please try again.';
        errorMsg.style.display = 'block';
    }
});

// Check if already logged in
if (localStorage.getItem('user')) {
    window.location.href = '/dashboard.html';
}
