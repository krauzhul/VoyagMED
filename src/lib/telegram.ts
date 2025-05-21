import { supabase } from './supabase';

export async function sendTelegramNotification(
  patientId: string,
  message: string,
  type: 'medication' | 'appointment',
  notificationId: string
) {
  try {
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: {
        patient_id: patientId,
        message,
        type,
        notification_id: notificationId
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    throw error;
  }
}