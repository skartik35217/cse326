const exceptionForm = document.getElementById("exceptionForm");
const exceptionsTableBody = document.getElementById("exceptionsTableBody");
const exceptionResult = document.getElementById("exceptionResult");

let exceptions = JSON.parse(localStorage.getItem("baggageExceptions")) || [];

function displayExceptions() {
    exceptionsTableBody.innerHTML = "";

    exceptions.forEach(function (exception) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${exception.baggageID}</td>
            <td>${exception.type}</td>
            <td>${exception.reason}</td>
            <td>${exception.date}</td>
        `;

        exceptionsTableBody.appendChild(row);
    });
}

exceptionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const enteredID = exceptionForm.querySelector("input").value.trim().toUpperCase();
    const selectedType = exceptionForm.querySelector("select").value;
    const reason = exceptionForm.querySelector("textarea").value.trim();

    if (!enteredID || !selectedType || !reason) {
        exceptionResult.textContent = "Please fill in all fields.";
        return;
    }

    // Check whether baggage ID exists
    const records = JSON.parse(localStorage.getItem("baggageRecords")) || [];

    const baggageExists = records.some(function (record) {
        return String(record.id).toUpperCase() === enteredID;
    });

    if (!baggageExists) {
        exceptionResult.textContent = "Baggage ID not found. Please check the ID.";
        return;
    }
    const baggageIndex = records.findIndex(function (record) {
    return String(record.id).toUpperCase() === enteredID;
});

const baggage = records[baggageIndex];
const oldStatus = baggage.status || "Registered";

if (!Array.isArray(baggage.history)) {
    baggage.history = [{
        status: oldStatus,
        time: new Date().toISOString()
    }];
}

baggage.status = selectedType;

baggage.history.push({
    status: selectedType,
    time: new Date().toISOString()
});

localStorage.setItem("baggageRecords", JSON.stringify(records));

    // Create new exception report
    const newException = {
        baggageID: enteredID,
        type: selectedType,
        reason: reason,
        date: new Date().toLocaleDateString()
    };

    exceptions.push(newException);

    localStorage.setItem("baggageExceptions", JSON.stringify(exceptions));

    exceptionResult.textContent = "Exception reported successfully!";

    exceptionForm.reset();
    displayExceptions();
});

    exceptions.push(newException);

    localStorage.setItem("baggageExceptions", JSON.stringify(exceptions));

    exceptionResult.textContent = "Exception reported successfully!";

    exceptionForm.reset();
    displayExceptions();
;

exceptionForm.addEventListener("reset", function () {
    exceptionResult.textContent = "";
});

displayExceptions();

console.log("Exceptions JS loaded");