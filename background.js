chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ voice: 'Google US English' });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    chrome.storage.local.get('voice', (data) => {
      chrome.tts.speak(request.text, {
        voiceName: data.voice,
        onEvent: (event) => {
          if (event.type === 'error') {
            console.error('Error in TTS:', event.errorMessage);
          }
        }
      });
    });
  }
});
