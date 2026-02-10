const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let selectedStage = null;

// выбор этапа
function selectStage(btn) {
  document.querySelectorAll('.stage')
    .forEach(b => b.classList.remove('active'));

  btn.classList.add('active');
  selectedStage = btn.innerText;

  document.getElementById('scanBtn').classList.remove('hidden');
}

// запуск сканера
function startScan() {
  if (!selectedStage) {
    alert("Выберите этап");
    return;
  }

  tg.openScanQrPopup(
    { text: "Отсканируйте DataMatrix / QR" },
    async (result) => {

      if (!result) {
        alert("Сканирование отменено");
        return;
      }

      console.log("Сканировано:", result);

      try {
        const response = await fetch(
          "https://production.korda.spb.ru/scan",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              code: result,
              stage: selectedStage,
              user: tg.initDataUnsafe?.user?.id || null
            })
          }
        );

        const data = await response.json();

        if (data.status === "ok") {
          alert("✅ Записано в производство");
        } else {
          alert("❌ Ошибка сервера");
        }

      } catch (err) {
        console.error(err);
        alert("❌ Ошибка отправки данных");
      }
    }
  );
}
