import { getPreviousInterceptedRawRequests } from "./graphql_helpers.js";
import { getReplayHost, addCustomButton, updateHeaderValue } from "./ui_helpers.js";

window.REPLAY_COOKIE_REFRESHER_AMOUNT = 1000; // Allow the user to change the amount of requests to search through
import "../dist/style.css";
function extractHeaders(httpRequest, headers) {
    // Split the request into lines and filter out the header lines.
    const lines = httpRequest.split("\r\n");
    const headerMap = {};

    // Create a set for case-insensitive header search
    const searchHeaders = new Set(headers.map((header) => header.toLowerCase()));
    const foundHeaders = {};

    // Iterate over each line to find headers
    lines.forEach((line) => {
        const index = line.indexOf(":");
        if (index !== -1) {
            const key = line.substring(0, index).trim();
            const value = line.substring(index + 1).trim();
            headerMap[key.toLowerCase()] = { originalKey: key, value: value };
        }
    });

    // Map the found headers back to the original case as needed
    headers.forEach((header) => {
        const lowerCaseHeader = header.toLowerCase();
        if (headerMap[lowerCaseHeader]) {
            foundHeaders[headerMap[lowerCaseHeader].originalKey] = headerMap[lowerCaseHeader].value;
        }
    });

    return foundHeaders;
}

async function findHeaders(host, headers, size) {
    const requests = (await getPreviousInterceptedRawRequests(host, size)).reverse(); // Reverse to get the latest requests first
    const foundHeaders = {};

    for (let request of requests) {
        const headersFromRequest = extractHeaders(request.raw, headers);
        Object.assign(foundHeaders, headersFromRequest);
        // Break if all headers are found
        if (Object.keys(foundHeaders).length === headers.length) {
            break;
        }
    }

    return foundHeaders;
}

let observer = null;
let targetElement = null;

EvenBetterAPI.eventManager.on("onPageOpen", (e) => {
    if (e.newUrl === "#/replay") {
        targetElement = document.querySelector(".c-replay__replay-session");

        if (targetElement) {
            observer = new MutationObserver(handleChange);
            const config = {
                childList: true,
                attributes: true,
                subtree: true,
                attributeOldValue: true,
                characterData: true,
            };
            observer.observe(targetElement, config);
        }
    }
});

async function handleChange() {
    const existingButton = document.querySelector(".riddle-replay-header-refresher-container");
    if (!existingButton) {
        addCustomButton(async (headersToUpdate) => {
            const host = getReplayHost();
            if (host) {
                const headers = await findHeaders(host, headersToUpdate, window.REPLAY_COOKIE_REFRESHER_AMOUNT);
                for (let [headerName, headerValue] of Object.entries(headers)) {
                    console.log("Correct container not found");
                    updateHeaderValue(headerName, headerValue);
                }
            }
        });
    }
}
