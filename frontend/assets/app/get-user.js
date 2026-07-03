let userDataCache = null;
export default async function getUser() {
  if (userDataCache) return userDataCache;

  const uuid = location.pathname.split("/")[1];
  const userDataRes = await fetch(`/api/sub/${uuid}/info`);

  if (!userDataRes.ok) {
    const bodyElem = document.getElementsByTagName("body")[0];
    const status = userDataRes.status || 404;
    const message = userDataRes.statusText || "Unknown Error";
    console.log(bodyElem, status, message);
    bodyElem.innerHTML = `
                          Error: <br>
                          status: ${status} <br>
                          massage: ${message}
                         `;
    return;
  }

  const userData = await userDataRes.json();
  userDataCache = userData;
  return userData;
}
