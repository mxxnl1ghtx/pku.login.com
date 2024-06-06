const qrcodeContainer = document.getElementById('qrcode-container');

const words = ["apple", "banana", "cat", "dog", "elephant", "fish", "grape", "house", "ice", "jungle"];
let previousText = "";

function generateRandomText() {
  let newText;
  do {
    const randomIndex1 = Math.floor(Math.random() * words.length);
    const randomIndex2 = Math.floor(Math.random() * words.length);
    newText = words[randomIndex1] + " " + words[randomIndex2];
  } while (newText === previousText);

  previousText = newText;
  return newText;
}

function generateQRCode() {
  const data = generateRandomText();
  console.log("Текст QR-кода:", data);

  qrcodeContainer.innerHTML = '';

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
