export async function sendTelegramMessage(
  message: string
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  if (!botToken || !chatId) {
    throw new Error("Telegram environment variables are missing");
  }

  const body: {
    chat_id: string;
    text: string;
    parse_mode: "HTML";
    reply_markup?: {
      inline_keyboard: {
        text: string;
        url: string;
      }[][];
    };
  } = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML",
  };

  // Add Dashboard button only when a valid site URL exists
  if (siteUrl) {
    body.reply_markup = {
      inline_keyboard: [
        [
          {
            text: "📂 Open Dashboard",
            url: `${siteUrl}/admin/messages`,
          },
        ],
      ],
    };
  }

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  console.log("Telegram response:", data);

  if (!response.ok || !data.ok) {
    console.error("Telegram API error:", data);
    return false;
  }

  return true;
}