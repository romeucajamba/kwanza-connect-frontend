import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowLeftRight, LogIn, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const HeaderPublic = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Sobre', href: '/#sobre' },
    { name: 'Parceiros', href: '/#parceiros' },
    { name: 'Contacto', href: '/#contacto' },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        // Calculate offset to account for fixed header
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        window.history.pushState({}, '', href);
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/80 backdrop-blur-lg border-b border-border-subtle py-3 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-surface-elevated border border-border-subtle group-hover:border-primary transition-colors overflow-hidden">
              <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <ArrowLeftRight className="w-5 h-5 text-primary relative z-10" />
            </div>
            <span className="font-bold text-lg text-text-primary tracking-tight">
              Kwanza<span className="text-primary font-black">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300">
              {/* blue background */}
              <span className="absolute inset-0 rounded-xl bg-blue-600 group-hover:bg-blue-500 transition-colors duration-300" />
              {/* glow */}
              <span className="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_35px_rgba(37,99,235,0.65)] transition-all duration-300" />
              {/* content */}
              <span className="relative z-10 text-white tracking-wide">Aceder Plataforma</span>
              <ArrowRight className="w-4 h-4 text-white relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-primary p-2"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-border-subtle shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                handleNavClick(e, link.href);
                if (!link.href.startsWith('/#')) {
                  setMobileMenuOpen(false);
                }
              }}
              className="text-base font-medium text-text-secondary hover:text-primary px-4 py-2 cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <div className="px-4 pt-2 border-t border-border-subtle">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="group relative w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 rounded-xl bg-blue-600 group-hover:bg-blue-500 transition-colors duration-300" />
              <span className="absolute inset-0 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.35)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300" />
              <span className="relative z-10 text-white tracking-wide">Aceder Plataforma</span>
              <ArrowRight className="w-4 h-4 text-white relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
