const qrcodeContainer = document.getElementById('qrcode-container');
let previousCode = "";

function generateRandomCode() {
  let newCode;
  do {
    newCode = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // 12-значное число
  } while (newCode === previousCode);

  previousCode = newCode;
  return newCode;
}

function generateQRCode() {
  const data = generateRandomCode();
  console.log("Код QR-кода:", data);

  qrcodeContainer.innerHTML = ''; // Очищаем контейнер перед генерацией нового QR-кода

  try {
    new QRCode(qrcodeContainer, {
      text: data,
      width: 256,
      height: 256,
    });
  } catch (error) {
    console.error("Ошибка при генерации QR-кода:", error);
    qrcodeContainer.innerHTML = '<p>Не удалось сгенерировать QR-код</p>';
  }
}

generateQRCode();
setInterval(generateQRCode, 5 * 60 * 1000); // Обновляем QR-код каждые 5 минут
