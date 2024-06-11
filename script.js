const qrcodeContainer = document.getElementById('qrcode-container');
let previousCode = "";
let currentQRCodeData = ""; // Global variable for QR code data

function generateRandomCode() {
    let newCode;
    do {
        newCode = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // 12-digit number
    } while (newCode === previousCode);

    previousCode = newCode;
    return newCode;
}

function generateQRCode() {
  const data = generateRandomCode();
  console.log("Код QR-кода:", data);

  qrcodeContainer.innerHTML = ''; 

  new QRCode(qrcodeContainer, {
    text: data,
    width: 256,
    height: 256,
  });

  currentQRCodeData = data;
  window.currentQRCodeData = currentQRCodeData; // Make it global

  // Dispatch the 'qrCodeReady' event
  document.dispatchEvent(new Event('qrCodeReady'));
}

// Check if a QR code already exists in localStorage
if (!localStorage.getItem('currentQRCodeData')) {
  // Generate the initial QR code if it doesn't exist
  generateQRCode();
} else {
  // If it exists, retrieve it and display it
  currentQRCodeData = localStorage.getItem('currentQRCodeData');
  window.currentQRCodeData = currentQRCodeData;

  qrcodeContainer.innerHTML = ''; 

  new QRCode(qrcodeContainer, {
    text: currentQRCodeData,
    width: 256,
    height: 256,
  });

  // Dispatch the 'qrCodeReady' event to notify Flutter
  document.dispatchEvent(new Event('qrCodeReady'));
}

// Start the interval for updates (after the initial generation or retrieval)
setInterval(generateQRCode, 5 * 60 * 1000); // Update every 5 minutes
