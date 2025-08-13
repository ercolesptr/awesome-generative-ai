VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "WindowsHelloAuthenticator"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Option Explicit

Private m_WindowsHelloHelper As Object

Private Sub Class_Initialize()
    On Error GoTo ErrHandler
    Set m_WindowsHelloHelper = CreateObject("WindowsHello.Interop.WindowsHelloHelper")
    Exit Sub
ErrHandler:
    MsgBox "Could not create the WindowsHello.Interop.WindowsHelloHelper object. Please ensure the .NET library is registered for COM interop.", vbCritical, "Initialization Error"
End Sub

Private Sub Class_Terminate()
    Set m_WindowsHelloHelper = Nothing
End Sub

Public Function IsSupported() As Boolean
    If Not m_WindowsHelloHelper Is Nothing Then
        IsSupported = m_WindowsHelloHelper.IsWindowsHelloSupported()
    End If
End Function

Public Function CreateCredential(ByVal accountId As String) As String
    If Not m_WindowsHelloHelper Is Nothing Then
        CreateCredential = m_WindowsHelloHelper.CreateCredential(accountId)
    End If
End Function

Public Function Authenticate(ByVal accountId As String, ByVal challenge As String) As String
    If Not m_WindowsHelloHelper Is Nothing Then
        Authenticate = m_WindowsHelloHelper.Authenticate(accountId, challenge)
    End If
End Function

Public Function RequestVerification(ByVal message As String) As Boolean
    If Not m_WindowsHelloHelper Is Nothing Then
        RequestVerification = m_WindowsHelloHelper.RequestVerification(message)
    End If
End Function
