let videoElement = null;

function setupCueChangeListener(track) {
  track.oncuechange = () => {
    const cues = track.activeCues;
    if (cues.length > 0) {
      let originalSubtitle = '';
      for (let i = 0; i < cues.length; i++) {
        originalSubtitle += cues[i].text + ' ';
      }

      const subtitleText = originalSubtitle.trim();
      if (subtitleText) {
        chrome.runtime.sendMessage({ text: subtitleText });
      }
    }
  };
}

function setupTextTrackListeners(video) {
  if (video.textTracks) {
    video.textTracks.onaddtrack = (event) => {
      const track = event.track;
      if (track.mode === 'showing') {
        setupCueChangeListener(track);
      }
      track.onmodechange = () => {
        if (track.mode === 'showing') {
          setupCueChangeListener(track);
        }
      };
    };

    const activeTrack = Array.from(video.textTracks).find(track => track.mode === 'showing');
    if (activeTrack) {
      setupCueChangeListener(activeTrack);
    }
  }
}

const observer = new MutationObserver((mutations) => {
  const newVideoElement = document.querySelector('video');
  if (newVideoElement && newVideoElement !== videoElement) {
    videoElement = newVideoElement;
    setupTextTrackListeners(videoElement);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

console.log('Subtitle Reader content script for Viki loaded.');
