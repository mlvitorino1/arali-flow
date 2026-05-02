import type { Metadata, Viewport } from "next"
import { DM_Sans, JetBrains_Mono, Montserrat } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
})

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Arali Flow",
    template: "%s · Arali Flow",
  },
  description: "Sistema operacional digital da Arali Móveis",
  robots: { index: false, follow: false }, // app interno, não indexar
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#150E0D",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('arali-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    return;
                  }
                  document.documentElement.classList.add('dark');
                } catch (_) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text-1 antialiased">
        {children}
      </body>
    </html>
  )
}
