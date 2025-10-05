// FILEPATH: app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import Topbar from '@/components/Topbar'

export const metadata: Metadata = {
    title: 'Lingua Starter',
    description: 'Learn languages with modular features',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col">
                <Topbar />
                <main className="flex-1">{children}</main>
            </body>
        </html>
    )
}
