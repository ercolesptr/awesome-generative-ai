let lastSubtitle = '';

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const subtitleElement = document.querySelector('.player-timedtext');
    if (subtitleElement) {
      const spans = subtitleElement.querySelectorAll('span');
      let currentSubtitle = '';
      spans.forEach((span) => {
        currentSubtitle += span.textContent + ' ';
      });
      currentSubtitle = currentSubtitle.trim();

      if (currentSubtitle && currentSubtitle !== lastSubtitle) {
        lastSubtitle = currentSubtitle;
        console.log('New subtitle found:', currentSubtitle);
        chrome.runtime.sendMessage({ text: currentSubtitle });
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

console.log('Subtitle Reader content script for Netflix loaded.');
