window.startScan = function() {
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
        const response = await fetch("/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            qr_data: result,
            code: result,
            stage: currentStage,
            user: tg.initDataUnsafe?.user?.id || null
          })
        });

        const data = await response.json();

        if (data.status === "ok" || data.status === "success") {
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
};
