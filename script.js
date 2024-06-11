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
    return new Promise((resolve) => {
        const data = generateRandomCode();
        console.log("Код QR-кода:", data);

        qrcodeContainer.innerHTML = ''; 

        // Create and render the QR code
        new QRCode(qrcodeContainer, {
            text: data,
            width: 256,
            height: 256,
        });

        // Update the global variable and resolve the Promise
        currentQRCodeData = data;
        window.currentQRCodeData = currentQRCodeData; // Make it global
        resolve();
    });
}

// Generate the initial QR code
generateQRCode();

// Start the interval for updates
setInterval(generateQRCode, 5 * 60 * 1000); // Update every 5 minutes
