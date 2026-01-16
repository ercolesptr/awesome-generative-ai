let lastMsg = [];
let selectedVoice;
let isEnabled = true;

const speechQueue = [];
let isSpeaking = false;

// --- Main function to process the speech queue ---
function speakNext() {
  if (isSpeaking || speechQueue.length === 0) {
    return;
  }
  isSpeaking = true;
  const utterance = speechQueue.shift();

  // When speech ends, set speaking flag to false and process next item
  utterance.onend = () => {
    isSpeaking = false;
    speakNext();
  };

  // If there's an error, also unlock the queue
  utterance.onerror = (event) => {
    console.error('An error occurred during speech synthesis:', event.error);
    isSpeaking = false;
    speakNext();
  };

  window.speechSynthesis.speak(utterance);
}

// --- Logic to handle subtitles found on the page ---
function processSubtitle() {
  if (!isEnabled) {
    return;
  }

  const subtitleElement = document.querySelector('.player-timedtext');

  if (subtitleElement && subtitleElement.textContent != "") {
    let currentText = subtitleElement.textContent.trim();

    if (currentText == lastMsg) return;
    lastMsg = currentText;

    let msg = new SpeechSynthesisUtterance(currentText.toLowerCase());

    if (selectedVoice) {
      msg.voice = selectedVoice;
    }

    msg.lang = 'en-US';
    msg.rate = 1;

    // Add the new subtitle to the queue and try to speak
    speechQueue.push(msg);
    speakNext();
  }
}

// --- Initialization and event listeners ---

// Get initial enabled state and listen for changes
chrome.storage.local.get({ isEnabled: true }, (data) => {
  isEnabled = data.isEnabled;
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.isEnabled) {
    isEnabled = changes.isEnabled.newValue;
    if (!isEnabled) {
      // If disabled, clear the queue and stop any current speech
      speechQueue.length = 0;
      window.speechSynthesis.cancel();
    }
  }
});

// Get voice from storage and set it
chrome.storage.local.get('voice', (data) => {
  const voiceName = data.voice || '';
  const setVoice = () => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      selectedVoice = voices.find((voice) => voice.name === voiceName) || voices.find((voice) => voice.lang === 'en-US');
      console.log('Netflix: Selected voice:', selectedVoice);
    }
  };
  setVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = setVoice;
  }
});

// Observer to detect subtitle changes
const observer = new MutationObserver((mutations) => {
  processSubtitle();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

console.log('Netflix content script with queuing loaded.');
