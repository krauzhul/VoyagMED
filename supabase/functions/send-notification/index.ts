import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { Bot } from 'npm:grammy@1.21.1';

const bot = new Bot(Deno.env.get('TELEGRAM_BOT_TOKEN') || '');

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

Deno.serve(async (req) => {
  try {
    const { notification_id, patient_id, message, type } = await req.json();

    // Get patient's Telegram chat ID
    const { data: telegramUser, error: telegramError } = await supabase
      .from('telegram_users')
      .select('chat_id')
      .eq('patient_id', patient_id)
      .single();

    if (telegramError || !telegramUser) {
      throw new Error('Telegram user not found');
    }

    // Send notification via Telegram
    await bot.api.sendMessage(telegramUser.chat_id, message, {
      reply_markup: {
        inline_keyboard: [[
          {
            text: type === 'medication' ? 'Принято ✓' : 'Получено ✓',
            callback_data: `ack:${notification_id}`
          }
        ]]
      }
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});