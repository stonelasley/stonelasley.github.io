import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { siGithub, siInstagram, siWhatsapp, siProtonmail, siHevy } from 'simple-icons';
import SimpleIcon from './SimpleIcon';

/**
 * Navigation component - Minimal sidebar navigation
 * Fixed sidebar on desktop, fly-out menu on mobile
 */
const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Hello' },
    { path: '/blog', label: 'Blog' },
    { path: '/recipes', label: 'Recipes' },
  ];

  const socialLinks = [
    { url: 'https://github.com/stonelasley', label: 'GitHub', path: siGithub.path },
    { url: 'https://instagram.com/sclarklasley', label: 'Instagram', path: siInstagram.path },
    { url: 'https://wa.link/8f2cuh', label: 'WhatsApp', path: siWhatsapp.path },
    { url: 'mailto:website@lasley.io', label: 'Email', path: siProtonmail.path },
    { url: 'https://hevy.com/user/stonelasley', label: 'Hevy', path: siHevy.path }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-100 border-b border-gray-300 z-50 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-gray-900">
          Stone C. Lasley
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Fly-out Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Fly-out Panel */}
          <nav className="md:hidden fixed top-0 right-0 bottom-0 w-64 bg-white z-50 p-6 overflow-y-auto flex flex-col">
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-900 focus:outline-none"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block text-base ${isActive(item.path)
                      ? 'text-gray-900 underline'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Icons - Mobile */}
            <div className="mt-auto pt-8 border-t border-gray-200">
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    aria-label={social.label}
                  >
                    <SimpleIcon path={social.path} size={20} />
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed top-0 left-0 bottom-0 w-64 bg-gray-100 border-r border-gray-300 p-8 overflow-y-auto flex flex-col">
        <div className="mb-12">
          <Link to="/" className="block">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Stone C. Lasley</h1>
            <p className="text-sm text-gray-600">Building stuff with software for quite a while.</p>
          </Link>
        </div>

        <nav>
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block text-base ${isActive(item.path)
                    ? 'text-gray-900 underline'
                    : 'text-gray-900 hover:underline'
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social Icons - Desktop */}
        <div className="mt-auto pt-8 border-t border-gray-300">
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label={social.label}
              >
                <SimpleIcon path={social.path} size={20} />
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Spacer */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default Navigation;
