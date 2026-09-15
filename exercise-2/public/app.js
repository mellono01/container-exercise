// A deliberately tiny SPA: no framework, no build step, no API or database.
// Client-side routing only, so the container just has to serve files.

const routes = {
  '/': () => `
    <h1>It works</h1>
    <p>This page is being served by a Node.js process. If you are reading it from
       <code>${location.host}</code>, then your image built, your container started,
       and your port mapping is correct.</p>
  `,

  '/status': () => `
    <h1>Status</h1>
    <p>Fetched live from <code>/healthz</code> inside the container:</p>
    <pre id="health">checking…</pre>
  `
};

function render() {
  const path = location.pathname;
  const view = routes[path] || (() => `<h1>404</h1><p>No route for <code>${path}</code>.</p>`);
  document.getElementById('app').innerHTML = view();

  document.querySelectorAll('nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path);
  });

  if (path === '/status') loadHealth();
}

async function loadHealth() {
  const target = document.getElementById('health');
  try {
    const res = await fetch('/healthz');
    const data = await res.json();
    target.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    target.textContent = 'Could not reach /healthz: ' + err.message;
  }
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-link]');
  if (!link) return;
  e.preventDefault();
  history.pushState(null, '', link.getAttribute('href'));
  render();
});

window.addEventListener('popstate', render);
render();
