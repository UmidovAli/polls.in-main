document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const navLinks = document.getElementById('nav-links');

    // Simple router
    const routes = {
        '/': renderHome,
        '/login': renderLogin,
        '/dashboard': renderDashboard
    };

    function navigate(path) {
        window.history.pushState({}, path, window.location.origin + path);
        render();
    }

    function render() {
        const path = window.location.pathname;
        const renderer = routes[path] || renderHome;
        app.innerHTML = '';
        renderer();
    }

    function renderHome() {
        app.innerHTML = `
            <div class="card" style="text-align: center; padding: 4rem 2rem;">
                <h1>Launch a poll in 30 seconds. See results live.</h1>
                <p>Start free with Yandex</p>
                <button class="btn" onclick="window.location.href='/auth/yandex/login'">Login with Yandex</button>
            </div>
        `;
    }

    function renderLogin() {
        app.innerHTML = `
            <div class="card" style="text-align: center; padding: 4rem 2rem;">
                <h2>Login</h2>
                <button class="btn" onclick="window.location.href='/auth/yandex/login'">Login with Yandex</button>
            </div>
        `;
    }

    function renderDashboard() {
        app.innerHTML = `<h2>Dashboard</h2><div id="polls-list">Loading...</div>`;
        fetch('/api/polls')
            .then(res => res.json())
            .then(data => {
                const list = document.getElementById('polls-list');
                list.innerHTML = data.map(poll => `
                    <div class="card">
                        <h3>${poll.title}</h3>
                        <p>${poll.description}</p>
                        <p>Status: ${poll.status}</p>
                    </div>
                `).join('');
            })
            .catch(err => {
                document.getElementById('polls-list').innerHTML = 'Error loading polls';
            });
    }

    window.addEventListener('popstate', render);
    render();
});
