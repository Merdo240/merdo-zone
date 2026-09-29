import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

type TelegramUser = {
  language_code?: string;
};

type TelegramChat = {
  id: number;
};

type TelegramMessage = {
  text?: string;
  chat: TelegramChat;
  from?: TelegramUser;
};

type TelegramCallbackQuery = {
  id: string;
  data?: string;
  message?: {
    chat: TelegramChat;
  };
};

type TelegramUpdate = {
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
};

export async function POST(request: Request) {
  try {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

    const receivedSecret = request.headers.get(
      "x-telegram-bot-api-secret-token"
    );

    if (!secret || receivedSecret !== secret) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const update: TelegramUpdate = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const siteUrl = process.env.SITE_URL?.replace(/\/$/, "");

    if (!botToken || !siteUrl) {
      throw new Error("Telegram environment variables are missing");
    }

    /*
    =========================================================
    /start
    =========================================================
    */

    const message = update.message;

    if (message?.text) {
      const chatId = message.chat.id;
      const text = message.text.trim();

      if (text === "/start") {
        const language =
          message.from?.language_code?.toLowerCase() === "ar"
            ? "ar"
            : "en";

        const startMessage =
          language === "ar"
            ? `━━━━━━━━━━━━━━━━━━━━
👋 أهلاً بك في MERDO ZONE
━━━━━━━━━━━━━━━━━━━━

Full-Stack Developer

استكشف موقعي، أعمالي، ومشاريعي الرقمية.

━━━━━━━━━━━━━━━━━━━━`
            : `━━━━━━━━━━━━━━━━━━━━
👋 WELCOME TO MERDO ZONE
━━━━━━━━━━━━━━━━━━━━

Full-Stack Developer

Explore my website, work, and digital projects.

━━━━━━━━━━━━━━━━━━━━`;

        const keyboard =
          language === "ar"
            ? {
                inline_keyboard: [
                  [
                    {
                      text: "🌐 استكشف موقعي",
                      url: siteUrl,
                    },
                  ],
                  [
                    {
                      text: "📩 تواصل معي",
                      url: `${siteUrl}/contact`,
                    },
                  ],
                  [
                    {
                      text: "📄 تحميل السيرة الذاتية",
                      callback_data: "download_resume",
                    },
                  ],
                ],
              }
            : {
                inline_keyboard: [
                  [
                    {
                      text: "🌐 Explore My Website",
                      url: siteUrl,
                    },
                  ],
                  [
                    {
                      text: "📩 Contact Me",
                      url: `${siteUrl}/contact`,
                    },
                  ],
                  [
                    {
                      text: "📄 Download My Resume",
                      callback_data: "download_resume",
                    },
                  ],
                ],
              };

        await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: startMessage,
              reply_markup: keyboard,
            }),
          }
        );
      }
    }

    /*
    =========================================================
    DOWNLOAD RESUME
    =========================================================
    */

    const callbackQuery = update.callback_query;

    if (
      callbackQuery &&
      callbackQuery.data === "download_resume"
    ) {
      const chatId = callbackQuery.message?.chat.id;

      if (!chatId) {
        return NextResponse.json({ success: true });
      }

      /*
      Find the latest visible resume
      */

      const resume = await prisma.resume.findFirst({
        where: {
          isVisible: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      /*
      Tell Telegram that the button was received
      */

      await fetch(
        `https://api.telegram.org/bot${botToken}/answerCallbackQuery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: resume
              ? "📄 Preparing your resume..."
              : "❌ Resume is currently unavailable.",
          }),
        }
      );

      if (!resume) {
        return NextResponse.json({ success: true });
      }

      /*
      Public endpoint that securely downloads
      the resume from Cloudinary.
      */

      const resumeUrl =
        `${siteUrl}/api/resume/${resume.id}`;

      /*
      Send the resume to the Telegram user
      */

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            document: resumeUrl,
            caption: `📄 ${resume.title}`,
          }),
        }
      );

      const telegramData = await telegramResponse.json();

      console.log(
        "Telegram resume response:",
        telegramData
      );

      if (!telegramResponse.ok || !telegramData.ok) {
        console.error(
          "Telegram resume error:",
          telegramData
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "Telegram webhook error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Webhook error",
      },
      { status: 500 }
    );
  }
}