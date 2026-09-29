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
  from?: TelegramUser;
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
    TELEGRAM HELPERS
    =========================================================
    */

    async function telegramRequest(
      method: string,
      body: Record<string, unknown>
    ) {
      return fetch(
        `https://api.telegram.org/bot${botToken}/${method}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
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

💻 Full-Stack Developer

أبني الأنظمة والتطبيقات والتجارب الرقمية.

استكشف أعمالي، تواصل معي، أو اطّلع على سيرتي الذاتية من خلال الأزرار بالأسفل.

━━━━━━━━━━━━━━━━━━━━
🚀 Build • Create • Learn
━━━━━━━━━━━━━━━━━━━━`
            : `━━━━━━━━━━━━━━━━━━━━
👋 WELCOME TO MERDO ZONE
━━━━━━━━━━━━━━━━━━━━

💻 Full-Stack Developer

I build systems, applications, and digital experiences.

Explore my work, get in touch, or view my resume using the buttons below.

━━━━━━━━━━━━━━━━━━━━
🚀 Build • Create • Learn
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
                      text: "📊 حالة الموقع",
                      callback_data: "website_status_ar",
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
                      text: "📊 Website Status",
                      callback_data: "website_status_en",
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

        await telegramRequest("sendMessage", {
          chat_id: chatId,
          text: startMessage,
          reply_markup: keyboard,
        });
      }
    }

    /*
    =========================================================
    WEBSITE STATUS
    =========================================================
    */

    const callbackQuery = update.callback_query;

    if (
      callbackQuery &&
      (callbackQuery.data === "website_status_ar" ||
        callbackQuery.data === "website_status_en" ||
        callbackQuery.data === "refresh_status_ar" ||
        callbackQuery.data === "refresh_status_en")
    ) {
      const chatId = callbackQuery.message?.chat.id;

      if (!chatId) {
        return NextResponse.json({ success: true });
      }

      const language =
        callbackQuery.data.endsWith("_ar")
          ? "ar"
          : "en";

      let statusData: {
        status?: string;
        website?: string;
        database?: string;
        responseTime?: string;
      } = {};

      try {
        const statusResponse = await fetch(
          `${siteUrl}/api/status`,
          {
            cache: "no-store",
          }
        );

        statusData = await statusResponse.json();
      } catch {
        statusData = {
          status: "offline",
          website: "offline",
          database: "offline",
          responseTime: "-",
        };
      }

      const websiteOnline =
        statusData.website === "online";

      const databaseOnline =
        statusData.database === "online";

      const overallOnline =
        statusData.status === "online";

      const websiteIcon = websiteOnline ? "🟢" : "🔴";
      const databaseIcon = databaseOnline ? "🟢" : "🔴";
      const overallIcon = overallOnline ? "🟢" : "🟡";

      const statusMessage =
        language === "ar"
          ? `━━━━━━━━━━━━━━━━━━━━
${overallIcon} حالة MERDO ZONE
━━━━━━━━━━━━━━━━━━━━

🌐 الموقع       ${websiteIcon} ${
              websiteOnline ? "يعمل" : "متوقف"
            }

🗄️ قاعدة البيانات ${databaseIcon} ${
              databaseOnline ? "تعمل" : "متوقفة"
            }

⚡ زمن الاستجابة  ${statusData.responseTime ?? "-"}

━━━━━━━━━━━━━━━━━━━━
🕐 تم الفحص الآن
━━━━━━━━━━━━━━━━━━━━`
          : `━━━━━━━━━━━━━━━━━━━━
${overallIcon} MERDO ZONE STATUS
━━━━━━━━━━━━━━━━━━━━

🌐 Website       ${websiteIcon} ${
              websiteOnline ? "Online" : "Offline"
            }

🗄️ Database      ${databaseIcon} ${
              databaseOnline ? "Online" : "Offline"
            }

⚡ Response Time  ${statusData.responseTime ?? "-"}

━━━━━━━━━━━━━━━━━━━━
🕐 Checked just now
━━━━━━━━━━━━━━━━━━━━`;

      await telegramRequest("answerCallbackQuery", {
        callback_query_id: callbackQuery.id,
      });

      await telegramRequest("sendMessage", {
        chat_id: chatId,
        text: statusMessage,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  language === "ar"
                    ? "🔄 تحديث الحالة"
                    : "🔄 Refresh Status",
                callback_data:
                  language === "ar"
                    ? "refresh_status_ar"
                    : "refresh_status_en",
              },
            ],
          ],
        },
      });

      return NextResponse.json({ success: true });
    }

    /*
    =========================================================
    DOWNLOAD RESUME
    =========================================================
    */

    if (
      callbackQuery &&
      callbackQuery.data === "download_resume"
    ) {
      const chatId = callbackQuery.message?.chat.id;

      if (!chatId) {
        return NextResponse.json({ success: true });
      }

      const language =
        callbackQuery.from?.language_code?.toLowerCase() ===
        "ar"
          ? "ar"
          : "en";

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

      await telegramRequest("answerCallbackQuery", {
        callback_query_id: callbackQuery.id,
        text: resume
          ? language === "ar"
            ? "📄 جاري تجهيز السيرة الذاتية..."
            : "📄 Preparing your resume..."
          : language === "ar"
            ? "❌ السيرة الذاتية غير متاحة حاليًا."
            : "❌ Resume is currently unavailable.",
      });

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

      const telegramResponse = await telegramRequest(
        "sendDocument",
        {
          chat_id: chatId,
          document: resumeUrl,
          caption: `📄 ${resume.title}`,
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