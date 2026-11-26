

// =====================================
// AIRPORT OPS - DASHBOARD SYSTEM
// =====================================

// INITIAL SAMPLE RECORDS
const sampleRecords = [

    {
        id: "BAG001",
        passengerName: "Rahul Sharma",
        email: "rahul@example.com",
        flight: "AI202",
        destination: "Delhi",
        weight: 18,
        type: "Check-in",
        status: "Loaded"
    },

    {
        id: "BAG002",
        passengerName: "Aman Singh",
        email: "aman@example.com",
        flight: "6E310",
        destination: "Mumbai",
        weight: 22,
        type: "Check-in",
        status: "Processing"
    },

    {
        id: "BAG003",
        passengerName: "Simran Kaur",
        email: "simran@example.com",
        flight: "UK815",
        destination: "Bangalore",
        weight: 15,
        type: "Check-in",
        status: "Pending"
    }

];


// =====================================
// LOAD AND PRESERVE RECORDS
// =====================================

function getBaggageRecords() {

    const saved = JSON.parse(
        localStorage.getItem("baggageRecords") || "[]"
    );

    // ADD ANY MISSING SAMPLE RECORDS
    const existingIDs = new Set(
        saved.map(record => record.id)
    );

    const missingSamples = sampleRecords.filter(
        record => !existingIDs.has(record.id)
    );

    const allRecords = [...missingSamples, ...saved];

    localStorage.setItem(
        "baggageRecords",
        JSON.stringify(allRecords)
    );

    return allRecords;

}


// =====================================
// UPDATE STATISTICS
// =====================================

function updateStatistics(records) {

    const total = records.length;

    const loaded = records.filter(
        record => record.status === "Loaded"
    ).length;

    const processing = records.filter(
        record => record.status === "Processing"
    ).length;

    const pending = records.filter(
        record => record.status === "Pending"
    ).length;

    document.getElementById("totalBaggage").textContent = total;

    document.getElementById("loadedBaggage").textContent = loaded;

    document.getElementById("processingBaggage").textContent = processing;

    document.getElementById("pendingBaggage").textContent = pending;

}


// =====================================
// DISPLAY BAGGAGE TABLE
// =====================================

function displayBaggageRecords(records) {

    const tableBody = document.getElementById("baggageTableBody");

    tableBody.replaceChildren();

    // SHOW NEWEST RECORDS FIRST
    const recentRecords = [...records].reverse();

    recentRecords.forEach(record => {

        const row = document.createElement("tr");

        const values = [
            record.id,
            record.passengerName,
            record.flight,
            record.destination,
            record.weight + " KG"
        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        // STATUS CELL
        const statusCell = document.createElement("td");

        const statusBadge = document.createElement("span");

        statusBadge.classList.add("status");

        const allowedStatuses = [
            "loaded",
            "processing",
            "pending"
        ];

        const status = String(record.status).toLowerCase();

        statusBadge.classList.add(
            allowedStatuses.includes(status) ? status : "pending"
        );

        statusBadge.textContent = record.status;

        statusCell.appendChild(statusBadge);

        row.appendChild(statusCell);

        tableBody.appendChild(row);

    });

}


// =====================================
// MAIN DASHBOARD FUNCTION
// =====================================

function updateDashboard() {

    const records = getBaggageRecords();

    updateStatistics(records);

    displayBaggageRecords(records);

}


// =====================================
// START DASHBOARD
// =====================================

if (document.getElementById("totalBaggage")) {
    updateDashboard();
}
function logout() {
    // Clear login session
    sessionStorage.clear();

    // Remove login-related data only
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("user");

    // Redirect to login page
    window.location.replace("login.html");
}