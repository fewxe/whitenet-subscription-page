let userDataCache = null;
export default async function getUser() {
  if (userDataCache) return userDataCache;

  const uuid = location.pathname.split("/")[1];
  const userDataRes = await fetch(`/api/sub/${uuid}/info`);
  const userData = await userDataRes.json();
  userDataCache = userData;
  return userData;
}
