import getUser from "../get-user.js";

let qrCodeInstance = null;
const qrContainer = document.getElementById("qrContainer");

async function generateQR() {
  const subUrl = (await getUser()).subscription_url;
  // Очищаем контейнер
  qrContainer.innerHTML = "";

  // Создаём экземпляр QR-кода
  qrCodeInstance = new QRCodeStyling({
    width: 240,
    height: 240,
    data: subUrl, // ссылка на подписку
    image: "", // можно добавить логотип, но у нас нет изображения
    dotsOptions: {
      color: "#f0f0f0",
      type: "rounded", // 'square', 'dots', 'rounded', 'classy'
      size: 0.6,
    },
    backgroundOptions: {
      color: "rgba(0,0,0,0)", // полностью прозрачный фон
    },
    cornersSquareOptions: {
      color: "#f0f0f0",
      type: "rounded",
    },
    cornersDotOptions: {
      color: "#f0f0f0",
      type: "rounded",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 8,
      imageSize: 0.2,
    },
  });

  // Рендерим в контейнер
  qrCodeInstance.append(qrContainer);

  // Добавляем логотип WhiteNet поверх (маленькая иконка ✦)
  // Можно добавить через canvas напрямую, но проще оставить так
}

// ─── УПРАВЛЕНИЕ МОДАЛКОЙ ───

const qrBtn = document.getElementById("qrBtn");
const qrModal = document.getElementById("qrModal");
const qrClose = document.getElementById("qrClose");

async function openQR() {
  // Генерируем QR при открытии (если ещё нет или обновляем)
  await generateQR();
  qrModal.classList.add("open");
}

function closeQR() {
  qrModal.classList.remove("open");
}

qrBtn.addEventListener("click", openQR);
qrClose.addEventListener("click", closeQR);
qrModal.addEventListener("click", (e) => {
  if (e.target === qrModal) closeQR();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeQR();
});

document.getElementById("supportBtn").addEventListener("click", async () => {
  window.open((await getUser()).pageCfg.supportUrl, "_blank");
});

const copyAlertElem = document.getElementById("copyAlert");
document.getElementById("copySubLink").addEventListener("click", async () => {
  const subUrl = (await getUser()).subscription_url;
  try {
    await navigator.clipboard.writeText(subUrl);
    copyAlertElem.hidden = false;

    setTimeout(() => {
      copyAlertElem.hidden = true;
    }, 2000);
  } catch (err) {
    console.error("Не удалось скопировать текст: ", err);
    alert("Ошибка при копировании");
  }
});
