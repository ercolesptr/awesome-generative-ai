let lastMsg = [];
let selectedVoice;
let isEnabled = true; // Cached state

// Get initial enabled state and listen for changes
chrome.storage.local.get({ isEnabled: true }, (data) => {
  isEnabled = data.isEnabled;
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.isEnabled) {
    isEnabled = changes.isEnabled.newValue;
    console.log('Netflix: Enabled state changed to:', isEnabled);
    if (!isEnabled) {
      // If disabled, stop any current speech
      window.speechSynthesis.cancel();
    }
  }
});

// Get voice from storage
chrome.storage.local.get('voice', (data) => {
  const voiceName = data.voice || '';

  // This needs to be robust against voices loading late
  const setVoice = () => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (voiceName) {
        selectedVoice = voices.find((voice) => voice.name === voiceName);
      } else {
        selectedVoice = voices.find((voice) => voice.lang === 'en-US');
      }
      console.log('Netflix: Selected voice:', selectedVoice);
    }
  };

  setVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = setVoice;
  }
});

function processSubtitle() {
  // Only process if the extension is enabled
  if (!isEnabled) {
    return;
  }

  const subtitleElement = document.querySelector('.player-timedtext');

  if (subtitleElement && subtitleElement.textContent != "") {
    let currentText = subtitleElement.textContent.trim();

    if (currentText == lastMsg) return;
    lastMsg = currentText;

    // Cancel previous speech before starting new one for Netflix's rapid updates
    window.speechSynthesis.cancel();

    let msg = new SpeechSynthesisUtterance(currentText.toLowerCase());

    if (selectedVoice) {
      msg.voice = selectedVoice;
    }

    msg.lang = 'en-US';
    msg.rate = 1;

    window.speechSynthesis.speak(msg);
  }
}

const observer = new MutationObserver((mutations) => {
  processSubtitle();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

console.log('Netflix content script loaded.');
