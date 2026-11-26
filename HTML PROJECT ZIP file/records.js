
const recordsTableBody = document.getElementById("recordsTableBody");
const searchRecords = document.getElementById("searchRecords");
const statusFilter = document.getElementById("statusFilter");
const recordsMessage = document.getElementById("recordsMessage");


// GET Baggage Records

function getBaggageRecords() {

    return JSON.parse(
        localStorage.getItem("baggageRecords") || "[]"
    );

}


// DISPLAY RECORDS

function displayRecords() {

    const records = getBaggageRecords();

    const searchText = searchRecords.value.trim().toLowerCase();

    const selectedStatus = statusFilter.value;

    const filteredRecords = records.filter(function(record) {

        const matchesSearch =
            (record.id || "").toLowerCase().includes(searchText) ||
            (record.passengerName || "").toLowerCase().includes(searchText) ||
            (record.flight || "").toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "all" ||
            record.status === selectedStatus;

        return matchesSearch && matchesStatus;

    });


    // CLEAR TABLE

    recordsTableBody.innerHTML = "";


    // NO RECORDS

    if (filteredRecords.length === 0) {

        recordsMessage.textContent = "No baggage records found.";

        return;

    }

    recordsMessage.textContent =
        `${filteredRecords.length} baggage record(s) found.`;


    // DISPLAY TABLE DATA

    filteredRecords.forEach(function(record) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record.id || "-"}</td>
            <td>${record.passengerName || "-"}</td>
            <td>${record.flight || "-"}</td>
            <td>${record.destination || "-"}</td>
            <td>${record.weight || "-"} KG</td>
            <td>${record.type || "-"}</td>
            <td>${record.status || "-"}</td>
        `;

        recordsTableBody.appendChild(row);

    });

}


// SEARCH RECORDS

searchRecords.addEventListener("input", displayRecords);


// FILTER BY STATUS

statusFilter.addEventListener("change", displayRecords);


// LOAD RECORDS WHEN PAGE OPENS

displayRecords();
