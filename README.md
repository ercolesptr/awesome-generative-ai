# Subtitle Reader Chrome Extension

This Chrome extension reads subtitles aloud from various streaming platforms, providing a hands-free viewing experience. It uses text-to-speech technology to voice the subtitles as they appear on the screen.

## Features

- **Text-to-Speech:** Automatically reads subtitles aloud in real-time.
- **Multi-Platform Support:** Works with Netflix, Prime Video, and Viki.
- **Customizable Voices:** Allows you to choose from a list of available Google voices in your browser.
- **On/Off Switch:** A convenient toggle in the popup menu to easily enable or disable the reader without disabling the extension.
- **Smart and Robust:**
    - Uses different subtitle extraction techniques tailored to each platform for maximum reliability (Web Speech API for Netflix, `chrome.tts` for others).
    - Includes a smart queuing and de-duplication system to ensure subtitles are read in order and without repetition.

## How to Use

1.  **Install the Extension:** Add the extension to your Chrome browser.
2.  **Navigate to a Supported Site:** Open Netflix, Prime Video, or Viki and play a video that has subtitles.
3.  **Open the Popup:** Click on the extension's icon in the Chrome toolbar.
4.  **Control the Extension:**
    - Use the **Enable Reading** toggle to turn the functionality on or off.
    - To change the voice, select a new one from the dropdown menu and click **Save Voice**. The list is populated with the Google voices available in your browser.

The extension will start reading the subtitles aloud as they appear. Enjoy!
