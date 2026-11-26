

// =====================================
// AIRPORT OPS - REGISTRATION SYSTEM
// =====================================

const registrationForm = document.getElementById("registrationForm");

// GET SAVED RECORDS
function getBaggageRecords() {

    return JSON.parse(
        localStorage.getItem("baggageRecords") || "[]"
    );

}

// GENERATE UNIQUE BAGGAGE ID
function generateBaggageID() {

    const records = getBaggageRecords();

    let highestID = 0;

    records.forEach(record => {

        const number = parseInt(
            record.id.replace("BAG", ""),
            10
        );

        if (Number.isFinite(number) && number > highestID) {
            highestID = number;
        }

    });

    return "BAG" + String(highestID + 1).padStart(3, "0");

}

// REGISTER NEW BAGGAGE
registrationForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // GET FORM VALUES
    const passengerName =
        document.getElementById("passengerName").value.trim();

    const passengerEmail =
        document.getElementById("passengerEmail").value.trim();

    const flightNumber =
        document.getElementById("flightNumber").value.trim().toUpperCase();

    const destination =
        document.getElementById("destination").value.trim();

    const weight =
        Number(document.getElementById("baggageWeight").value);

    const baggageType =
        document.getElementById("baggageType").value;

    // VALIDATION
    if (!passengerName || !passengerEmail ||
        !flightNumber || !destination || !baggageType) {

        alert("Please fill in all fields.");
        return;

    }

    if (!Number.isFinite(weight) || weight <= 0) {

        alert("Please enter a valid baggage weight.");
        return;

    }

    // CREATE NEW RECORD
    const newBaggage = {

        id: generateBaggageID(),

        passengerName: passengerName,

        email: passengerEmail,

        flight: flightNumber,

        destination: destination,

        weight: weight,

        type: baggageType,

        status: "Pending"

    };

    // SAVE TO LOCAL STORAGE
    const records = getBaggageRecords();

    records.push(newBaggage);

    try {

        localStorage.setItem(
            "baggageRecords",
            JSON.stringify(records)
        );

    } catch (error) {

        alert("Could not save baggage. Please check browser storage.");
        return;

    }

  // SUCCESS MESSAGE
alert(
    "Baggage registered successfully!\n\n" +
    "Baggage ID: " + newBaggage.id + "\n" +
    "Passenger: " + newBaggage.passengerName + "\n" +
    "Status: Pending"
);

// GENERATE QR CODE
const qrSection = document.getElementById("registrationQR");
const qrDisplay = document.getElementById("qrCodeDisplay");
const qrID = document.getElementById("qrBaggageID");
const downloadQR = document.getElementById("downloadQR");

qrSection.style.display = "block";

qrID.textContent = "Baggage ID: " + newBaggage.id;

// Clear previous QR code
qrDisplay.replaceChildren();

// Generate QR using the baggage ID
if (typeof QRCode !== "undefined") {

    new QRCode(qrDisplay, {
        text: newBaggage.id,
        width: 200,
        height: 200,
        colorDark: "#142b44",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

} else {

    qrDisplay.textContent = "QR library could not load. Please check your internet connection.";

}

// DOWNLOAD QR CODE
downloadQR.onclick = function() {

    const qrCanvas = qrDisplay.querySelector("canvas");
    const qrImage = qrDisplay.querySelector("img");

    let imageURL = "";

    if (qrCanvas) {
        imageURL = qrCanvas.toDataURL("image/png");
    } else if (qrImage) {
        imageURL = qrImage.src;
    }

    if (!imageURL) {
        alert("QR code is not ready yet.");
        return;
    }

    const link = document.createElement("a");

    link.href = imageURL;
    link.download = newBaggage.id + "-QR.png";

    link.click();

};

// RESET FORM
registrationForm.reset();

});
