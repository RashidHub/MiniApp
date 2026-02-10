const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

let currentStage = null;

function selectStage(stage) {
    currentStage = stage;
    document.getElementById("menu").style.display = "none"; // Скрываем меню

    if (stage === "Конструктор") {
        document.getElementById("constructor").style.display = "block"; // Показываем раздел для конструктора
    }
}


// Запуск производства
function startProduction() {
  if (!currentStage) {
    alert("Выберите этап");
    return;
  }

  tg.openScanQrPopup(
    { text: "Отсканируйте DataMatrix" },
    async (result) => {
      if (!result) {
        alert("Сканирование отменено");
        return;
      }

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
              stage: currentStage,
              user: tg.initDataUnsafe?.user?.id || null
            })
          }
        );

        const data = await response.json();

        if (data.status === "ok") {
          alert("✅ Изделие запущено в производство");
        } else {
          alert("❌ Ошибка сервера");
        }

      } catch (err) {
        console.error(err);
        alert("❌ Не удалось отправить данные");
      }
    }
  );
}
