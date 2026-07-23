import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Star, MapPin, Phone, Mail, ShieldCheck,
  MessageSquare, Calendar, User, ShieldAlert,
  Navigation, ExternalLink
} from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewer_name: string;
  created_at: string;
}

interface PublisherDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  publisher: any; // The owner object from the offer
  offer?: any; // The explicit offer possessing latitude and longitude
}

const PublisherDetailsModal: React.FC<PublisherDetailsModalProps> = ({ isOpen, onClose, publisher, offer }) => {
  const [gpsLocation, setGpsLocation] = React.useState<string | null>(null);
  const [isFetchingGps, setIsFetchingGps] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    if (isOpen && offer?.latitude && offer?.longitude) {
      setIsFetchingGps(true);
      setGpsLocation(null);
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${offer.latitude}&lon=${offer.longitude}&format=json`)
        .then(res => res.json())
        .then(data => {
          if (!active) return;
          const address = data?.address || {};
          const cityName = address.city || address.town || address.village || address.county || address.state || (data?.display_name ? data.display_name.split(',')[0] : null);
          setGpsLocation(cityName || 'Localização obtida');
        })
        .catch(err => {
          console.error("Geocoding failed", err);
        })
        .finally(() => {
          if (active) setIsFetchingGps(false);
        });
    } else {
      setGpsLocation(null);
    }
    return () => { active = false; };
  }, [isOpen, offer?.latitude, offer?.longitude]);

  if (!publisher) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-white dark:bg-[#0b1117] rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto relative"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="size-4 text-primary" /> Detalhes do Publicador
                </h2>
                <button
                  onClick={onClose}
                  className="size-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Content (Scrollable) */}
              <div className="p-6 overflow-y-auto custom-scrollbar">

                {/* Profile Info */}
                <div className="flex items-start gap-4 mb-8">
                  {publisher.avatar ? (
                    <img
                      src={publisher.avatar}
                      alt={publisher.full_name}
                      className="size-20 rounded-2xl object-cover border-2 border-white dark:border-[#0b1117] shadow-lg shadow-black/5"
                    />
                  ) : (
                    <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-3xl border-2 border-white dark:border-[#0b1117] shadow-lg shadow-black/5">
                      {publisher.full_name ? publisher.full_name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      {publisher.full_name || 'Utilizador KwanzaConnect'}
                    </h3>
                    {publisher.username && (
                      <p className="text-sm font-medium text-primary mt-1">@{publisher.username}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {publisher.verification_status === 'approved' || publisher.is_verified ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-emerald-500/20 text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10">
                          <ShieldCheck className="size-3" /> Conta Verificada
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-500/20 text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-500/10">
                          <ShieldAlert className="size-3" /> Não Verificado
                        </span>
                      )}
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10">
                        <Star className="size-3 fill-amber-500" />
                        {(publisher.average_rating ?? 0) > 0 ? publisher.average_rating : 'Novo'}
                        ({(publisher as any).reviews_count || publisher.total_reviews || 0})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact & Location Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Phone className="size-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Telemóvel</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {publisher.phone ? `+${publisher.country_code || '244'} ${publisher.phone}` : 'Não disponível'}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5 overflow-hidden">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Mail className="size-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">E-mail</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {publisher.email || 'Não disponível'}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5 sm:col-span-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <MapPin className="size-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Localização Declarada</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {[publisher.neighborhood, publisher.municipality, publisher.province, publisher.city].filter(Boolean).join(', ') || 'Localização não especificada'}
                    </p>
                  </div>

                  {/* Offer Exact Location from GPS */}
                  {offer?.latitude && offer?.longitude && (
                    <div className="bg-emerald-500/5 dark:bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20 sm:col-span-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Navigation className="size-16 text-emerald-500" />
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1 relative z-10">
                        <Navigation className="size-3.5 fill-current" />
                        <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                          Localização da Oferta (GPS)
                          <ShieldCheck className="size-3" />
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 mt-2 relative z-10">
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                          {isFetchingGps ? (
                            <span className="flex items-center gap-1.5 opacity-80">
                              <span className="size-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                              A obter localização...
                            </span>
                          ) : gpsLocation ? (
                            gpsLocation
                          ) : (
                            'Coordenadas verificadas'
                          )}
                        </p>
                        <a
                          href={`https://maps.google.com/?q=${offer.latitude},${offer.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
                        >
                          Abrir Mapa <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {publisher.bio && (
                  <div className="mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-100 dark:border-white/5 pb-2">
                      Sobre o Utilizador
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 italic">
                      "{publisher.bio}"
                    </p>
                  </div>
                )}

                {/* Recent Reviews */}
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 dark:border-white/5 pb-2 flex items-center justify-between">
                    <span>Avaliações Recentes</span>
                    <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-full">{publisher.reviews_count || 0} Total</span>
                  </h4>

                  {(!publisher.recent_reviews || publisher.recent_reviews.length === 0) ? (
                    <div className="text-center py-8 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                      <MessageSquare className="size-8 mx-auto text-slate-300 mb-3 opacity-50" />
                      <p className="text-xs text-slate-500 font-medium">Nenhuma avaliação registada ainda.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {publisher.recent_reviews.map((review: Review) => (
                        <div key={review.id} className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="block text-xs font-bold text-slate-900 dark:text-white">
                                {review.reviewer_name}
                              </span>
                              <span className="flex items-center gap-1 text-[9px] text-slate-400 mt-0.5">
                                <Calendar className="size-2.5" />
                                {new Date(review.created_at).toLocaleDateString('pt-AO', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`size-3 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-white/10'}`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                              "{review.comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PublisherDetailsModal;
