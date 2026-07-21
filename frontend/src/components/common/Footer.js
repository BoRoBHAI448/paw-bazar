import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Brand Info */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                            <span>Pawbazar</span>
                            <span>🐾</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Your trusted store for healthy, tasty, and premium cat food. Pure care for your furry friends.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/products" className="hover:text-teal-400 transition-colors">Dry Food</Link></li>
                            <li><Link href="/products" className="hover:text-teal-400 transition-colors">Wet Food</Link></li>
                            <li><Link href="/products" className="hover:text-teal-400 transition-colors">Cat Treats</Link></li>
                            <li><Link href="/products" className="hover:text-teal-400 transition-colors">Kitten Special</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Customer Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:text-teal-400 transition-colors">Order Tracking</Link></li>
                            <li><Link href="#" className="hover:text-teal-400 transition-colors">Shipping Policy</Link></li>
                            <li><Link href="#" className="hover:text-teal-400 transition-colors">Returns & Refunds</Link></li>
                            <li><Link href="#" className="hover:text-teal-400 transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contact Us</h3>
                        <p className="text-sm text-slate-400 mb-2">Email: support@pawbazar.com</p>
                        <p className="text-sm text-slate-400 mb-2">Phone: +880 1700-000000</p>
                        <p className="text-sm text-slate-400">Dhaka, Bangladesh</p>
                    </div>

                </div>

                <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Pawbazar. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}