import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/email';

export const sendEmail = async (templateParams: Record<string, unknown>) => {
  try {
    console.log('Sending email with params:', templateParams);
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email. Error details:', error);
    if (error && typeof error === 'object' && 'text' in error) {
      console.error('EmailJS Error Text:', (error as any).text);
    }
    throw error;
  }
};
