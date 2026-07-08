import getUser from "./get-user.js";

const platformAlias = {
  ios: "IOS",
  android: "Android",
  linux: "Linux",
  macos: "macOS",
  windows: "Windows",
  androidtv: "Android TV",
  appletv: "Apple TV",
};
const instructions = await getInstructions();
let currentPlatform = getPlatform();
let currentClient = initCurrentClient(instructions, currentPlatform, "incy");
let currentClientInfo = instructions[currentPlatform][currentClient];
const platforms = Object.keys(instructions);

createPlatforms();

const clientGridElem = document.getElementById("clientGrid");
createClients();

createInstructionBlock();

function createPlatforms() {
  const platformGroupElem = document.getElementById("platformGroup");

  platforms.forEach((platform) => {
    const platformElem = document.createElement("button");
    platformElem.textContent = platformAlias[platform];
    const isActive = currentPlatform === platform;
    platformElem.className = `platform-btn ${isActive ? "active" : ""}`;
    platformElem.dataset.platform = platform;

    platformGroupElem.appendChild(platformElem);
  });
}

function createInstructionBlock() {
  const container = document.getElementById("instructionBlock");

  const title = document.createElement("div");
  title.className = "inst-title";
  title.id = "instTitle";
  title.textContent = currentClientInfo.title;
  container.appendChild(title);

  const description = document.createElement("div");
  description.className = "inst-desc";
  description.id = "instDesc";
  description.textContent = currentClientInfo.desc;
  container.appendChild(description);

  const appLinks = document.createElement("div");
  appLinks.id = "instLinks";
  appLinks.className = "inst-links";
  container.appendChild(createAppLinks(currentClientInfo.apps, appLinks));

  const addSubLink = document.createElement("a");
  addSubLink.className = "inst-link";
  addSubLink.id = "addLink";
  addSubLink.style.marginTop = "12px";
  setLink(addSubLink, currentClientInfo.addLink);
  addSubLink.innerHTML = '<span class="icon">+</span> Добавить подписку';
  container.appendChild(addSubLink);
}

const platformBtns = document.querySelectorAll(".platform-btn");
const clientTags = document.querySelectorAll(".client-tag");
const instTitle = document.getElementById("instTitle");
const instDesc = document.getElementById("instDesc");
const appLinks = document.getElementById("instLinks");
const addLink = document.getElementById("addLink");

function updateInstruction() {
  createClients();

  const client = instructions[currentPlatform] && instructions[currentPlatform][currentClient];
  if (client) {
    currentClientInfo = instructions[currentPlatform][currentClient];
    instTitle.textContent = client.title;
    instDesc.textContent = client.desc;
    setLink(addLink, client.addLink);

    instDesc.insertAdjacentElement("afterend", createAppLinks(currentClientInfo.apps, appLinks));
  } else {
    currentClient = Object.keys(instructions[currentPlatform])[0];
    createClients();
    updateInstruction();
  }
}

function createAppLinks(apps, appLinksContainer) {
  appLinksContainer.innerHTML = "";
  apps.forEach((app) => {
    const appLink = document.createElement("a");
    appLink.className = "inst-link";
    appLink.download = true;
    appLink.href = app.download;
    appLink.innerHTML = `<span class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-download">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M20 16a1 1 0 0 1 1 1v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2a1 1 0 0 1 2 0v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1 -1v-2a1 1 0 0 1 1 -1m-8 -13a1 1 0 0 1 1 1v9.585l3.293 -3.292a1 1 0 0 1 1.414 1.414l-5 5a1 1 0 0 1 -.09 .08l.09 -.08a1 1 0 0 1 -.674 .292l-.033 .001h-.032l-.054 -.004l.086 .004a1 1 0 0 1 -.617 -.213a1 1 0 0 1 -.09 -.08l-5 -5a1 1 0 0 1 1.414 -1.414l3.293 3.292v-9.585a1 1 0 0 1 1 -1" />
      </svg>
    </span> ${app.title}`;
    appLinksContainer.appendChild(appLink);
  });

  return appLinksContainer;
}

function createClients() {
  clientGridElem.innerHTML = "";
  const currentPlatformClients = Object.keys(instructions[currentPlatform]);

  currentPlatformClients.forEach((client) => {
    const clientElem = document.createElement("span");
    clientElem.textContent = client;
    const isActive = currentClient === client;
    clientElem.className = `client-tag ${isActive ? "active" : ""}`;
    clientElem.dataset.client = client;
    clientElem.addEventListener("click", () => {
      clientTags.forEach((t) => t.classList.remove("active"));
      clientElem.classList.add("active");
      currentClient = clientElem.dataset.client;
      updateInstruction();
    });

    clientGridElem.appendChild(clientElem);
  });
}

platformBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    platformBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentPlatform = btn.dataset.platform;
    updateInstruction();
  });
});

async function getInstructions() {
  const userData = await getUser();
  const subUrl = userData.subscription_url;
  const username = userData.user.username;
  const instructions = {
    ios: {
      incy: {
        title: "IOS / Incy",
        desc: "Установите Incy для IOS. После установки импортируйте подписку через ссылку.",
        apps: [
          {
            title: "App Store (RU)",
            download: "https://apps.apple.com/ru/app/incy/id6756943388",
          },
        ],
        addLink: `incy://add/${subUrl}`,
      },
      happ: {
        title: "IOS / Happ",
        desc: "Скачайте Happ Client для IOS. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "App Store (RU)",
            download: "https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973",
          },
          {
            title: "App Store (Global)",
            download: "https://apps.apple.com/us/app/happ-proxy-utility/id6504287215",
          },
        ],
        addLink: `happ://add/${subUrl}`,
      },
      stash: {
        title: "IOS / Stash",
        desc: "Stash для IOS. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "App Store (RU)",
            download: "https://apps.apple.com/ru/app/stash-rule-based-proxy/id1596063349",
          },
        ],
        addLink: `stash://install-config?url=${subUrl}`,
      },
      shadowrocket: {
        title: "IOS / Shadowrocket",
        desc: "Shadowrocket для IOS. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "App Store (Global)",
            download: "https://apps.apple.com/us/app/shadowrocket/id932747118",
          },
        ],
        addLink: `shadowrocket://add/${subUrl}#${username}`,
      },
      streisand: {
        title: "IOS / Streisand",
        desc: "Streisand для IOS. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "App Store (Global)",
            download: "https://apps.apple.com/us/app/streisand/id6450534064",
          },
        ],
        addLink: `streisand://import/${subUrl}`,
      },
      v2raytun: {
        title: "IOS / v2RayTun",
        desc: "v2RayTun для IOS. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "App Store (Global)",
            download: "https://apps.apple.com/us/app/v2raytun/id6476628951",
          },
        ],
        addLink: `v2raytun://import/${subUrl}`,
      },
    },
    android: {
      incy: {
        title: "Android / INCY",
        desc: "Скачайте INCY для Android. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "Google Play",
            download: "https://play.google.com/store/apps/details?id=llc.itdev.incy",
          },
          {
            title: "Скачать APK",
            download:
              "https://github.com/INCY-DEV/incy-platforms/releases/latest/download/Incy.apk",
          },
        ],
        addLink: `incy://add/${subUrl}`,
      },
      happ: {
        title: "Android / Happ",
        desc: "Скачайте Happ Client для Android. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "Google Play",
            download: "https://play.google.com/store/apps/details?id=com.happproxy",
          },
          {
            title: "Скачать APK",
            download:
              "https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ.apk",
          },
        ],
        addLink: `happ://add/${subUrl}`,
      },
      ficlashx: {
        title: "Android / FIClashX",
        desc: "FIClashX для Android — лёгкий клиент. После установки добавьте подписку по ссылке.",
        apps: [
          {
            title: "Скачать APK",
            download:
              "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-android-universal.apk",
          },
        ],
        addLink: `flclashx://install-config?url=${subUrl}`,
      },
      clashmeta: {
        title: "Android / Clash Meta",
        desc: "Clash Meta для Android. Скачайте установщик и добавьте подписку.",
        apps: [
          {
            title: "Скачать APK",
            download:
              "https://github.com/MetaCubeX/ClashMetaForAndroid/releases/download/v2.11.20/cmfa-2.11.20-meta-universal-release.apk",
          },
          {
            title: "Открыть в F-Droid",
            download: "https://f-droid.org/packages/com.github.metacubex.clash.meta/",
          },
        ],
        addLink: `clashmeta://install-config?name=${username}&url=${subUrl}`,
      },
      v2raytun: {
        title: "Android / v2RayTun",
        desc: "v2RayTun для Android. Скачайте установщик и добавьте подписку.",
        apps: [
          {
            title: "Google Play",
            download: "https://play.google.com/store/apps/details?id=com.v2raytun.android",
          },
          {
            title: "Скачать APK",
            download:
              "https://github.com/DigneZzZ/v2raytun/releases/download/5.19.64/v2RayTun_universal.apk",
          },
        ],
        addLink: `v2raytun://import/${subUrl}`,
      },
      v2rayng: {
        title: "Android / v2RayNG",
        desc: "v2RayNG для Android. Скачайте установщик и добавьте подписку.",
        apps: [
          {
            title: "Скачать APK",
            download:
              "https://github.com/2dust/v2rayNG/releases/download/1.10.31/v2rayNG_1.10.31_universal.apk",
          },
        ],
        addLink: `v2rayng://install-config?name=${username}&url=${subUrl}`,
      },
    },
    linux: {
      happ: {
        title: "Linux / Happ",
        desc: "Happ для Linux — установите через .deb/.rpm или .pkg.tar.zst. Затем добавьте подписку.",
        apps: [
          {
            title: ".deb",
            download:
              "https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.deb",
          },
          {
            title: ".rpm",
            download:
              "https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.rpm",
          },
          {
            title: ".pkg.tar.zst",
            download:
              "https://github.com/Happ-proxy/happ-desktop/releases/latest/download/Happ.linux.x64.pkg.tar.zst",
          },
        ],
        addLink: `happ://add/${subUrl}`,
      },
      ficlashx: {
        title: "Linux / FIClashX",
        desc: "FIClashX для Linux — установите через .deb/.rpm или AppImage. Затем добавьте подписку.",
        apps: [
          {
            title: "amd64 (.deb)",
            download:
              "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-linux-amd64.deb",
          },
          {
            title: "amd64 (AppImage)",
            download:
              "https://github.com/2dust/v2rayNG/releases/download/1.10.31/v2rayNG_1.10.31_universal.apk",
          },
          {
            title: "amd64 (.rpm)",
            download:
              "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-linux-amd64.rpm",
          },
          {
            title: "arm64 (.deb)",
            download:
              "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-linux-arm64.deb",
          },
        ],
        addLink: `flclashx://install-config?url=${subUrl}`,
      },
      koala: {
        title: "Linux / Koala Clash",
        desc: "Koala Clash для Linux — установите через .deb/.rpm. Затем добавьте подписку. Если вы ранее использовали Clash Verge Rev, то его требуется удалить перед установкой Koala Clash.",
        apps: [
          {
            title: "amd64 (.deb)",
            download:
              "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash_amd64.deb",
          },
          {
            title: "amd64 (.rpm)",
            download:
              "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash.x86_64.rpm",
          },
          {
            title: "arm64 (.deb)",
            download:
              "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash_arm64.deb",
          },
          {
            title: "arm64 (.rpm)",
            download:
              "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash.aarch64.rpm",
          },
        ],
        addLink: `koala-clash://install-config?url=${subUrl}`,
      },
      prizrak: {
        title: "Linux / Prizrak-Box",
        desc: "Prizrak-Box для Linux — установите через .deb/.rpm. Затем добавьте подписку. Запустите программу с root правами.",
        apps: [
          {
            title: "amd64 (.deb)",
            download:
              "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/linux-amd64.deb",
          },
          {
            title: "amd64 (.rpm)",
            download:
              "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/linux-amd64.rpm",
          },
          {
            title: "arm64 (.deb)",
            download:
              "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/linux-arm64.deb",
          },
          {
            title: "arm64 (.rpm)",
            download:
              "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/linux-arm64.rpm",
          },
        ],
        addLink: `prizrak-box://install-config?url=${subUrl}`,
      },
    },
    macos: {
      happ: {
        title: "macOS / Happ",
        desc: "Скачайте Happ Client для macOS. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "App Store (RU)",
            download: "https://apps.apple.com/ru/app/happ-proxy-utility-plus/id6746188973",
          },
          {
            title: "App Store (Global)",
            download: "https://apps.apple.com/us/app/happ-proxy-utility/id6504287215",
          },
        ],
        addLink: `happ://add/${subUrl}`,
      },
      ficlashx: {
        title: "macOS / FIClashX",
        desc: "FIClashX для macOS — установите из архива. Подписку добавьте по ссылке.",
        apps: [
          {
            title: "macOS (Apple Silicon)",
            download:
              "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-macos-arm64.dmg",
          },
          {
            title: "macOS (Intel)",
            download:
              "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-macos-amd64.dmg",
          },
        ],
        addLink: `flclashx://install-config?url=${subUrl}`,
      },
      koala: {
        title: "macOS / Koala Clash",
        desc: "Koala Clash для macOS. Установите и активируйте подписку. Если вы ранее использовали Clash Verge Rev, то его требуется удалить перед установкой Koala Clash. ⚠️ Предупреждение: Если при запуске приложения на macOS появляется уведомление, что приложение повреждено, выполните эту команду в терминале: sudo xattr -r -c /Applications/Koala\\ Clash.app",
        apps: [
          {
            title: "macOS (Apple Silicon)",
            download:
              "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash_aarch64.dmg",
          },
          {
            title: "macOS (Intel)",
            download:
              "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash_x64.dmg",
          },
        ],
        addLink: `koala-clash://install-config?url=${subUrl}`,
      },
      prizrak: {
        title: "macOS / Prizrak-Box",
        desc: "Prizrak-Box для macOS. Скачайте и установите, добавьте подписку. Если macOS показывает предупреждения безопасности — следуйте инструкции: https://github.com/legiz-ru/Prizrak-Box/blob/v3/doc/mac/mac.md",
        apps: [
          {
            title: "macOS (Apple Silicon)",
            download:
              "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/macos-arm64-dmg.zip",
          },
          {
            title: "macOS (Intel)",
            download:
              "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/macos-amd64-dmg.zip",
          },
        ],
        addLink: `prizrak-box://install-config?url=${subUrl}`,
      },
    },
    windows: {
      incy: {
        title: "Windows / Incy",
        desc: "Установите Incy для Windows. После установки импортируйте подписку через ссылку.",
        apps: [
          {
            title: "Windows (Установщик)",
            download:
              "https://github.com/INCY-DEV/incy-platforms/releases/latest/download/incy-windows-setup.exe",
          },
        ],
        addLink: `incy://add/${subUrl}`,
      },
      happ: {
        title: "Windows / Happ",
        desc: "Скачайте Happ Client для Windows. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "Windows",
            download:
              "https://github.com/Happ-proxy/happ-desktop/releases/latest/download/setup-Happ.x64.exe",
          },
        ],
        addLink: `happ://add/${subUrl}`,
      },
      ficlashx: {
        title: "Windows / FIClashX",
        desc: "FIClashX для Windows — лёгкий клиент. После установки добавьте подписку по ссылке.",
        apps: [
          {
            title: "Windows (Установщик)",
            download:
              "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-windows-amd64-setup.exe",
          },
          {
            title: "Windows на ARM (Установщик)",
            download:
              "https://github.com/pluralplay/FlClashX/releases/latest/download/FlClashX-windows-arm64-setup.exe",
          },
        ],
        addLink: `flclashx://install-config?url=${subUrl}`,
      },
      koala: {
        title: "Windows / Koala Clash",
        desc: "Koala Clash для Windows. Установите и активируйте подписку через ссылку. Если вы ранее использовали Clash Verge Rev, то его требуется удалить перед установкой Koala Clash.",
        apps: [
          {
            title: "Windows (Установщик)",
            download:
              "https://github.com/coolcoala/clash-verge-rev-lite/releases/latest/download/Koala.Clash_x64-setup.exe",
          },
        ],
        addLink: `koala-clash://install-config?url=${subUrl}`,
      },
      prizrak: {
        title: "Windows / Prizrak-Box",
        desc: "Prizrak-Box для Windows. Скачайте установщик и добавьте подписку. Запустите программу от имени администратора.",
        apps: [
          {
            title: "Windows (Установщик)",
            download:
              "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/windows-amd64.msi",
          },
          {
            title: "Windows на ARM (Установщик)",
            download:
              "https://github.com/legiz-ru/Prizrak-Box/releases/latest/download/windows-arm64.msi",
          },
        ],
        addLink: `prizrak-box://install-config?url=${subUrl}`,
      },
    },
    androidtv: {
      incy: {
        title: "Android / INCY",
        desc: "Скачайте INCY для Android. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "Google Play",
            download: "https://play.google.com/store/apps/details?id=llc.itdev.incy",
          },
          {
            title: "Скачать APK",
            download:
              "https://github.com/INCY-DEV/incy-platforms/releases/latest/download/Incy.apk",
          },
        ],
        addLink: `incy://add/${subUrl}`,
      },
      happ: {
        title: "Android TV / Happ",
        desc: "Скачайте Happ Client для Android TV. Подробные инструкции, чтобы помочь вам настроить Happ на вашем устройстве: https://www.happ.su/main/ru/faq/android-tv или https://www.happ.su/main/faq/android-tv",
        apps: [
          {
            title: "Google Play",
            download: "https://play.google.com/store/apps/details?id=com.happproxy",
          },
          {
            title: "Скачать APK",
            download:
              "https://github.com/Happ-proxy/happ-android/releases/latest/download/Happ.apk",
          },
        ],
        addLink: `happ://add/${subUrl}`,
      },
      vpn4tv: {
        title: "Android TV / vpn4tv",
        desc: "Скачайте vpn4tv для Android TV. Подробные инструкции, чтобы помочь вам настроить VPN4TV на вашем устройстве: https://vpn4tv.com/quick-guide.html или https://vpn4tv.com/sber.html",
        apps: [
          {
            title: "Google Play",
            download: "https://play.google.com/store/apps/details?id=com.vpn4tv.hiddify",
          },
          {
            title: "Скачать APK",
            download: "https://vpn4tv.com/download/vpn4tv.apk",
          },
        ],
        addLink: `hiddify://import/${subUrl}`,
      },
    },
    appletv: {
      happ: {
        title: "Apple TV / Happ",
        desc: "Скачайте Happ Client для Apple TV. Подробные инструкции, чтобы помочь вам настроить Happ на вашем устройстве: https://www.happ.su/main/ru/faq/android-tv или https://www.happ.su/main/faq/android-tv",
        apps: [
          {
            title: "App Store (Global)",
            download: "https://apps.apple.com/us/app/happ-proxy-utility-for-tv/id6748297274",
          },
        ],
        addLink: `happ://add/${subUrl}`,
      },
      stash: {
        title: "Apple TV / Stash",
        desc: "Stash для Apple TV. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "App Store (Global)",
            download: "https://apps.apple.com/us/app/stash-rule-based-proxy/id1596063349",
          },
        ],
        addLink: `stash://install-config?url=${subUrl}`,
      },
      shadowrocket: {
        title: "Apple TV / Shadowrocket",
        desc: "Shadowrocket для Apple TV. Установите и используйте ссылку для добавления подписки.",
        apps: [
          {
            title: "App Store (Global)",
            download: "https://apps.apple.com/us/app/shadowrocket/id932747118",
          },
        ],
        addLink: `shadowrocket://add/${subUrl}#${username}`,
      },
    },
  };

  if (isTelegramMiniApp() && isWindowsOS())
    await convertInstructionForWindowsTelegramMiniApp(instructions);

  return instructions;
}

