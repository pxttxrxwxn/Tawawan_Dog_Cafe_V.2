import promptpay from "promptpay-qr";
import QRCode from "qrcode";

/**
 * Generate a PromptPay QR Code
 * @param {string} id - Phone number (0812345678) or National ID (1234567890123)
 * @param {number | null} amount - Optional amount to request (can be null)
 * @returns {Promise<string>} - QR Code Data URL
 */
export async function generatePromptPayQR(id, amount = null) {
  try {
    // Generate QR Code payload
    const qrPayload = promptpay(id, { amount: amount ?? 0 });

    // Convert to QR Code as a Data URL
    const qrDataURL = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: "H",
      scale: 10,
      margin: 1,
    });

    return qrDataURL;
  } catch (error) {
    console.error("Error generating QR Code:", error);
    throw error;
  }
}
