import './globals.css'
import type { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
    title: 'Lingua Starter',
    description: 'Learn languages with modular features',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen grid grid-cols-[220px_1fr]">
                <Sidebar />
                <main>{children}</main>
            </body>
        </html>
    )
}
