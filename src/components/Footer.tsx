
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">AI Tool Finder</h3>
            <p className="text-gray-400">
              Discover the best AI tools, read reviews, and stay up-to-date with the latest trends in artificial intelligence.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-gray-400 hover:text-white transition-colors">
                  Tools
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p className="text-gray-400">
              Have questions or suggestions? We'd love to hear from you.
            </p>
            <a href="mailto:contact@aitoolfinder.com" className="text-blue-400 hover:underline mt-2 inline-block">
              contact@aitoolfinder.com
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          &copy; {new Date().getFullYear()} AI Tool Finder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
