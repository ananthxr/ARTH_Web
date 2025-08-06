// Main App component - this wraps all pages
// This is where we import global styles and set up any global providers

import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}