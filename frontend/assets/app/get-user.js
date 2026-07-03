let userDataCache = null;

export default async function getUser() {
  if (userDataCache) return userDataCache;

  if (window.__PANEL_DATA__ === null) {
    renderError(404, "Subscription not found");
    return null;
  }

  try {
    userDataCache = JSON.parse(atob(window.__PANEL_DATA__));
    userDataCache.pageCfg = window.__PAGE_CONFIG__;
    return userDataCache;
  } catch {
    renderError(500, "Failed to parse data");
    return null;
  }
}

function renderError(status, message) {
  document.body.innerHTML = `
        <p>Error:</p>
        <p>Status: ${status}</p>
        <p>Message: ${message}</p>
    `;
}
