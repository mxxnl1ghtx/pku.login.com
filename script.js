const qrcodeContainer = document.getElementById('qrcode-container');

function generateQRCode() {
    const data = "9891247753469124";

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