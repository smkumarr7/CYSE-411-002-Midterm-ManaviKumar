// ============================================================
//  CYSE 411 Q4 Starter Code
//  Employee Directory Application


function loadSession() {
    try { // uses try/catch now
        const raw = sessionStorage.getItem("session");
        const session = JSON.parse(raw);
        // field validation is below.
        if (session.userId.length() == 0 || session.userID == null || session.role.length() == 0 || session.role == null || session.displayName.length() == 0 || session.displayName == null) {        
            throw err("One or more fields are invalid.");
        }
        else {
            return session;
        }   
    }
    
    catch(err) {
        console.error("There was a either a parsing or invalid field error, so failed to authenticate: " + err);
        return null;
    }
}

//  Q4.A  Status Message Rendering
//  Displays an employee's status message on their profile card.
//  VULNERABILITY: The message is inserted via innerHTML,
//  allowing any HTML or script tags in the message to
//  execute in the viewer's browser (stored XSS).


function renderStatusMessage(containerElement, message) {
    //containerElement.innerHTML = "<p>" + message + "</p>";   // UNSAFE
    containerElement.innerHTML = ""; // we should clear the list first.

    containerElement.forEach((message) => {
        const liElement = document.createElement("li");
        liElement.textContent = message; // this uses textContent.
        containerElement.appendChild(liElement);
    });
}



//  Q4.B  Search Query Sanitization
//  Builds a display label from the user's search input.
//  VULNERABILITY: The raw input is used directly with no
//  character filtering, no length limit, and no trimming.


function sanitizeSearchQuery(input) {
    // TODO: Implement sanitization.
    // Requirements:
    //   - Allow only letters, digits, spaces, hyphens, underscores
    //   - Trim leading/trailing whitespace before processing
    //   - Max 40 characters
    //   - Return null if the result is empty after sanitization
    //return input;   // UNSAFE – returns raw input unchanged
    
    let sanitized = input.replace(/[^A-za-z0-9 -_]/g, "");
    sanitized = sanitized.trim(); 
    if (sanitized.length == 0) {
        return null;
    }
    else {
        return sanitized.substring(0,40);
    }
}

function performSearch(query) {
    const sanitized = sanitizeSearchQuery(query);
    const label = document.getElementById("search-label");
    label.textContent = "Showing results for: " + sanitized;  // Now safe using textContent.
}



//  Application Bootstrap
//  Runs when the page finishes loading.


document.addEventListener("DOMContentLoaded", function () {

    // Load session
    const session = loadSession();
    if (session) {
        document.getElementById("welcome-msg").textContent =
            "Welcome, " + session.displayName;
    }

    // Simulate receiving a profile card with a status message
    // In production this would come from an API response.
    const simulatedProfiles = [
        {
            name: "Alice Johnson",
            department: "Engineering",
            status: "Working from home today"
        },
        {
            name: "Bob Martinez",
            department: "Security",
            // Attacker-controlled payload – should NOT execute
            status: "<img src=x onerror=\"alert('XSS: session stolen')\">"
        },
        {
            name: "Carol Lee",
            department: "HR",
            status: "Out of office until Friday"
        }
    ];

    const directory = document.getElementById("directory");

    simulatedProfiles.forEach(function (profile) {
        const card = document.createElement("div");
        card.className = "profile-card";

        const nameEl = document.createElement("h3");
        nameEl.textContent = profile.name;

        const deptEl = document.createElement("p");
        deptEl.textContent = "Department: " + profile.department;

        const statusContainer = document.createElement("div");
        statusContainer.className = "status";

        // Q4.A – fix this call
        renderStatusMessage(statusContainer, profile.status);

        card.appendChild(nameEl);
        card.appendChild(deptEl);
        card.appendChild(statusContainer);
        directory.appendChild(card);
    });

    // Search button handler
    document.getElementById("search-btn").addEventListener("click", function () {
        const query = document.getElementById("search-input").value;
        performSearch(query);
    });

});
