import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { Bot, webhookCallback } from 'npm:grammy@1.21.1';

const bot = new Bot(Deno.env.get('TELEGRAM_BOT_TOKEN') || '');

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Handle start command
bot.command('start', async (ctx) => {
  const chatId = ctx.chat.id;
  const username = ctx.from?.username;

  try {
    // Store Telegram chat ID in the database
    const { error } = await supabase
      .from('telegram_users')
      .upsert({
        chat_id: chatId,
        username: username,
        is_active: true
      });

    if (error) throw error;

    await ctx.reply(
      'Добро пожаловать! Вы успешно подключили уведомления. Теперь вы будете получать напоминания о приёме лекарств и записях к врачу.'
    );
  } catch (error) {
    console.error('Error storing chat ID:', error);
    await ctx.reply('Произошла ошибка при подключении уведомлений. Пожалуйста, попробуйте позже.');
  }
});

// Handle notification acknowledgments
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;
  const [action, notificationId] = data.split(':');

  if (action === 'ack') {
    try {
      // Update notification status
      const { error } = await supabase
        .from('notification_acknowledgments')
        .insert({
          notification_id: notificationId,
          chat_id: ctx.chat?.id,
          acknowledged_at: new Date().toISOString()
        });

      if (error) throw error;

      await ctx.answerCallbackQuery('Уведомление подтверждено');
      await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    } catch (error) {
      console.error('Error acknowledging notification:', error);
      await ctx.answerCallbackQuery('Произошла ошибка. Попробуйте позже.');
    }
  }
});

const handler = webhookCallback(bot, 'std/http');

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    
    if (req.method === 'POST') {
      return await handler(req);
    }

    return new Response('Expected a POST request', { status: 405 });
  } catch (err) {
    console.error(err);
    return new Response('Internal Server Error', { status: 500 });
  }
});