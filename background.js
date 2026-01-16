const HISTORY_KEY = 'subtitleHistory';
const MAX_HISTORY = 10;

let messageQueue = [];
let isProcessing = false;
let isEnabled = true; // Cached state

// Get initial enabled state
chrome.storage.local.get({ isEnabled: true }, (data) => {
  isEnabled = data.isEnabled;
});

// Listen for changes to the enabled state
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.isEnabled) {
    isEnabled = changes.isEnabled.newValue;
    console.log('Background: Enabled state changed to:', isEnabled);
    if (!isEnabled) {
      // If disabled, stop all speech and clear the queue
      chrome.tts.stop();
      messageQueue = [];
    }
  }
});

function normalizeSubtitle(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function processQueue() {
  if (isProcessing || messageQueue.length === 0) {
    return;
  }
  isProcessing = true;
  const request = messageQueue.shift();

  // De-duplication and speaking logic...
  const originalSubtitle = request.text;
  const normalizedSubtitle = normalizeSubtitle(originalSubtitle);

  chrome.storage.session.get([HISTORY_KEY], (result) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
      isProcessing = false;
      processQueue();
      return;
    }

    let history = result[HISTORY_KEY] || [];

    if (normalizedSubtitle && !history.includes(normalizedSubtitle)) {
      history.push(normalizedSubtitle);
      if (history.length > MAX_HISTORY) {
        history.shift();
      }

      chrome.storage.session.set({ [HISTORY_KEY]: history }, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          isProcessing = false;
          processQueue();
          return;
        }

        chrome.storage.local.get('voice', (data) => {
          chrome.tts.speak(originalSubtitle, {
            voiceName: data.voice,
            enqueue: true,
            onEvent: (event) => {
              if (event.type === 'error') {
                console.error('Error in TTS:', event.errorMessage);
              }
            }
          });
          isProcessing = false;
          processQueue();
        });
      });
    } else {
      isProcessing = false;
      processQueue();
    }
  });
}

// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ voice: 'Google US English', isEnabled: true });
  chrome.storage.session.set({ [HISTORY_KEY]: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Only process if the extension is enabled
  if (request.text && isEnabled) {
    messageQueue.push(request);
    processQueue();
  }
  return true;
});
