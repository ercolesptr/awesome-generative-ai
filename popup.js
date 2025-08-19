document.addEventListener('DOMContentLoaded', () => {
  const voiceSelect = document.getElementById('voices');
  const saveButton = document.getElementById('save');

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

  saveButton.addEventListener('click', () => {
    const selectedVoice = voiceSelect.value;
    chrome.storage.local.set({ voice: selectedVoice }, () => {
      console.log('Voice saved:', selectedVoice);
      window.close();
    });
  });
});
