import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { docsData } from '@/constants/docsData';
import { Menu, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderPublic } from '@/components/public/HeaderPublic';
import { PageTransition } from '@/components/ui/PageTransition';

export const DocsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fallback to first doc if no slug or invalid slug
  const activeDoc = docsData.find((d) => d.slug === slug) || docsData[0];

  useEffect(() => {
    if (!slug) {
      navigate(`/docs/${docsData[0].slug}`, { replace: true });
    }
  }, [slug, navigate]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-text-primary font-sans">
        <HeaderPublic />
      <div className="container mx-auto px-4 md:px-6 pt-28 pb-16">
        <div className="flex flex-col lg:flex-row h-full min-h-[80vh] gap-8">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden flex items-center gap-2 mb-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 p-2 rounded-lg border border-border-subtle bg-surface-elevated text-text-primary w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Menu className="w-5 h-5" />
            <span className="font-semibold text-sm">
              Tópicos da Documentação
            </span>
          </div>
          <ChevronRight
            className={cn(
              'w-4 h-4 transition-transform',
              mobileMenuOpen ? 'rotate-90' : ''
            )}
          />
        </button>
      </div>

      {/* Sidebar Desktop + Mobile Menu content */}
      <aside
        className={cn(
          'lg:w-[280px] shrink-0 border-r border-border-subtle pr-4 lg:block h-fit sticky top-6',
          mobileMenuOpen ? 'block mb-8 border-b border-r-0 pb-6' : 'hidden'
        )}
      >
        <div className="mb-6 hidden lg:block">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Guia de Utilizador
          </h3>
        </div>

        <nav className="flex flex-col gap-1.5">
          {docsData.map((doc) => {
            const isActive = activeDoc.slug === doc.slug;
            return (
              <Link
                key={doc.slug}
                to={`/docs/${doc.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative',
                  isActive
                    ? 'bg-surface-elevated text-text-primary font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-primary before:rounded-r-full shadow-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated/50 font-medium'
                )}
              >
                <doc.icon
                  className={cn(
                    'w-4 h-4',
                    isActive
                      ? 'text-primary drop-shadow-[0_0_8px_rgba(253,185,19,0.5)]'
                      : 'text-text-secondary'
                  )}
                />
                {doc.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Content Area */}
      <section className="flex-1 max-w-4xl lg:pl-8 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDoc.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-6 font-mono">
              <span className="text-text-secondary">Documentação</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary">{activeDoc.title}</span>
            </div>

            {activeDoc.content}
          </motion.div>
        </AnimatePresence>
      </section>
        </div>
      </div>
      </div>
    </PageTransition>
  );
};
