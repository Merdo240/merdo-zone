import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./components/LanguageProvider";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Merdo Zone | Full-Stack Developer",
    template: "%s | Merdo Zone",
  },

  description:
    "Merdo Zone is the personal portfolio of a Full-Stack Developer, showcasing projects, technologies, and software development work.",

  keywords: [
  // Brand
  "Merdo Zone",
  "Merdo",
  "ميردو زون",
  "ميردو",

  // English - General
  "Full-Stack Developer",
  "Full Stack Developer",
  "Full-Stack Web Developer",
  "Web Developer",
  "Software Developer",
  "Web Programmer",
  "Software Engineer",
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Web Development",
  "Web Development",
  "Software Development",
  "Programming",
  "Developer Portfolio",
  "Web Developer Portfolio",
  "Software Developer Portfolio",
  "Full Stack Developer Portfolio",
  "Personal Developer Portfolio",
  "Programming Portfolio",

  // Arabic - General
  "مطور ويب",
  "مطور مواقع",
  "مطور برمجيات",
  "مطور برامج",
  "مبرمج",
  "مطور فل ستاك",
  "مطور فول ستاك",
  "مطور Full Stack",
  "مطور واجهات خلفية",
  "مطور Backend",
  "مطور Frontend",
  "تطوير الويب",
  "تطوير المواقع",
  "تطوير البرمجيات",
  "برمجة",
  "مشاريع برمجية",
  "معرض أعمال مبرمج",
  "معرض أعمال مطور",
  "بورتفوليو مبرمج",
  "بورتفوليو مطور",
  "ملف أعمال مطور برمجيات",

  // Next.js
  "Next.js Developer",
  "NextJS Developer",
  "Next.js Web Developer",
  "Next.js Portfolio",
  "NextJS Portfolio",
  "Next.js Developer Portfolio",
  "مطور Next.js",
  "مطور NextJS",
  "برمجة Next.js",
  "تطوير مواقع Next.js",

  // TypeScript
  "TypeScript Developer",
  "TypeScript Web Developer",
  "TypeScript Developer Portfolio",
  "مطور TypeScript",
  "برمجة TypeScript",
  "تطوير TypeScript",

  // JavaScript
  "JavaScript Developer",
  "JavaScript Web Developer",
  "JavaScript Programmer",
  "JavaScript Portfolio",
  "مطور JavaScript",
  "مبرمج JavaScript",
  "برمجة JavaScript",

  // React
  "React Developer",
  "React.js Developer",
  "React Web Developer",
  "React Developer Portfolio",
  "مطور React",
  "مطور React.js",
  "برمجة React",
  "تطوير React",

  // Backend
  "Backend Web Developer",
  "Backend Development",
  "Backend Programming",
  "Server Side Development",
  "مطور Backend",
  "تطوير Backend",
  "برمجة Backend",
  "برمجة الواجهات الخلفية",
  "تطوير الأنظمة",

  // Database
  "Database Developer",
  "MySQL Developer",
  "Database Programming",
  "Database Design",
  "مطور قواعد بيانات",
  "قواعد البيانات",
  "برمجة قواعد البيانات",
  "تصميم قواعد البيانات",
  "MySQL",

  // Technologies
  "Prisma",
  "Prisma ORM",
  "Tailwind CSS",
  "HTML",
  "CSS",
  "Git",
  "GitHub",
  "Vercel",
  "Cloudinary",

  // Arabic technology searches
  "برمجة مواقع",
  "تصميم مواقع",
  "تطوير تطبيقات الويب",
  "تطوير تطبيقات",
  "برمجة تطبيقات الويب",
  "برمجة الأنظمة",
  "بناء الأنظمة البرمجية",
  "حلول برمجية",
  "مشاريع ويب",
  "مشاريع برمجية احترافية",

  // Portfolio / Projects
  "Developer Projects",
  "Web Development Projects",
  "Software Projects",
  "Programming Projects",
  "Coding Projects",
  "مشاريع مطور",
  "مشاريع تطوير الويب",
  "مشاريع برمجة",
  "مشاريع تطوير مواقع",
  "أعمال برمجية",
  "أعمال مطور ويب",

  // Learning / Student
  "IT Student Developer",
  "Information Technology Student",
  "Computer Programming Student",
  "Student Developer Portfolio",
  "طالب تقنية معلومات",
  "طالب IT",
  "طالب برمجة",
  "طالب تطوير برمجيات",
  "طالب تقنية معلومات مبرمج",

  // Arabic + English combinations
  "مطور ويب عربي",
  "مبرمج عربي",
  "مطور برمجيات عربي",
  "Full Stack Developer عربي",
  "Web Developer عربي",
  "Backend Developer عربي",
  "Next.js Developer عربي",
  "TypeScript Developer عربي",
],

  authors: [
    {
      name: "Merdo Zone",
    },
  ],

  creator: "Merdo Zone",

  metadataBase: new URL("https://merdo-zone.vercel.app"),

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
  type: "website",
  url: "https://merdo-zone.vercel.app",
  title: "Merdo Zone | Full-Stack Developer",
  description:
    "Merdo Zone is the personal portfolio of a Full-Stack Developer, showcasing projects, technologies, and software development work.",
  siteName: "Merdo Zone",
  images: [
    {
      url: "/images/og-image.jpeg",
      width: 1000,
      height: 562,
      alt: "Merdo Zone - Full-Stack Developer",
    },
  ],
},

twitter: {
  card: "summary_large_image",
  title: "Merdo Zone | Full-Stack Developer",
  description:
    "Full-Stack Developer portfolio showcasing projects, technologies, and software development work.",
  images: ["/images/og-image.jpeg"],
},

  verification: {
    google: "a1hN24MNg7QLxPyGfKsOK1mMQkBI6KLwV_NfRJ03i6I",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
     <body className="min-h-full flex flex-col">
  <LanguageProvider>
    <Navbar />
    {children}
  </LanguageProvider>
</body>
    </html>
  );
}