using System;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Windows.Security.Credentials;
using Windows.Security.Credentials.UI;
using Windows.Storage.Streams;

namespace WindowsHello.Interop
{
    [ComVisible(true)]
    [Guid("A9A2E36D-AF54-475F-857B-85B7A7B6A1E3")]
    [InterfaceType(ComInterfaceType.InterfaceIsDual)]
    public interface IWindowsHelloHelper
    {
        [DispId(1)]
        bool IsWindowsHelloSupported();

        [DispId(2)]
        string CreateCredential(string accountId);

        [DispId(3)]
        string Authenticate(string accountId, string challenge);

        [DispId(4)]
        bool RequestVerification(string message);
    }

    [ComVisible(true)]
    [Guid("B9B2E36D-AF54-475F-857B-85B7A7B6A1E3")]
    [ClassInterface(ClassInterfaceType.None)]
    [ProgId("WindowsHello.Interop.WindowsHelloHelper")]
    public class WindowsHelloHelper : IWindowsHelloHelper
    {
        public bool IsWindowsHelloSupported()
        {
            return Task.Run(async () =>
            {
                var availability = await KeyCredentialManager.IsSupportedAsync();
                return availability;
            }).GetAwaiter().GetResult();
        }

        public string CreateCredential(string accountId)
        {
            return Task.Run(async () =>
            {
                var keyCreationResult = await KeyCredentialManager.RequestCreateAsync(accountId, KeyCredentialCreationOption.ReplaceExisting);

                if (keyCreationResult.Status == KeyCredentialStatus.Success)
                {
                    var userKey = keyCreationResult.Credential;
                    var publicKey = userKey.RetrievePublicKey();
                    return CryptographicBuffer.EncodeToBase64String(publicKey);
                }
                return null;
            }).GetAwaiter().GetResult();
        }

        public string Authenticate(string accountId, string challenge)
        {
            return Task.Run(async () =>
            {
                IBuffer challengeBuffer = CryptographicBuffer.DecodeFromBase64String(challenge);
                var openKeyResult = await KeyCredentialManager.OpenAsync(accountId);

                if (openKeyResult.Status == KeyCredentialStatus.Success)
                {
                    var userKey = openKeyResult.Credential;
                    var signResult = await userKey.RequestSignAsync(challengeBuffer);

                    if (signResult.Status == KeyCredentialStatus.Success)
                    {
                        return CryptographicBuffer.EncodeToBase64String(signResult.Result);
                    }
                }
                return null;
            }).GetAwaiter().GetResult();
        }

        public bool RequestVerification(string message)
        {
            return Task.Run(async () =>
            {
                var consentResult = await UserConsentVerifier.RequestVerificationAsync(message);
                return consentResult == UserConsentVerificationResult.Verified;
            }).GetAwaiter().GetResult();
        }
    }
}
