const HISTORY_KEY = 'subtitleHistory';
const MAX_HISTORY = 10;

let messageQueue = [];
let isProcessing = false;

function normalizeSubtitle(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function processQueue() {
  if (isProcessing || messageQueue.length === 0) {
    return;
  }
  isProcessing = true;
  const request = messageQueue.shift();

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
      // Duplicate detected
      isProcessing = false;
      processQueue();
    }
  });
}

// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ voice: 'Google US English' });
  chrome.storage.session.set({ [HISTORY_KEY]: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    messageQueue.push(request);
    processQueue();
  }
  return true;
});
