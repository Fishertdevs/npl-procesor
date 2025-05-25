import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, FileText } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="bg-white dark:bg-slate-950 border-b">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <h1 className="text-xl font-bold">NLP Processor</h1>
              <nav className="flex gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Inicio
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/documentation">
                    <FileText className="mr-2 h-4 w-4" />
                    Documentación
                  </Link>
                </Button>
              </nav>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
