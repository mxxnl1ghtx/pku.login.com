const qrcodeContainer = document.getElementById('qrcode-container');
let db; // IndexedDB database
let currentQRCodeData = "";

function generateRandomCode() {
    let newCode;
    do {
        newCode = Math.floor(100000000000 + Math.random() * 900000000000).toString(); // 12-digit number
    } while (newCode === currentQRCodeData); // Check against the current value

    return newCode;
}

function generateQRCode() {
    currentQRCodeData = generateRandomCode();
    window.currentQRCodeData = currentQRCodeData; // Make it global
    console.log("Код QR-кода:", currentQRCodeData);

    qrcodeContainer.innerHTML = ''; 

    new QRCode(qrcodeContainer, {
        text: currentQRCodeData,
        width: 256,
        height: 256,
    });

    // Store QR code data in IndexedDB
    if (db) {
        const transaction = db.transaction(['qrCodes'], 'readwrite');
        const objectStore = transaction.objectStore('qrCodes');
        objectStore.put({ id: 'currentQRCode', data: currentQRCodeData });

        transaction.oncomplete = function() {
            console.log('QR code data stored in IndexedDB');
            document.dispatchEvent(new Event('qrCodeReady'));
        };

        transaction.onerror = function(event) {
            console.error('IndexedDB transaction error:', event.target.error);
        };
    }
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

    // Check if QR code data exists in IndexedDB
    const transaction = db.transaction(['qrCodes'], 'readonly');
    const objectStore = transaction.objectStore('qrCodes');
    const getRequest = objectStore.get('currentQRCode');

    getRequest.onsuccess = function(event) {
        if (event.target.result) {
            currentQRCodeData = event.target.result.data;
            window.currentQRCodeData = currentQRCodeData;
            console.log('QR code data retrieved from IndexedDB:', currentQRCodeData);
        } else {
            console.log('QR code data not found in IndexedDB. Generating new QR code.');
        }
        generateQRCode(); // Generate QR code after checking IndexedDB
    };

    getRequest.onerror = function(event) {
        console.error('IndexedDB get error:', event.target.error);
        generateQRCode(); // Generate QR code even if there's an error
    };
};

// Update the QR code data and regenerate the QR code every 5 minutes
setInterval(generateQRCode, 5 * 60 * 1000); 
