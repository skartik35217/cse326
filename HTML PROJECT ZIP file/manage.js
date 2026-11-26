
const manageForm = document.getElementById("manageForm");
const manageResult = document.getElementById("manageResult");

const stages = [
    "Registered",
    "Sorting",
    "Security Check",
    "Loading",
    "Arrived"
];

function getRecords() {
    return JSON.parse(localStorage.getItem("baggageRecords") || "[]");
}

function saveRecords(records) {
    localStorage.setItem("baggageRecords", JSON.stringify(records));
}

function formatDate(date) {
    return new Date(date).toLocaleString();
}

manageForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const searchID = document.getElementById("manageBaggageID")
        .value.trim().toUpperCase();

    const records = getRecords();

    const baggage = records.find(record =>
        String(record.id).toUpperCase() === searchID
    );

    if (!baggage) {
        manageResult.textContent = "Baggage ID not found. Please try again.";
        return;
    }

    // Create initial history for older records
    if (!Array.isArray(baggage.history)) {
        baggage.history = [{
            status: baggage.status || "Registered",
            time: new Date().toISOString()
        }];
        saveRecords(records);
    }

    const currentStatus = baggage.status || "Registered";

    manageResult.replaceChildren();

    const card = document.createElement("div");
    card.className = "tracking-details";

    const heading = document.createElement("h3");
    heading.textContent = "Baggage Information";
    card.appendChild(heading);

    const details = [
        ["Baggage ID", baggage.id],
        ["Passenger", baggage.passengerName],
        ["Flight", baggage.flight],
        ["Destination", baggage.destination],
        ["Weight", baggage.weight + " KG"],
        ["Current Status", currentStatus]
    ];

    details.forEach(([label, value]) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = label + ": " + value;
        card.appendChild(paragraph);
    });

    // Status selector
    const label = document.createElement("label");
    label.textContent = "Update Handling Stage";
    label.htmlFor = "newBaggageStatus";
    card.appendChild(label);

    const select = document.createElement("select");
    select.id = "newBaggageStatus";

    stages.forEach(stage => {
        const option = document.createElement("option");
        option.value = stage;
        option.textContent = stage;
        select.appendChild(option);
    });

    if (stages.includes(currentStatus)) {
        select.value = currentStatus;
    }

    card.appendChild(select);

    // Save button
    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.textContent = "Save Status";

    saveButton.addEventListener("click", function() {
        const updatedStatus = select.value;

        const latestRecords = getRecords();

        const recordIndex = latestRecords.findIndex(record =>
            String(record.id).toUpperCase() === searchID
        );

        if (recordIndex === -1) {
            alert("Baggage record could not be found.");
            return;
        }

        const record = latestRecords[recordIndex];
        const oldStatus = record.status || "Registered";

        if (oldStatus === updatedStatus) {
            alert("Baggage is already at this stage.");
            return;
        }

        // Update current status
        record.status = updatedStatus;

        // Save status history
        if (!Array.isArray(record.history)) {
            record.history = [{
                status: oldStatus,
                time: new Date().toISOString()
            }];
        }

        record.history.push({
            status: updatedStatus,
            time: new Date().toISOString()
        });

        saveRecords(latestRecords);

        alert("Status updated and history saved successfully!");

        manageForm.requestSubmit();
    });

    card.appendChild(saveButton);

    // Status history section
    const historyHeading = document.createElement("h3");
    historyHeading.textContent = "Baggage Status History";
    historyHeading.style.marginTop = "25px";
    card.appendChild(historyHeading);

    const historyList = document.createElement("div");

    baggage.history.slice().reverse().forEach(item => {
        const historyItem = document.createElement("p");

        historyItem.textContent =
            item.status + " — " + formatDate(item.time);

        historyList.appendChild(historyItem);
    });

    card.appendChild(historyList);

    manageResult.appendChild(card);
});
