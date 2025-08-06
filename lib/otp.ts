// OTP (One-Time Password) utilities
// This provides a simple email-based OTP system for team verification

/**
 * Generate a 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP temporarily (in production, use Redis or similar)
 * For now, using in-memory storage with expiration
 */
const otpStore = new Map<string, { otp: string; expires: number; email: string }>();

/**
 * Store OTP for verification
 */
export function storeOTP(email: string, otp: string, expirationMinutes: number = 10): void {
  const expires = Date.now() + (expirationMinutes * 60 * 1000);
  otpStore.set(email.toLowerCase(), { otp, expires, email });
  
  // Clean up expired OTPs
  setTimeout(() => {
    otpStore.delete(email.toLowerCase());
  }, expirationMinutes * 60 * 1000);
}

/**
 * Verify OTP
 */
export function verifyOTP(email: string, providedOTP: string): boolean {
  const stored = otpStore.get(email.toLowerCase());
  
  if (!stored) {
    return false; // OTP not found
  }
  
  if (Date.now() > stored.expires) {
    otpStore.delete(email.toLowerCase());
    return false; // OTP expired
  }
  
  if (stored.otp !== providedOTP) {
    return false; // OTP doesn't match
  }
  
  // OTP is valid, remove it from store
  otpStore.delete(email.toLowerCase());
  return true;
}

/**
 * Send OTP via email (simplified version)
 * In production, use a proper email service like SendGrid, AWS SES, etc.
 */
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    // For demonstration - in production, integrate with email service
    console.log(`OTP for ${email}: ${otp}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, you would do:
    // const emailService = new SendGridService(); // or similar
    // await emailService.send({
    //   to: email,
    //   subject: 'Your Team Registration OTP',
    //   html: `Your OTP is: <strong>${otp}</strong>. Valid for 10 minutes.`
    // });
    
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
}

/**
 * Alternative: Free SMS services (limited but possible)
 * Some options for free/low-cost SMS:
 * 1. Twilio (free trial with credits)
 * 2. TextBelt (free tier: 1 SMS per day per phone number)
 * 3. SMS Gateway APIs with free tiers
 */
export async function sendOTPSMS(phoneNumber: string, otp: string): Promise<boolean> {
  try {
    // Example using TextBelt free API (1 SMS per day limit)
    const response = await fetch('https://textbelt.com/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: phoneNumber,
        message: `Your AR Treasure Hunt OTP: ${otp}. Valid for 10 minutes.`,
        key: 'textbelt' // free tier key
      })
    });
    
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Failed to send OTP SMS:', error);
    return false;
  }
}