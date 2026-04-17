import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">

      <div className="grid md:grid-cols-4 gap-10 px-6 md:px-16">

        {/* Logo + About */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-4">
            FoodShare
          </h1>
          <p className="text-sm">
            Helping reduce food waste by connecting donors with NGOs and feeding those in need.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-orange-400">Home</Link></li>
            <li><Link to="/about" className="hover:text-orange-400">About</Link></li>
            <li><Link to="/dashboard" className="hover:text-orange-400">Dashboard</Link></li>
            <li><Link to="/contact" className="hover:text-orange-400">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>

          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} />
            <span>hritickumar3138@gmail.com</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} />
            <span>+91 98765 43210</span>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>

          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-400">
              <Facebook />
            </a>
            <a href="#" className="hover:text-orange-400">
              <Instagram />
            </a>
            <a href="#" className="hover:text-orange-400">
              <Twitter />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © 2026 FoodShare. All rights reserved.
      </div>

    </footer>
  );
}