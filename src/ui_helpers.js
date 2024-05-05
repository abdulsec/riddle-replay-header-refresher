function addCustomButton(cb) {
    const container = document.querySelector(".c-connection-info__field");
    if (!container) {
        return;
    }

    // Create the button and dropdown using a template string
    const template = `
        <div class="riddle-replay-header-refresher-container">
            <div class="riddle-replay-header-refresher-button-wrapper">
                <button class="riddle-replay-header-refresher-action-button">
                    Update headers <span class="riddle-replay-header-refresher-dropdown-arrow">▼</span>
                </button>
                <div class="riddle-replay-header-refresher-dropdown">
                    <label>Headers separated by newlines</label>
                    <textarea class="riddle-replay-header-refresher-textarea" "placeholder="Enter header names separated by newlines...">cookie</textarea>
                </div>
            </div>
        </div>`;

    const element = document.createElement("div");
    element.innerHTML = template;
    container.parentNode.insertBefore(element, container.nextSibling);

    const button = element.querySelector(".riddle-replay-header-refresher-action-button");
    const dropdown = element.querySelector(".riddle-replay-header-refresher-dropdown");
    const arrow = button.querySelector(".riddle-replay-header-refresher-dropdown-arrow");
    const textarea = dropdown.querySelector(".riddle-replay-header-refresher-textarea");

    textarea.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Manage dropdown visibility
    arrow.addEventListener("click", function (event) {
        event.stopPropagation();
        const isVisible = dropdown.style.display === "block";
        dropdown.style.display = isVisible ? "none" : "block";
        // Adjust styles based on dropdown visibility
        button.style.borderRadius = isVisible ? "5px" : "5px 5px 0 0";
        button.style.backgroundColor = isVisible ? "#a0213e" : "#18181b";
        button.style.borderLeft = isVisible ? "none" : "2px solid #a1a0a0";
        button.style.borderTop = isVisible ? "none" : "2px solid #a1a0a0";
        button.style.borderRight = isVisible ? "none" : "2px solid #a1a0a0";
    });

    document.addEventListener("click", function () {
        if (dropdown.style.display !== "none") {
            dropdown.style.display = "none";
            button.style.borderRadius = "5px";
            button.style.backgroundColor = "#a0213e";
            button.style.borderLeft = "none";
            button.style.borderTop = "none";
            button.style.borderRight = "none";
        }
    });

    button.addEventListener("click", function (event) {
        const textarea = dropdown.querySelector("textarea");
        cb(textarea.value.trim().split("\n"));
    });

    button.addEventListener("mousedown", function () {
        button.style.transform = "scale(0.98)";
    });

    button.addEventListener("mouseup", function () {
        button.style.transform = "scale(1)";
    });
}

function extractHost(httpRequest) {
    return httpRequest
        .split("\n")
        .find((line) => line.startsWith("Host:"))
        ?.substring(6)
        .trim();
}

function getReplayText() {
    const lines = document.querySelectorAll(".cm-content .cm-line");
    let text = [];
    lines.forEach((line) => {
        text.push(line.textContent);
    });
    return text.join("\n");
}

function getReplayHost() {
    const replayText = getReplayText();
    if (replayText) {
        return extractHost(replayText);
    } else {
        return null;
    }
}

function updateHeaderValue(headerName, headerValue) {
    const headers = document.querySelectorAll(".c-lang-http-request__headerName");
    headers.forEach((header) => {
        if (header.textContent.trim() === headerName) {
            const headerContainer = header.parentNode;
            if (headerContainer) {
                headerContainer.innerHTML = `<span class="c-lang-http-request__headerName">${headerName}</span>: ${headerValue}`;
            }
        }
    });
}

export { getReplayHost, addCustomButton, updateHeaderValue };
