import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-900 pt-16 pb-8">
      <Container>
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              {/* Logo placeholder if image fails, text fallback */}
              <span className="text-2xl font-bold text-white tracking-tight">Combine <span className="text-orange-500">Foundation</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Empowering communities through dedicated volunteer action, sustainable development initiatives, and youth leadership programs across Pakistan.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a key={social} href={`#${social}`} className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all text-gray-400">
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" /></svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/volunteer/apply" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">Become a Volunteer</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span>foundationcombine@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <span>+92-319-3372277</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Karachi, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Combine Foundation. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;