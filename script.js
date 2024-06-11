const qrcodeContainer = document.getElementById('qrcode-container');
let currentQRCodeData = "";

function generateRandomCode() {
    let newCode;
    do {
        newCode = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // 12-digit number
    } while (newCode === currentQRCodeData); // Check against the current value

    return newCode;
}

function generateQRCode() {

    // Retrieve or generate QR code data
    currentQRCodeData = localStorage.getItem('qrCodeData') || generateRandomCode();

    // Store QR code data in localStorage
    localStorage.setItem('qrCodeData', currentQRCodeData);

    window.currentQRCodeData = currentQRCodeData; // Make it global
    console.log("Код QR-кода:", currentQRCodeData);

    qrcodeContainer.innerHTML = ''; 

    new QRCode(qrcodeContainer, {
        text: currentQRCodeData,
        width: 256,
        height: 256,
    });

    // Dispatch the 'qrCodeReady' event to notify Flutter (if needed)
    document.dispatchEvent(new Event('qrCodeReady'));
}

// Generate the initial QR code or retrieve from localStorage
generateQRCode();

// Update the QR code data and regenerate the QR code every 5 minutes
setInterval(generateQRCode, 5 * 60 * 1000); 