function isTelegramMiniApp() {
  return (
    typeof window !== "undefined" &&
    window.Telegram &&
    window.Telegram.WebApp &&
    window.Telegram.WebApp.initData !== ""
  );
}

function isWindowsOS() {
  if (navigator.userAgentData) {
    return navigator.userAgentData.platform === "Windows";
  } else {
    return navigator.userAgent.toLowerCase().includes("win");
  }
}
async function convertInstructionForWindowsTelegramMiniApp(instructions) {
  const addLinkPrefix = (await getUser()).pageCfg.subscriptionUrl;
  const windowsPlatform = instructions.windows;
  Object.keys(windowsPlatform).forEach((client) => {
    windowsPlatform[client].addLink = `${addLinkPrefix}${windowsPlatform[client].addLink}`;
  });
}

function setLink(linkElem, link) {
  if (isTelegramMiniApp()) {
    linkElem.onclick = function (ev) {
      ev.preventDefault();

      window.open(link, "_system");
    };
  } else {
    linkElem.href = link;
  }
}

function getPlatform() {
  const ua = navigator.userAgent.toLowerCase();

  // 1. Проверяем ТВ-платформы
  if (ua.includes("tv")) {
    if (ua.includes("apple")) return "appletv";
    return "androidtv"; // Для всех остальных ТВ (smarttv, googletv, androidtv)
  }

  // Отдельно ловим редкие Android TV, у которых нет слова "tv", но есть "large-screen"
  if (ua.includes("android") && ua.includes("large-screen")) {
    return "androidtv";
  }

  // 2. Мобильные платформы
  // Проверка на iPad/iPhone/iPod
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  // Отдельная проверка для новых iPad на iPadOS (они маскируются под Mac)
  if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && ua.includes("macintosh"))
    return "ios";

  if (ua.includes("android")) return "android";

  // 3. Десктопные платформы
  if (ua.includes("win")) return "windows";
  if (ua.includes("mac")) return "macos";
  if (ua.includes("linux")) return "linux";

  return "ios"; // Если платформу определить не удалось
}

function initCurrentClient(instructions_, platform, preferredClient) {
  const hasPreferredClient = instructions_[platform][preferredClient];
  if (hasPreferredClient) return preferredClient;

  return Object.keys(instructions_[platform])[0];
}
