let currentStage = null;
let scanner = null;

const tg = window.Telegram.WebApp;
tg.ready();

function selectStage(stage) {
  currentStage = stage;

  document.getElementById("menu").style.display = "none";

  if (stage === "Конструктор") {
    document.getElementById("constructor").style.display = "block";
  }
}

function startProduction() {
  document.getElementById("constructor").style.display = "none";
  document.getElementById("scanner").style.display = "block";

  scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScanSuccess
  );
}

function onScanSuccess(decodedText) {
  scanner.stop();
  document.getElementById("scanner").style.display = "none";

  sendToServer(decodedText);
}

function sendToServer(code) {
  fetch("https://office.korda.spb.ru/scan", {
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
