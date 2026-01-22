const tg = window.Telegram.WebApp;
tg.expand();

let currentStage = null;
let scanner = null;

function selectStage(stage) {
  currentStage = stage;

  document.getElementById('constructor').style.display =
    stage === 'Конструктор' ? 'block' : 'none';
}

function startScan() {
  document.getElementById('scanner').style.display = 'block';

  scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    onScanSuccess
  );
}

function onScanSuccess(text) {
  scanner.stop();

  tg.sendData(JSON.stringify({
    stage: currentStage,
    code: text,
    time: new Date().toISOString()
  }));

  alert("Изделие запущено в производство");
}
