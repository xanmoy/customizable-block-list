// Define an array of distracting websites
const distractingWebsites = ['facebook.com', 'twitter.com', 'instagram.com', 'web.whatsapp.com'];

// Function to check if a URL is on the distracting websites list
function isDistractingWebsite(url) {
    return distractingWebsites.some(site => url.includes(site));
}

// Function to block distracting websites
function blockDistractingWebsites() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        if (currentTab && isDistractingWebsite(currentTab.url)) {
            chrome.tabs.update(currentTab.id, { url: 'chrome://newtab' });
        }
    });
}

// Listen for tab changes
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading') {
        blockDistractingWebsites();
    }
});

// Function to start the Focus Mode timer
function startFocusModeTimer(duration) {
    chrome.alarms.create('focusModeTimer', { delayInMinutes: duration });
}

// Function to handle the end of the Focus Mode timer
function endFocusMode() {
    chrome.tabs.create({ url: 'chrome://newtab' });
}

// Listen for alarm events
chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === 'focusModeTimer') {
        endFocusMode();
    }
});

// Initialize the extension
startFocusModeTimer(30); // Start Focus Mode with a default duration of 30 minutes
