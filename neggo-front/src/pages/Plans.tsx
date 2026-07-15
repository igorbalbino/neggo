import React, { useState, useEffect } from 'react';
import { ChevronLeft, Zap, Check, Shield, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from '../i18n/LanguageContext';
import { cn } from '../lib/utils';
import { api } from '../services/api';
import { Plan } from '../types';
import { SEO } from '../components/SEO';
import { redirectToStripeCheckout } from '../lib/stripeCheckout';

export const Plans: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.getPlans();
        setPlans(data);
      } catch (err) {
        console.error('Failed to fetch plans', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const { t, language } = useTranslation();

  const handleBuyPlan = async (planId: string) => {
    setPurchaseLoading(planId);
    try {
      const result = await api.buyPlan(planId);
      
      if (redirectToStripeCheckout(result.checkoutUrl)) {
        return;
      }

      // Refresh plans to show current
      const data = await api.getPlans();
      setPlans(data);
      alert(t('plan_success'));
    } catch (err: any) {
      alert(err.message || t('plan_error'));
    } finally {
      setPurchaseLoading(null);
    }
  };

  const planTiers = [
    { 
      id: 'free', 
      name: t('plan_name_free'), 
      price: 0,
      currency: language === 'pt-BR' ? 'R$' : 'US$',
      adLimit: 1,
      benefits: ['1 Anúncio simultâneo', 'Sem destaques', 'Suporte comunitário']
    },
    { 
      id: 'essential', 
      name: t('plan_name_essencial'), 
      price: language === 'pt-BR' ? 29.90 : 5.99,
      currency: language === 'pt-BR' ? 'R$' : 'US$',
      adLimit: 5,
      benefits: ['5 Anúncios simultâneos', 'Destaque básico', 'Suporte via chat']
    },
    { 
      id: 'professional', 
      name: t('plan_name_profissional'), 
      price: language === 'pt-BR' ? 59.90 : 36.99,
      currency: language === 'pt-BR' ? 'R$' : 'US$',
      adLimit: 25,
      popular: true,
      benefits: ['25 Anúncios simultâneos', 'Destaque prioritário', 'Selo Profissional', 'Painel de estatísticas']
    },
    { 
      id: 'enterprise', 
      name: t('plan_name_empresarial'), 
      price: language === 'pt-BR' ? 89.90 : 58.99,
      currency: language === 'pt-BR' ? 'R$' : 'US$',
      adLimit: 100,
      benefits: ['Anúncios ilimitados', 'Destaque máximo', 'Gerente de conta', 'API de integração']
    }
  ];

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      <SEO 
        title={t('plans_title')}
      />
      <header className="px-4 py-4 flex items-center gap-3 bg-white border-b border-gray-50 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-gray-900">{t('plans_title')}</h1>
      </header>

      <div className="px-6 py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">{t('evolve_business')}</h2>
          <p className="text-gray-500 text-sm">{t('choose_ideal_plan')}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : (
          <div className="space-y-6">
            {planTiers.map((tier, i) => {
              const plan = plans.find(p => p.id === tier.id) || { ...tier, isCurrent: false };
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "relative bg-white p-8 rounded-[40px] shadow-sm border-2 transition-all",
                    tier.popular ? "border-blue-600 ring-4 ring-blue-50" : "border-transparent",
                    plan.isCurrent && "opacity-80"
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {t('most_popular')}
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{tier.name}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{t('up_to')} {tier.adLimit} {t('my_ads')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-400">{tier.currency}</span>
                      <span className="text-3xl font-black text-gray-900">{tier.price.toString().split('.')[0]}</span>
                      <span className="text-sm font-bold text-gray-400">,{tier.price.toFixed(2).split('.')[1] || '00'}</span>
                      <p className="text-[10px] font-bold text-gray-400">/{t('per_month')}</p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center",
                          tier.popular ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                        )}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <button 
                    disabled={plan.isCurrent || purchaseLoading === tier.id}
                    onClick={() => handleBuyPlan(tier.id)}
                    className={cn(
                      "w-full py-4 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-2",
                      plan.isCurrent 
                        ? "bg-gray-100 text-gray-400 cursor-default" 
                        : (tier.popular ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-gray-900 text-white")
                    )}
                  >
                    {purchaseLoading === tier.id ? <Loader2 className="animate-spin" size={20} /> : (plan.isCurrent ? t('plan_current') : t('plan_subscribe'))}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-12 bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{t('safe_payment')}</h4>
            <p className="text-xs text-gray-500">{t('data_protected')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
