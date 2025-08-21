let lastMsg = [];
let selectedVoice;

// Get voice from storage
chrome.storage.local.get('voice', (data) => {
  const voiceName = data.voice || '';

  window.speechSynthesis.onvoiceschanged = function () {
    let voices = window.speechSynthesis.getVoices();
    if (voiceName) {
      selectedVoice = voices.find((voice) => voice.name === voiceName);
    } else {
      selectedVoice = voices.find((voice) => voice.lang === 'en-US');
    }
    console.log('Netflix: Selected voice:', selectedVoice);
  };
});

function processSubtitle() {
  const subtitleElement = document.querySelector('.player-timedtext');

  if (subtitleElement && subtitleElement.textContent != "") {
    console.log('Netflix subtitle text:', subtitleElement.textContent);

    let currentText = subtitleElement.textContent.trim();

    if (currentText == lastMsg) return;
    lastMsg = currentText;

    console.log('Netflix: Speaking new subtitle:', currentText);

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

console.log('Netflix content script loaded (exact working extension method).');
