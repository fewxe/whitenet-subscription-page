import getUser from "../get-user.js";

const user = (await getUser()).user;

const userAvatarElem = document.getElementById("avatar");
userAvatarElem.textContent = user.username.slice()[0].toUpperCase();

const userNameElem = document.getElementById("userName");
userNameElem.textContent = user.username;

const statusAlias = {
  ACTIVE: {
    dotStyle: "active-dot",
    text: "Активна",
  },
  DISABLED: {
    dotStyle: "disabled-dot",
    text: "Отключена",
  },
  LIMITED: {
    dotStyle: "limited-dot",
    text: "Трафик израсходован",
  },
  EXPIRED: {
    dotStyle: "expired-dot",
    text: "Просрочена",
  },
};
const statusElem = document.getElementById("status");
statusElem.textContent = statusAlias[user.user_status].text;
const dotElem = document.getElementById("dot");
dotElem.classList.add(statusAlias[user.user_status].dotStyle);

const date = new Date(user.expires_at);
const dayMonth = date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
const year = date.getFullYear();
const expiryDateElem = document.getElementById("expiryDate");
expiryDateElem.textContent = `до ${dayMonth}, ${year}`;

const expiredInElem = document.getElementById("expiredIn");
expiredInElem.textContent = user.days_left < 0 ? 0 : user.days_left.toString();

const trafficUsedElem = document.getElementById("trafficUsed");
trafficUsedElem.textContent = user.traffic_used;

const trafficLimitElem = document.getElementById("trafficLimit");
trafficLimitElem.textContent = user.traffic_limit_bytes ? user.traffic_limit : "∞";
