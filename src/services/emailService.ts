import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/email';

export const sendEmail = async (templateParams: Record<string, unknown>) => {
  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
