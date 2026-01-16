document.addEventListener('DOMContentLoaded', () => {
  const voiceSelect = document.getElementById('voices');
  const saveButton = document.getElementById('save');
  const enabledSwitch = document.getElementById('enabled-switch');

  // Load enabled state
  chrome.storage.local.get({ isEnabled: true }, (data) => {
    enabledSwitch.checked = data.isEnabled;
  });

  // Handle enable/disable toggle
  enabledSwitch.addEventListener('change', () => {
    const isEnabled = enabledSwitch.checked;
    chrome.storage.local.set({ isEnabled: isEnabled }, () => {
      console.log('Extension enabled state set to:', isEnabled);
    });
  });

  // Populate voice list
  chrome.tts.getVoices((voices) => {
    const googleVoices = voices.filter(voice => voice.voiceName.includes('Google'));

    googleVoices.forEach(voice => {
      const option = document.createElement('option');
      option.value = voice.voiceName;
      option.textContent = voice.voiceName;
      voiceSelect.appendChild(option);
    });

    chrome.storage.local.get('voice', (data) => {
      if (data.voice) {
        voiceSelect.value = data.voice;
      }
    });
  });

  // Handle voice saving
  saveButton.addEventListener('click', () => {
    const selectedVoice = voiceSelect.value;
    chrome.storage.local.set({ voice: selectedVoice }, () => {
      console.log('Voice saved:', selectedVoice);
      window.close();
    });
  });
});
