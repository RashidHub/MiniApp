let currentStage = null;
let scanner = null;

const tg = window.Telegram.WebApp;
tg.ready();

function selectStage(stage) {
  currentStage = stage;

  document.getElementById("menu").style.display = "none"; // Скрыть меню

  // Показать соответствующий раздел
  if (stage === "Конструктор") {
    document.getElementById("constructor").style.display = "block";
  }
}

function startProduction() {
  alert("Кнопка нажата");

  // Скрываем конструктора и показываем сканер
  document.getElementById("constructor").style.display = "none";
  document.getElementById("scanner").style.display = "block";

  console.log("Пытаемся открыть камеру");

  // Инициализация сканера
  scanner = new Html5Qrcode("reader");

  // Настройки сканера
  scanner.start(
    { facingMode: "environment" }, // Камера заднего плана
    { fps: 10, qrbox: 250 }, // Параметры сканера
    (text) => {
      alert("Отсканировано: " + text);
      scanner.stop(); // Останавливаем сканирование после получения текста
    },
    (err) => {
      console.log("Ошибка сканирования", err);
    }
  ).catch(err => {
    alert("Ошибка запуска камеры: " + err);
  });
}

// Функция для отправки данных на сервер
function sendToServer(code) {
  fetch("https://production.korda.spb.ru/scan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code: code,
      stage: currentStage,
      user: tg.initDataUnsafe?.user?.id || null
    })
  })
  .then(res => res.json())
  .then(data => {
    alert("✅ Изделие запущено в производство");
  })
  .catch(err => {
    alert("❌ Ошибка отправки");
    console.error(err);
  });
}
