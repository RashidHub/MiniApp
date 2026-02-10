scanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  (text) => {
    scanner.stop().then(() => {
      sendToServer(text);
    }).catch(err => console.log("Ошибка остановки сканера", err));
  },
  (err) => {
    console.log("Ошибка сканирования", err);
  }
).catch(err => {
  alert("Ошибка запуска камеры: " + err);
});

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
    if(data.status === "ok") {
      alert("✅ Изделие запущено в производство");
    } else {
      alert("❌ Ошибка: " + (data.error || "Неизвестная ошибка"));
    }
    returnToMenu();
  })
  .catch(err => {
    alert("❌ Ошибка отправки");
    console.error(err);
  });
}
