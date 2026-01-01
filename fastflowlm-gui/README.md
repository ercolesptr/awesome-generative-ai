# FastflowLM GUI

This is a simple graphical user interface to interact with a local FastflowLM server, optimized for widescreen desktop use.

## Features

-   Widescreen-friendly layout.
-   Chat with your local FastflowLM models.
-   Attach images and text files to your chat for multi-modal interactions.
-   Select the model from a dropdown menu.

## Prerequisites

-   You must have a FastflowLM server running on `http://localhost:11434`.
-   A modern web browser like Chrome, Firefox, or Edge.

## Running the GUI

1.  **Start your FastflowLM server.** Make sure it is accessible at `http://localhost:11434`.

2.  **Customize your model list (optional).** The model dropdown is populated from a hardcoded list in the `script.js` file. You can edit this list to add or remove your own models.

3.  **Open the GUI in your browser.** Navigate to the `fastflowlm-gui` directory and open the `index.html` file directly in your web browser.

4.  **Select a model** from the dropdown menu.

5.  (Optional) **Attach a file** by clicking the "Attach File" button before sending your message. You can attach images (`.png`, `.jpg`, etc.) or plain text files (`.txt`).

You can now start chatting with your FastflowLM model!
