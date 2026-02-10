let currentStage = null;
let scanner = null;

const tg = window.Telegram.WebApp;
tg.ready();

// URL сервера
const SERVER_URL = "https://production.korda.spb.ru/scan";

function selectStage(stage) {
  currentStage = stage;

  document.getElementById("menu").style.display = "none"; // Скрыть меню

  // Показать соответствующий раздел
  if (stage === "Конструктор") {
    document.getElementById("constructor").style.display = "block";
  }
}

// Запуск производства и сканера
function startProduction() {
  document.getElementById("constructor").style.display = "none";
  document.getElementById("scanner").style.display = "block";

  console.log("Пытаемся открыть камеру");

  scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" }, // Камера заднего плана
    { fps: 10, qrbox: 250 },       // Параметры сканера
    (text) => {
      // Останавливаем сканер и отправляем данные на сервер
      scanner.stop().then(() => {
        alert("Отсканировано: " + text);
        sendToServer(text);
      });
    },
    (err) => {
      console.log("Ошибка сканирования", err);
    }
  ).catch(err => {
    alert("Ошибка запуска камеры: " + err);
  });
}

// Отправка данных на сервер
function sendToServer(code) {
  fetch(SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: code,
      stage: currentStage,
      user: tg.initDataUnsafe?.user?.id || null
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Изделие запущено в производство");
    returnToMenu();
  })
  .catch(err => {
    alert("❌ Ошибка отправки");
    console.error(err);
  });
}

// Возврат в главное меню
function returnToMenu() {
  if(scanner) {
    scanner.stop().catch(() => {});
    scanner = null;
  }
  document.getElementById("scanner").style.display = "none";
  document.getElementById("constructor").style.display = "none";
  document.getElementById("menu").style.display = "block";
}
