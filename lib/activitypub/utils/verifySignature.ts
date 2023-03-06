export function verifySignature(signature:any, publicKeyJson:any) {
  let signatureValid;

  try {
    // Verify the signature
    signatureValid = signature.verify(
      publicKeyJson.publicKeyPem
    );
  } catch (error) {
    console.log("Signature Verification error", error);
  }

  return signatureValid;
}
