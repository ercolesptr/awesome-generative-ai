VERSION 5.00
Begin VB.Form frmHelloExample
   Caption         =   "Windows Hello VB6 Example"
   ClientHeight    =   4620
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   6885
   LinkTopic       =   "Form1"
   ScaleHeight     =   4620
   ScaleWidth      =   6885
   StartUpPosition =   3  'Windows Default
   Begin VB.CommandButton cmdRequestVerification
      Caption         =   "Request Verification"
      Height          =   495
      Left            =   240
      TabIndex        =   4
      Top             =   2160
      Width           =   1935
   End
   Begin VB.TextBox txtLog
      Height          =   3855
      Left            =   2400
      MultiLine       =   -1  'True
      ScrollBars      =   2  'Vertical
      TabIndex        =   3
      Top             =   480
      Width           =   4215
   End
   Begin VB.CommandButton cmdAuthenticate
      Caption         =   "Authenticate"
      Height          =   495
      Left            =   240
      TabIndex        =   2
      Top             =   1560
      Width           =   1935
   End
   Begin VB.CommandButton cmdCreateCredential
      Caption         =   "Create Credential"
      Height          =   495
      Left            =   240
      TabIndex        =   1
      Top             =   960
      Width           =   1935
   End
   Begin VB.CommandButton cmdCheckSupport
      Caption         =   "Check Support"
      Height          =   495
      Left            =   240
      TabIndex        =   0
      Top             =   360
      Width           =   1935
   End
   Begin VB.Label Label1
      Caption         =   "Log:"
      Height          =   255
      Left            =   2400
      TabIndex        =   5
      Top             =   120
      Width           =   1215
   End
End
Attribute VB_Name = "frmHelloExample"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

Private authenticator As WindowsHelloAuthenticator
Private Const ACCOUNT_ID As String = "testuser@example.com"

Private Sub Form_Load()
    Set authenticator = New WindowsHelloAuthenticator
End Sub

Private Sub cmdCheckSupport_Click()
    Log "Checking for Windows Hello support..."
    If authenticator.IsSupported() Then
        Log "Windows Hello is supported on this device."
    Else
        Log "Windows Hello is not supported or not set up on this device."
    End If
End Sub

Private Sub cmdCreateCredential_Click()
    Log "Creating credential for account: " & ACCOUNT_ID
    Dim publicKey As String
    publicKey = authenticator.CreateCredential(ACCOUNT_ID)

    If Not IsNullOrEmpty(publicKey) Then
        Log "Credential created successfully."
        Log "Public Key (Base64): " & publicKey
    Else
        Log "Failed to create credential. The user may have canceled the operation."
    End If
End Sub

Private Sub cmdAuthenticate_Click()
    Log "Attempting to authenticate account: " & ACCOUNT_ID

    ' In a real application, the challenge would come from a server.
    ' For this example, we'll create a dummy challenge.
    Dim challenge As String
    challenge = "VGVzdENoYWxsZW5nZUZvclZCNg==" ' Base64 for "TestChallengeForVB6"

    Log "Signing challenge: " & challenge

    Dim signedChallenge As String
    signedChallenge = authenticator.Authenticate(ACCOUNT_ID, challenge)

    If Not IsNullOrEmpty(signedChallenge) Then
        Log "Authentication successful."
        Log "Signed Challenge (Base64): " & signedChallenge
    Else
        Log "Authentication failed. The user may have canceled the operation."
    End If
End Sub

Private Sub cmdRequestVerification_Click()
    Log "Requesting user verification..."
    Dim message As String
    message = "Please verify your identity to proceed."

    If authenticator.RequestVerification(message) Then
        Log "Verification successful."
    Else
        Log "Verification failed or was canceled by the user."
    End If
End Sub

Private Sub Log(message As String)
    txtLog.Text = txtLog.Text & message & vbCrLf
End Sub

Private Function IsNullOrEmpty(s As String) As Boolean
    IsNullOrEmpty = (s = "")
End Function

Private Sub Form_Unload(Cancel As Integer)
    Set authenticator = Nothing
End Sub
