const TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN";  // Replace with your bot token

export default {
  async fetch(request) {
    if (request.method === "POST") {
      const update = await request.json();

      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;

        if (text.startsWith("http://") || text.startsWith("https://")) {
          const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(text)}`;
          await sendTelegramMessage(chatId, `🔗 Open in Telegram Browser: [Click here](${telegramLink})`, "Markdown");
        } else {
          await sendTelegramMessage(chatId, "❌ Please send a valid link (starting with http:// or https://)");
        }
      }
    }

    return new Response("OK", { status: 200 });
  },
};

async function sendTelegramMessage(chatId, text, parseMode = "") {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const body = JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode });

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
