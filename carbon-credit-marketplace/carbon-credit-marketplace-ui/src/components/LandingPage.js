import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, ChevronDown, Leaf, Shield, Users, BarChart2, Globe, HelpCircle } from "lucide-react";
import Marketplace from "./Marketplace";

export default function CarbonCreditMarketplace() {
const [activeTab, setActiveTab] = useState(0);
const [activeFaq, setActiveFaq] = useState(null);

const stats = [
    { label: "Total Trades", value: "1,234,567" },
    { label: "Carbon Offset (tons)", value: "987,654" },
    { label: "Active Users", value: "50,000+" },
    { label: "Projects Funded", value: "1,000+" },
];

const faqs = [
    {
    question: "What are carbon credits?",
    answer: "Carbon credits are tradable certificates representing the right to emit one ton of carbon dioxide or equivalent greenhouse gas. They are used to offset carbon emissions and promote sustainable practices."
    },
    {
    question: "How does the marketplace work?",
    answer: "Our marketplace allows users to buy, sell, and trade tokenized carbon credits on the Neo X blockchain. Users can browse available credits, make offers, and complete transactions securely and efficiently."
    },
    {
    question: "What is dBFT governance?",
    answer: "dBFT (Delegated Byzantine Fault Tolerance) governance is a consensus mechanism used for decentralized decision-making. In our platform, it allows token holders to vote on funding allocation for sustainable projects and platform upgrades."
    },
];

return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-900 via-emerald-900 to-teal-900 text-white">
    <header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 backdrop-blur-md bg-black bg-opacity-30 z-50">
        <a className="flex items-center justify-center" href="#">
        <Leaf className="h-6 w-6 text-green-400" />
        <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-600">
            EcoTrade
        </span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
        <a className="text-sm font-medium hover:text-green-400 transition-colors" href="#features">Features</a>
        <a className="text-sm font-medium hover:text-green-400 transition-colors" href="#stats">Stats</a>
        <a className="text-sm font-medium hover:text-green-400 transition-colors" href="#faq">FAQ</a>
        <a className="text-sm font-medium hover:text-green-400 transition-colors" href="#marketplace">Marketplace</a>
        </nav>
    </header>
    <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none animate-fade-in-up">
                Carbon Credit Marketplace
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl animate-fade-in-up animation-delay-200">
                Empowering communities through sustainable practices on Neo X. Join the green revolution today.
                </p>
            </div>
            <div className="w-full max-w-sm space-y-2 animate-fade-in-up animation-delay-400">
                <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 transition-all duration-300" size="lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
            </div>
        </div>
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-black/50 backdrop-blur-lg relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="space-y-4">
                <div className="inline-block rounded-lg bg-green-600 px-3 py-1 text-sm font-semibold">OUR MISSION</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Driving Sustainability Through Blockchain
                </h2>
                <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We're revolutionizing the carbon credit market by leveraging blockchain technology to create a transparent, efficient, and accessible platform for global sustainability efforts.
                </p>
            </div>
            <div className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden">
                <img
                src="/placeholder.svg"
                alt="Sustainable Future"
                className="h-full w-full object-cover rounded-xl"
                />
            </div>
            </div>
        </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-600">
            Key Features
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
                { icon: BarChart2, title: "Carbon Credit Marketplace", description: "Trade tokenized carbon credits with low fees" },
                { icon: Users, title: "dBFT Governance", description: "Decentralized decision-making for funding projects" },
                { icon: Shield, title: "Enhanced Security", description: "Protection for asset transfers" },
                { icon: Globe, title: "Reputation-Based System", description: "Earn tokens and voting power through contributions" },
            ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-white/5 backdrop-blur-lg transition-all duration-300 hover:bg-white/10 hover:scale-105">
                <div className="p-2 bg-gradient-to-br from-green-600 to-teal-600 rounded-full">
                    <feature.icon className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-center">{feature.title}</h3>
                <p className="text-sm text-center text-gray-400">{feature.description}</p>
                </div>
            ))}
            </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-emerald-900/20 to-teal-900/20" />
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-black/50 backdrop-blur-lg relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-600">
            Neo X & N3 Integration
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 p-6 bg-white/5 rounded-lg backdrop-blur-lg">
                <h3 className="text-2xl font-bold">Neo X Sidechain</h3>
                <p className="text-gray-300">
                Experience fast and secure trades with our dBFT consensus mechanism, ensuring quick finality and high throughput for all transactions.
                </p>
            </div>
            <div className="space-y-4 p-6 bg-white/5 rounded-lg backdrop-blur-lg">
                <h3 className="text-2xl font-bold">Neo N3 Bridge</h3>
                <p className="text-gray-300">
                Connect with other blockchains and ecosystems to expand the reach of carbon credits, making it easier for everyone to contribute to sustainability.
                </p>
            </div>
            </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-emerald-900/20 to-teal-900/20" />
        </section>

        <section id="stats" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-600">
            Marketplace Statistics
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-white/5 backdrop-blur-lg">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
            ))}
            </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-emerald-900/20 to-teal-900/20" />
        </section>

        {/* Marketplace Section */}
        <section>
        <h2 className="text-5xl font-semibold text-center mb-12">Explore the Marketplace</h2>
        <Marketplace />
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-black/50 backdrop-blur-lg relative overflow-hidden">
        <div className="container px-4 md:px-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-600">
            Frequently Asked Questions
            </h2>
            <div className="space-y-4">
            {faqs.map((faq, index) => (
                <div key={index} className="p-4 bg-white/5 rounded-lg backdrop-blur-lg">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                    <h3 className="text-xl font-semibold text-gray-200">{faq.question}</h3>
                    <ChevronDown className={`h-5 w-5 transition-transform ${activeFaq === index ? "rotate-180" : ""}`} />
                </div>
                {activeFaq === index && (
                    <p className="mt-2 text-gray-300">{faq.answer}</p>
                )}
                </div>
            ))}
            </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-emerald-900/20 to-teal-900/20" />
        </section>
    </main>

    <footer className="px-4 lg:px-6 py-4 flex items-center justify-center bg-black/80">
        <p className="text-sm text-gray-400">© 2024 EcoTrade. All rights reserved.</p>
    </footer>
    </div>
);
}
