let lastSubtitle = '';
let videoElement = null;

function setupCueChangeListener(track) {
  console.log('Setting up cue change listener for track:', track);
  track.oncuechange = () => {
    console.log('Cue change event fired for track:', track);
    const cues = track.activeCues;
    if (cues.length > 0) {
      let currentSubtitle = '';
      for (let i = 0; i < cues.length; i++) {
        currentSubtitle += cues[i].text + ' ';
      }
      currentSubtitle = currentSubtitle.trim();

      if (currentSubtitle && currentSubtitle !== lastSubtitle) {
        lastSubtitle = currentSubtitle;
        console.log('New subtitle found:', currentSubtitle);
        chrome.runtime.sendMessage({ text: currentSubtitle });
      }
    }
  };
}

function setupTextTrackListeners(video) {
  if (video.textTracks) {
    video.textTracks.onaddtrack = (event) => {
      const track = event.track;
      console.log('Text track added:', track.label, 'language:', track.language, 'mode:', track.mode);
      if (track.mode === 'showing') {
        setupCueChangeListener(track);
      }
      track.onmodechange = () => {
        console.log('Track mode changed:', track.label, 'new mode:', track.mode);
        if (track.mode === 'showing') {
          setupCueChangeListener(track);
        }
      };
    };

    const activeTrack = Array.from(video.textTracks).find(track => track.mode === 'showing');
    if (activeTrack) {
      console.log('Found already active track:', activeTrack);
      setupCueChangeListener(activeTrack);
    }
  }
}

const observer = new MutationObserver((mutations) => {
  const newVideoElement = document.querySelector('video');
  if (newVideoElement && newVideoElement !== videoElement) {
    console.log('New video element detected. Setting up listeners.');
    videoElement = newVideoElement;
    setupTextTrackListeners(videoElement);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

console.log('Subtitle Reader content script for Prime Video loaded.');
