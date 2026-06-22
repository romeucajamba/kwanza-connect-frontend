import { Link } from 'react-router-dom';
import {
  Hexagon,
  Globe,
  Share2,
  MessageCircle,
  Rss,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export const FooterPublic = () => {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        window.history.pushState({}, '', href);
      }
    }
  };

  return (
    <footer className="bg-surface border-t border-border-subtle pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Hexagon className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-text-primary tracking-tight">
                Kwanza<span className="text-primary font-black">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              A principal plataforma tecnológica em Angola para intercâmbio P2P e
              câmbio. Segura, rápida e confiável.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all"
              >
                <Rss className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              A Plataforma
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#sobre"
                  onClick={(e) => handleNavClick(e, '/#sobre')}
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Sobre Nós
                </a>
              </li>
              <li>
                <a
                  href="/#parceiros"
                  onClick={(e) => handleNavClick(e, '/#parceiros')}
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Parceiros e Ativos
                </a>
              </li>
              <li>
                <a
                  href="/#como-funciona"
                  onClick={(e) => handleNavClick(e, '/#como-funciona')}
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a
                  href="/#taxas"
                  onClick={(e) => handleNavClick(e, '/#taxas')}
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Taxas de Mercado
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Recursos
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/docs"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Documentação e Guia
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-text-secondary">
                  Edifício Cipher, Talatona
                  <br />
                  Luanda, Angola
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-text-secondary">
                  +244 900 000 000
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-text-secondary">
                  geral@kwanzaconnect.ao
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} KwanzaConnect. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
