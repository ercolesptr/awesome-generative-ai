# FastflowLM GUI

This is a simple graphical user interface to interact with a local FastflowLM server, optimized for desktop use.

## Features

-   Desktop-friendly layout.
-   Chat with your local FastflowLM models.
-   Attach images and text files to your chat for multi-modal interactions.
-   Specify the model name directly in the UI.

## Prerequisites

-   You must have a FastflowLM server running on `http://localhost:11434`.
-   You need Python installed to run a simple web server.

## Running the GUI

1.  **Start your FastflowLM server.** Make sure it is accessible at `http://localhost:11434`.

2.  **Serve the GUI files.** Navigate to the `fastflowlm-gui` directory in your terminal and run the following command to start a simple web server:

    ```bash
    python -m http.server 8000
    ```

3.  **Open the GUI in your browser.** Open your web browser and navigate to the following address:

    [http://localhost:8000](http://localhost:8000)

4.  **Enter the model name** you are serving with FastflowLM into the "model name" input field.

5.  (Optional) **Attach a file** by clicking the "Attach File" button before sending your message. You can attach images (`.png`, `.jpg`, etc.) or plain text files (`.txt`).

You can now start chatting with your FastflowLM model!
