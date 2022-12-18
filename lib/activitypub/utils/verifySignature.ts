export function verifySignature(signature, publicKeyJson) {
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
