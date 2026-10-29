import type { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer } from "@/components/layout";
import { siteConfig } from "@/config";

export const metadata: Metadata = {
  title: "Privacy & Analytics | Tanzamul Azad",
  description: "How optional analytics and contact information are handled on Tanzamul Azad's portfolio.",
  alternates: { canonical: `${siteConfig.url}/privacy` },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <main className="min-h-svh"><Navbar /><article className="shell max-w-3xl py-28">
    <h1 className="text-3xl font-semibold">Privacy &amp; analytics</h1>
    <p className="mt-4 text-muted-foreground">This portfolio is maintained by {siteConfig.author.name}. Updated October 22, 2026.</p>
    <h2 className="mt-8 text-xl font-semibold">Optional Google Analytics</h2>
    <p className="mt-3 leading-relaxed">When configured, Google Analytics 4 measures page visits, project and article clicks, CV downloads, contact actions and loading performance after you choose “Allow analytics”. It is not loaded before that choice. Browser Do Not Track and Global Privacy Control signals are respected.</p>
    <p className="mt-3 leading-relaxed">The integration disables Google signals and advertising personalization. Custom events exclude contact-form names, email addresses and message text. Page-view URLs exclude query strings and fragments. Google receives technical request information when analytics is enabled and processes it according to its own policies and the property's settings.</p>
    <p className="mt-3 leading-relaxed">Your choice is saved in this browser. You can change it using “Analytics preferences” in the footer. Declining disables this integration and removes its analytics cookies where accessible. Browser blockers may also prevent analytics.</p>
    <a href="https://policies.google.com/privacy" className="mt-3 inline-block underline" rel="noopener noreferrer" target="_blank">Google's privacy policy</a>
    <h2 className="mt-8 text-xl font-semibold">AI assistant</h2>
    <p className="mt-3 leading-relaxed">Messages you type into “Ask AI about me” are sent to third-party AI providers, currently OpenAI with other providers as fallbacks, to generate an answer. Those providers may retain them and, depending on the account settings, use them to improve their services. They are not stored on this website. Please do not enter personal or sensitive information.</p>

    <h2 className="mt-8 text-xl font-semibold">Contact and hosting</h2>
    <p className="mt-3 leading-relaxed">Information you submit through the contact form is used to receive and respond to your enquiry. Form contents are not sent as analytics events. Hosting and service providers may process ordinary technical logs needed to serve the website and handle abuse.</p>
    <p className="mt-3 leading-relaxed">For questions, email <a href={`mailto:${siteConfig.contact.email}`} className="underline">{siteConfig.contact.email}</a>.</p>
    <Link href="/" className="mt-8 inline-block underline">Back to portfolio</Link>
  </article><Footer /></main>;
}
