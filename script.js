let db; // IndexedDB database
let currentQRCodeData = ""; // Global variable for QR code data

const qrcodeContainer = document.getElementById('qrcode-container');

function generateRandomCode() {
    let newCode;
    do {
        newCode = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // 12-digit number
    } while (newCode === currentQRCodeData); // Check against the current value

    return newCode;
}

function generateQRCode() {
    // Retrieve QR code data from IndexedDB
    const transaction = db.transaction(['qrCodes'], 'readonly');
    const objectStore = transaction.objectStore('qrCodes');
    const getRequest = objectStore.get('currentQRCode');

    getRequest.onsuccess = function(event) {
        if (event.target.result) {
            currentQRCodeData = event.target.result.data;
        } else {
            currentQRCodeData = generateRandomCode(); // Generate if not found
            // Store the newly generated QR code in IndexedDB
            const putTransaction = db.transaction(['qrCodes'], 'readwrite');
            const putObjectStore = putTransaction.objectStore('qrCodes');
            putObjectStore.put({ id: 'currentQRCode', data: currentQRCodeData });
        }

        window.currentQRCodeData = currentQRCodeData; // Make it global
        console.log("Код QR-кода:", currentQRCodeData);

        qrcodeContainer.innerHTML = ''; // Clear the container

        new QRCode(qrcodeContainer, {
            text: currentQRCodeData,
            width: 256,
            height: 256,
        });

        // Dispatch the 'qrCodeReady' event to notify Flutter (if needed)
        document.dispatchEvent(new Event('qrCodeReady'));
    };

    getRequest.onerror = function(event) {
        console.error('IndexedDB get error:', event.target.error);
    };
}

// Open or create IndexedDB database
const request = indexedDB.open('QRCodeDB', 1);

request.onerror = function(event) {
    console.error('IndexedDB error:', event.target.error);
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    db.createObjectStore('qrCodes', { keyPath: 'id' });
};

request.onsuccess = function(event) {
    db = event.target.result;
    generateQRCode(); // Generate QR code after DB is ready
};


// Update the QR code data and regenerate the QR code every 5 minutes
setInterval(generateQRCode, 5 * 60 * 1000); 
