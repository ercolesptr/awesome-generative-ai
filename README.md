# Windows Hello Authentication for VB6

This project provides a solution for using Windows Hello (fingerprint, face, PIN) for authentication in classic Visual Basic 6 applications.

## Overview

Since VB6 cannot directly call modern Windows UWP APIs, this solution uses a C# COM helper library as a bridge. The architecture is as follows:

`VB6 Application` <--> `VB6 Class Module` <--> `C# COM Helper Library` <--> `Windows Hello API`

This repository contains:
1.  A C# project for the COM helper library (`WindowsHelloHelper`).
2.  A VB6 class module (`WindowsHelloAuthenticator.cls`) that wraps the COM object.
3.  A VB6 example project (`HelloExample.vbp`) that demonstrates the usage.

## Prerequisites

*   **Visual Studio:** Visual Studio 2017 or later with the .NET desktop development workload installed.
*   **Visual Basic 6.0 IDE:** The classic VB6 development environment.
*   **Windows 10/11:** With Windows Hello set up (PIN, fingerprint, etc.).

## Part 1: Building the C# COM Helper

1.  **Open the C# Project:**
    *   Open Visual Studio.
    *   Open the `WindowsHelloHelper.csproj` file located in the `WindowsHelloHelper` folder.

2.  **Check References:**
    *   The project requires references to the UWP APIs. The `.csproj` file is configured to look for these in standard locations. If you have issues, you may need to adjust the paths in `WindowsHelloHelper.csproj` for `System.Runtime.WindowsRuntime.dll` and `Windows.winmd`.

3.  **Build the Project:**
    *   Build the solution (Build > Build Solution). This will compile the code and create `WindowsHelloHelper.dll` in the `bin\Debug` or `bin\Release` folder.
    *   The project is configured to automatically register the assembly for COM interop on a successful build (`RegisterForComInterop` is set to `true`).

## Part 2: Registering the COM Helper

If the automatic registration during the build process fails, you can register the assembly manually.

1.  **Open Developer Command Prompt:**
    *   Open the Developer Command Prompt for Visual Studio. You must run it as an administrator.

2.  **Run `regasm.exe`:**
    *   Navigate to the directory containing `WindowsHelloHelper.dll` (e.g., `cd path\to\WindowsHelloHelper\bin\Debug`).
    *   Run the following command:
        ```
        regasm.exe WindowsHelloHelper.dll /tlb:WindowsHelloHelper.tlb /codebase
        ```
    *   This command registers the assembly in the Windows Registry and creates a type library (`.tlb`) file, which makes it easier to use from VB6.

## Part 3: Running the VB6 Example

1.  **Open the VB6 Project:**
    *   Open the Visual Basic 6.0 IDE.
    *   Open the `HelloExample.vbp` project file.

2.  **Run the Example:**
    *   Press `F5` to run the project.
    *   The example form will appear. You can use the buttons to interact with the Windows Hello API:
        *   **Check Support:** Verifies if Windows Hello is available.
        *   **Create Credential:** Prompts you to create a new credential tied to a sample account ID. Windows Hello will ask for your PIN or biometric gesture.
        *   **Authenticate:** Simulates a login flow by signing a challenge string. Windows Hello will prompt for authentication.
        *   **Request Verification:** A simple check to confirm the user's presence.

## How It Works

*   The `WindowsHelloHelper` C# class uses the `Windows.Security.Credentials` namespace to interact with the Windows Hello APIs.
*   The class is marked as `[ComVisible(true)]`, which exposes it to COM.
*   The `WindowsHelloAuthenticator` VB6 class uses `CreateObject` to create an instance of the C# helper class.
*   The methods in the VB6 class are simple wrappers that call the corresponding methods on the C# object, hiding the interop details from the application developer.
