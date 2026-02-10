const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let currentStage = null;

// выбор этапа
function selectStage(stage) {
  currentStage = stage;
  alert("Выбран этап: " + stage);
}

// запуск сканирования
function startScan() {
  if (!currentStage) {
    alert("Сначала выберите этап");
    return;
  }

  tg.openScanQrPopup(
    { text: "Отсканируйте код изделия" },
    async (result) => {
      if (!result) {
        alert("Сканирование отменено");
        return;
      }

      alert("Отсканировано: " + result);

      try {
        const response = await fetch("http://192.168.0.249:5001/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            code: result,
            stage: currentStage,
            user: tg.initDataUnsafe?.user?.id || null
          })
        });

        const data = await response.json();

        if (data.status === "ok") {
          alert("✅ Записано в базу");
        } else {
          alert("❌ Ошибка сервера");
        }

      } catch (e) {
        console.error(e);
        alert("❌ Ошибка отправки");
      }
    }
  );
}
