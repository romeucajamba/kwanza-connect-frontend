import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle2,
  Star,
  MessageCircle,
  ShieldCheck,
  PlusCircle,
  ArrowRightLeft,
  RefreshCcw,
  User as UserIcon
} from 'lucide-react';
import PublisherDetailsModal from './components/PublisherDetailsModal';
import { useOffers, useExpressInterest, useMyInterests } from '@/services/offers.hooks';
import { useAuthStore } from '@/store/authStore';
import { useAvailableLocations } from '@/services/auth.hooks';
import { getAvatarUrl } from '@/lib/media';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { APP_ROUTES } from '@/constants';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Offer } from '@/types';
import { TopLocationsChart } from '@/components/charts/TopLocationsChart';
import { TopPaymentMethodsChart } from '@/components/charts/TopPaymentMethodsChart';

const ReceberOfertaPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  // Estados para pesquisa e filtros
  const [searchInput, setSearchInput] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [municipalityFilter, setMunicipalityFilter] = useState('');
  const [orderFilter, setOrderFilter] = useState('-created_at');
  const [showFilters, setShowFilters] = useState(false);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});

  const { data: offers, isLoading } = useOffers(queryParams);
  const { mutate: expressInterest, isPending: isInteresting } = useExpressInterest();
  const { data: myInterests } = useMyInterests();
  const { data: availableLocations } = useAvailableLocations();
  const [pendingId, setPendingId] = useState<string | null>(null);

  // Estado para o modal do publicador
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params: Record<string, string> = {};
    if (searchInput.trim()) params.search = searchInput.trim();
    if (provinceFilter) params.province = provinceFilter;
    if (municipalityFilter) params.municipality = municipalityFilter;
    if (orderFilter) params.order = orderFilter;
    setQueryParams(params);
  };

  const handleInterest = (offerId: string) => {
    if (user?.verification_status !== 'approved') {
      toast.error('A sua conta precisa ser aprovada pelo administrador para fazer propostas.');
      return;
    }
    setPendingId(offerId);
    expressInterest(
      { offerId, payload: { message: 'Estou interessado nesta oferta.' } },
      { onSettled: () => setPendingId(null) }
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white text-xl md:text-2xl font-bold leading-tight tracking-tight uppercase">
            Explorar <span className="text-primary italic">P2P</span>
          </h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 text-[9px] uppercase tracking-widest opacity-80 leading-relaxed">
            Troque ativos diretamente com utilizadores verificados.
          </p>
        </div>
        <button
          onClick={() => {
            if (user?.verification_status !== 'approved') {
              toast.error('A sua conta precisa ser aprovada pelo administrador para publicar ofertas.');
              return;
            }
            navigate(APP_ROUTES.P2P_POST);
          }}
          className="flex items-center justify-center gap-2 bg-primary text-white font-bold uppercase text-[10px] tracking-widest px-6 h-10 rounded-lg hover:bg-primary/95 transition-all shadow-md shadow-primary/20"
        >
          <PlusCircle className="size-3.5" />
          <span>Criar Oferta</span>
        </button>
      </div>

      {/* Gráficos de Inteligência de Mercado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
        <TopLocationsChart />
        <TopPaymentMethodsChart />
      </div>

      {/* Filtros e Pesquisa */}
      <div className="bg-white dark:bg-[#192633] p-4 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm flex flex-col gap-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center gap-4 w-full"
        >
          <div className="flex-1 relative group w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-300 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Pesquisar por moedas, valores ou nome do utilizador..."
              className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-lg pl-10 pr-4 py-2 text-[11px] font-medium focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-300"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-6 bg-primary text-white font-bold uppercase text-[9px] tracking-widest rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
            >
              {isLoading ? <RefreshCcw className="size-3 animate-spin" /> : <Search className="size-3.5" />}
              <span>Pesquisar</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center size-9 rounded-lg transition-colors border ${showFilters ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-transparent hover:text-primary'}`}
            >
              <Filter className="size-3.5" />
            </button>
          </div>
        </form>

        {/* Painel de Filtros Avançados */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ordenar por</label>
                  <select
                    value={orderFilter}
                    onChange={(e) => { setOrderFilter(e.target.value); setTimeout(() => handleSearch(), 0); }}
                    className="w-full bg-slate-50 dark:bg-[#111922] border border-slate-100 dark:border-white/5 rounded-lg px-3 py-2 text-[11px] font-medium focus:ring-2 focus:ring-primary/10 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="-created_at" className="bg-white dark:bg-[#192633] text-slate-900 dark:text-white">Mais Recentes</option>
                    <option value="created_at" className="bg-white dark:bg-[#192633] text-slate-900 dark:text-white">Mais Antigas</option>
                    <option value="-give_amount" className="bg-white dark:bg-[#192633] text-slate-900 dark:text-white">Maior Valor</option>
                    <option value="give_amount" className="bg-white dark:bg-[#192633] text-slate-900 dark:text-white">Menor Valor</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Província</label>
                  <select
                    value={provinceFilter}
                    onChange={(e) => {
                      setProvinceFilter(e.target.value);
                      setMunicipalityFilter('');
                      setTimeout(() => handleSearch(), 0);
                    }}
                    className="w-full bg-slate-50 dark:bg-[#111922] border border-slate-100 dark:border-white/5 rounded-lg px-3 py-2 text-[11px] font-medium focus:ring-2 focus:ring-primary/10 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="" className="bg-white dark:bg-[#192633] text-slate-900 dark:text-white">Todas</option>
                    {availableLocations?.map((loc: any) => (
                      <option key={loc.name} value={loc.name} className="bg-white dark:bg-[#192633] text-slate-900 dark:text-white">{loc.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Município</label>
                  <select
                    value={municipalityFilter}
                    onChange={(e) => {
                      setMunicipalityFilter(e.target.value);
                      setTimeout(() => handleSearch(), 0);
                    }}
                    disabled={!provinceFilter}
                    className="w-full bg-slate-50 dark:bg-[#111922] border border-slate-100 dark:border-white/5 rounded-lg px-3 py-2 text-[11px] font-medium focus:ring-2 focus:ring-primary/10 text-slate-900 dark:text-white outline-none disabled:opacity-50"
                  >
                    <option value="" className="bg-white dark:bg-[#192633] text-slate-900 dark:text-white">Todos</option>
                    {availableLocations?.find((p: any) => p.name === provinceFilter)?.municipalities.map((mun: string) => (
                      <option key={mun} value={mun} className="bg-white dark:bg-[#192633] text-slate-900 dark:text-white">{mun}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleSearch()}
                    className="w-full h-[34px] bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors font-bold uppercase text-[9px] tracking-widest rounded-lg flex items-center justify-center gap-2"
                  >
                    <Search className="size-3.5" /> Aplicar Filtros
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid de Ofertas */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {(offers as Offer[])?.map((offer) => {
              const isOwner = offer.owner?.id === user?.id;
              const isLoadingThis = pendingId === offer.id && isInteresting;
              const hasInterest = myInterests?.some((interest: any) => interest.offer?.id === offer.id);
              const rate = offer.give_amount > 0 ? (Number(offer.want_amount) / Number(offer.give_amount)).toFixed(4) : '—';

              return (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white dark:bg-[#192633] rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/20 dark:bg-white/5">
                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className="flex items-center gap-2.5 text-left group/profile hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="size-8 rounded-lg border-2 border-slate-50 dark:border-[#111922] group-hover/profile:border-primary/20 transition-all shadow-sm overflow-hidden bg-white dark:bg-[#111922]">
                        <AvatarImage src={getAvatarUrl(offer.owner?.avatar, offer.owner?.full_name)} />
                        <AvatarFallback className="rounded-lg">
                          <UserIcon className="size-4 text-slate-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase truncate max-w-[80px] leading-none group-hover/profile:text-primary transition-colors">
                            {offer.owner?.full_name || offer.owner?.email?.split('@')[0] || 'Utilizador'}
                          </p>
                          {(offer.owner?.verification_status === 'approved' || offer.owner?.is_verified) && (
                            <CheckCircle2 className="size-2.5 text-emerald-500" />
                          )}
                        </div>
                      </div>
                    </button>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${offer.offer_type === 'sell' ? 'bg-primary/5 text-primary' : 'bg-emerald-500/5 text-emerald-500'}`}>
                      {offer.offer_type === 'sell' ? 'Vende' : 'Compra'}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4 flex-1 flex flex-col">
                    <div className="p-4 bg-slate-50 dark:bg-[#111922] rounded-lg border border-slate-100/50 dark:border-white/5 relative overflow-hidden group-hover:bg-primary/5 transition-colors">
                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">Dá</span>
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                            {Number(offer.give_amount).toLocaleString('pt-AO')}{' '}
                            <span className="text-[9px] opacity-40 ml-0.5">{offer.give_currency?.code}</span>
                          </p>
                        </div>
                        <ArrowRightLeft className="size-3 text-primary opacity-30 mx-2" />
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 opacity-60">Recebe</span>
                          <p className="text-sm font-bold text-primary leading-none">
                            {Number(offer.want_amount).toLocaleString('pt-AO')}{' '}
                            <span className="text-[9px] opacity-70 ml-0.5">{offer.want_currency?.code}</span>
                          </p>
                        </div>
                      </div>
                      <div className="h-px w-full bg-slate-200/50 dark:bg-white/5 my-3" />
                      <div className="flex justify-between items-center text-[8px] font-bold uppercase tracking-widest opacity-60">
                        <p className="text-slate-400">Taxa Câmbio</p>
                        <p className="text-slate-900 dark:text-white">
                          1 {offer.give_currency?.code} = {rate}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {(offer.owner?.verification_status === 'approved' || offer.owner?.is_verified) && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-100 dark:border-white/5 text-[7px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/5">
                          <ShieldCheck className="size-2.5" /> KYC Verificado
                        </span>
                      )}
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-100 dark:border-white/5 text-[7px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-white/5">
                        <Star className="size-2.5 fill-amber-400 text-amber-400" /> {(offer.owner?.average_rating ?? 0) > 0 ? offer.owner?.average_rating : 'Novo'}
                      </span>
                    </div>

                    <div className="mt-auto pt-4 flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedOffer(offer)}
                        className="w-full h-8 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-lg font-bold uppercase text-[8px] tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
                      >
                        <UserIcon className="size-3" /> Ver Detalhes do {offer.offer_type === 'sell' ? 'Vendedor' : 'Comprador'}
                      </button>

                      <div className="flex gap-2">
                        <button
                          disabled={isOwner || isLoadingThis || hasInterest}
                          onClick={() => handleInterest(offer.id)}
                          className="flex-1 h-9 bg-primary text-white rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-md shadow-primary/10 hover:bg-primary/95 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          {isLoadingThis ? (
                            <RefreshCcw className="size-3 animate-spin" />
                          ) : hasInterest ? (
                            'Interesse Enviado'
                          ) : (
                            'Manifestar Interesse'
                          )}
                        </button>
                        <button
                          disabled={isOwner || isLoadingThis || hasInterest}
                          onClick={() => handleInterest(offer.id)}
                          className="h-9 w-9 bg-slate-50 dark:bg-[#111922] text-slate-300 hover:text-primary rounded-lg flex items-center justify-center transition-all border border-slate-100 dark:border-white/5 hover:border-primary/10 disabled:opacity-30"
                        >
                          <MessageCircle className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {(!offers || (offers as Offer[]).length === 0) && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
              <div className="size-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-300 mb-5 border border-dashed border-slate-200/50 dark:border-white/10">
                <Search className="size-6 opacity-30" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Nenhuma oferta</h3>
              <p className="text-[9px] text-slate-400 font-medium mt-1 leading-relaxed opacity-60">
                Tente ajustar os filtros ou pesquisar outra moeda.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal de Detalhes do Publicador */}
      <PublisherDetailsModal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        publisher={selectedOffer?.owner || null}
        offer={selectedOffer}
      />
    </div>
  );
};

export default ReceberOfertaPage;
