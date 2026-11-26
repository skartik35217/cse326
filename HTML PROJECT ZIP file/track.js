
const trackingForm = document.getElementById("trackingForm");
const trackingID = document.getElementById("trackingID");
const trackingResult = document.getElementById("trackingResult");

const stages = [
    "Registered",
    "Sorting",
    "Security Check",
    "Loading",
    "Arrived"
];


// GET Baggage Records

function getRecords() {
    return JSON.parse(
        localStorage.getItem("baggageRecords") || "[]"
    );
}


// FORMAT DATE

function formatDate(date) {
    return new Date(date).toLocaleString();
}


// SEARCH BAGGAGE

trackingForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const searchID = trackingID.value.trim().toUpperCase();

    const records = getRecords();

    const baggage = records.find(function(record) {
        return String(record.id).toUpperCase() === searchID;
    });


    // IF BAGGAGE NOT FOUND

    if (!baggage) {

        trackingResult.innerHTML = `
            <div class="tracking-error">
                Baggage ID not found. Please check your ID and try again.
            </div>
        `;

        return;
    }


    // GET CURRENT STATUS

    const currentStatus = baggage.status || "Registered";

    const currentStageIndex = stages.indexOf(currentStatus);


    // CREATE JOURNEY PROGRESS

    let progressHTML = `
        <div class="baggage-progress">

            <h3>Baggage Journey</h3>

            <div class="progress-steps">
    `;


    stages.forEach(function(stage, index) {

        let stepClass = "";

        if (index < currentStageIndex) {
            stepClass = "completed";
        }

        else if (index === currentStageIndex) {
            stepClass = "current";
        }

        progressHTML += `
            <div class="progress-step ${stepClass}">

                <div class="progress-circle">
                    ${index < currentStageIndex ? "✓" : index + 1}
                </div>

                <p>${stage}</p>

            </div>
        `;

    });


    progressHTML += `
            </div>
        </div>
    `;


    // GET STATUS HISTORY

    let history = Array.isArray(baggage.history)
        ? baggage.history
        : [{
            status: currentStatus,
            time: new Date().toISOString()
        }];


    let historyHTML = `
        <div class="status-history">

            <h3>Baggage Status History</h3>
    `;


    history.slice().reverse().forEach(function(item) {

        historyHTML += `
            <div class="history-item">

                <p>
                    <strong>${item.status}</strong>
                </p>

                <small>${formatDate(item.time)}</small>

            </div>
        `;

    });


    historyHTML += `
        </div>
    `;


    // DISPLAY BAGGAGE INFORMATION

    trackingResult.innerHTML = `

        <div class="tracking-details">

            <h3>Baggage Information</h3>

            <p><strong>Baggage ID:</strong> ${baggage.id}</p>

            <p><strong>Passenger:</strong> ${baggage.passengerName}</p>

            <p><strong>Flight:</strong> ${baggage.flight}</p>

            <p><strong>Destination:</strong> ${baggage.destination}</p>

            <p><strong>Weight:</strong> ${baggage.weight} KG</p>

            <p><strong>Type:</strong> ${baggage.type}</p>

            <p><strong>Status:</strong> ${currentStatus}</p>

        </div>

        ${progressHTML}

        ${historyHTML}

    `;

});
const scanQRBtn = document.getElementById("scanQRBtn");
const qrMessage = document.getElementById("qrMessage");

let qrScanner;

scanQRBtn.addEventListener("click", async () => {
    try {
        qrScanner = new Html5Qrcode("qrScanner");

        await qrScanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            async (decodedText) => {
                qrMessage.textContent = "QR Code: " + decodedText;

                await qrScanner.stop();
            },
            () => {}
        );

    } catch (error) {
    console.error("Camera Error:", error);

    scannerMessage.textContent =
        "Camera Error: " + error.name + " - " + error.message;

    }
});
// QR Code Scanner
const startScannerBtn = document.getElementById("startScanner");
const stopScannerBtn = document.getElementById("stopScanner");
const qrReader = document.getElementById("qr-reader");
const scannerMessage = document.getElementById("scannerMessage");
const trackingIDInput = document.getElementById("trackingID");

let html5QrCode = null;

startScannerBtn.addEventListener("click", async () => {
    alert("QR button clicked!");
    try {
        scannerMessage.textContent = "Opening camera...";

        html5QrCode = new Html5Qrcode("qr-reader");

        await html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: {
                    width: 250,
                    height: 250
                }
            },
            async (decodedText) => {
                // QR code scanned successfully
                trackingIDInput.value = decodedText;

                scannerMessage.textContent =
                    "QR Scanned Successfully: " + decodedText;

                await stopQRScanner();

                // Automatically search the scanned baggage ID
                document.getElementById("trackingForm").requestSubmit();
            },
            () => {
                // Ignore continuous scan errors
            }
        );

        startScannerBtn.hidden = true;
        stopScannerBtn.hidden = false;

        scannerMessage.textContent = "Camera is active. Scan your baggage QR code.";

    } catch (error) {
        console.error("Camera Error:", error);

        scannerMessage.textContent =
            "Camera access failed. Please allow camera permission and try again.";
    }
});

stopScannerBtn.addEventListener("click", async () => {
    await stopQRScanner();
});

async function stopQRScanner() {
    if (html5QrCode && html5QrCode.isScanning) {
        await html5QrCode.stop();
        html5QrCode.clear();
    }

    startScannerBtn.hidden = false;
    stopScannerBtn.hidden = true;
}