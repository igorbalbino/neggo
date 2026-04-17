import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Package, Briefcase, Camera, MapPin, Check, Zap, Plus, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n/LanguageContext';
import { Location } from '../types';
import { api } from '../services/api';

export const CreateAd: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [locationMode, setLocationMode] = useState<'current' | 'multiple' | 'national'>('current');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  
  const [formData, setFormData] = useState({
    type: '' as 'product' | 'service' | '',
    title: '',
    description: '',
    price: '',
    category: '',
    isNational: false,
    locations: [] as Location[],
    condition: 'used',
    serviceType: 'remote',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const addLocation = () => {
    if (newCity && newState) {
      setFormData({
        ...formData,
        locations: [...formData.locations, { city: newCity, state: newState }]
      });
      setNewCity('');
      setNewState('');
    }
  };

  const removeLocation = (index: number) => {
    setFormData({
      ...formData,
      locations: formData.locations.filter((_, i) => i !== index)
    });
  };

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishError('');
    try {
      await api.createAd(formData);
      setStep(4);
    } catch (err: any) {
      setPublishError(err.message || 'Erro ao publicar anúncio. Tente novamente.');
      setIsPublishing(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-black text-gray-900">{t('what_announce')}</h2>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => { setFormData({ ...formData, type: 'product' }); nextStep(); }}
                className={cn(
                  "p-6 rounded-3xl border-2 flex items-center gap-4 transition-all active:scale-95",
                  formData.type === 'product' ? "border-blue-600 bg-blue-50" : "border-gray-100 bg-white"
                )}
              >
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Package size={32} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">{t('products')}</h3>
                  <p className="text-sm text-gray-500">{t('sell_something')}</p>
                </div>
              </button>
              
              <button 
                onClick={() => { setFormData({ ...formData, type: 'service' }); nextStep(); }}
                className={cn(
                  "p-6 rounded-3xl border-2 flex items-center gap-4 transition-all active:scale-95",
                  formData.type === 'service' ? "border-purple-600 bg-purple-50" : "border-gray-100 bg-white"
                )}
              >
                <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                  <Briefcase size={32} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">{t('services')}</h3>
                  <p className="text-sm text-gray-500">{t('offer_talent')}</p>
                </div>
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-black text-gray-900">{t('basic_details')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">{t('ad_title_label')}</label>
                <input 
                  type="text" 
                  placeholder="Ex: iPhone 13 Pro Max 256GB"
                  className="w-full bg-gray-100 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">{t('description')}</label>
                <textarea 
                  rows={4}
                  placeholder={t('description_placeholder')}
                  className="w-full bg-gray-100 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-blue-500"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 ml-1">{t('price_label')}</label>
                <input 
                  type="number" 
                  placeholder="0,00"
                  className="w-full bg-gray-100 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 focus:ring-blue-500"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-4 pt-2">
                <label className="block text-xs font-bold text-gray-400 uppercase ml-1">{t('where_deliver')}</label>
                <div className="grid grid-cols-1 gap-2">
                  <button 
                    onClick={() => {
                      setLocationMode('current');
                      setFormData({ ...formData, isNational: false, locations: [{ city: 'São Paulo', state: 'SP' }] });
                    }}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between",
                      locationMode === 'current' ? "border-blue-600 bg-blue-50" : "border-gray-100"
                    )}
                  >
                    <span className="font-bold text-sm">{t('current_city')} (São Paulo, SP)</span>
                    {locationMode === 'current' && <Check size={16} className="text-blue-600" />}
                  </button>
                  
                  <button 
                    onClick={() => {
                      setLocationMode('multiple');
                      setFormData({ ...formData, isNational: false });
                    }}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between",
                      locationMode === 'multiple' ? "border-blue-600 bg-blue-50" : "border-gray-100"
                    )}
                  >
                    <span className="font-bold text-sm">{t('multiple_cities')}</span>
                    {locationMode === 'multiple' && <Check size={16} className="text-blue-600" />}
                  </button>

                  <button 
                    onClick={() => {
                      setLocationMode('national');
                      setFormData({ ...formData, isNational: true, locations: [] });
                    }}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between",
                      locationMode === 'national' ? "border-blue-600 bg-blue-50" : "border-gray-100"
                    )}
                  >
                    <span className="font-bold text-sm">{t('serves_national')}</span>
                    {locationMode === 'national' && <Check size={16} className="text-blue-600" />}
                  </button>
                </div>

                {locationMode === 'multiple' && (
                  <div className="space-y-3 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Cidade"
                        className="flex-1 bg-white border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500"
                        value={newCity}
                        onChange={e => setNewCity(e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="UF"
                        className="w-20 bg-white border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500"
                        value={newState}
                        onChange={e => setNewState(e.target.value.toUpperCase())}
                        maxLength={2}
                      />
                      <button 
                        onClick={addLocation}
                        disabled={!newCity || !newState}
                        className="bg-blue-600 text-white p-3 rounded-xl disabled:opacity-50"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.locations.map((loc, index) => (
                        <div key={index} className="bg-white border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-gray-700">
                          {loc.city}, {loc.state}
                          <button onClick={() => removeLocation(index)} className="text-gray-400 hover:text-red-500">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={nextStep}
              disabled={!formData.title || !formData.price || (!formData.isNational && formData.locations.length === 0)}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform disabled:opacity-50"
            >
              {t('continue')}
            </button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-black text-gray-900">{t('photos_conditions')}</h2>
            
            <div className="grid grid-cols-3 gap-3">
              <button className="aspect-square bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 active:bg-gray-200 transition-colors">
                <Camera size={24} className="mb-1" />
                <span className="text-[10px] font-bold">Adicionar</span>
              </button>
              {[1, 2].map(i => (
                <div key={i} className="aspect-square bg-gray-200 rounded-2xl"></div>
              ))}
            </div>

            {formData.type === 'product' ? (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-gray-400 uppercase ml-1">{t('condition_label')}</label>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setFormData({ ...formData, condition: 'new' })}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all",
                      formData.condition === 'new' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 text-gray-400"
                    )}
                  >
                    {t('new')}
                  </button>
                  <button 
                    onClick={() => setFormData({ ...formData, condition: 'used' })}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all",
                      formData.condition === 'used' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-100 text-gray-400"
                    )}
                  >
                    {t('used')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-gray-400 uppercase ml-1">{t('service_type_label')}</label>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setFormData({ ...formData, serviceType: 'remote' })}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all",
                      formData.serviceType === 'remote' ? "border-purple-600 bg-purple-50 text-purple-600" : "border-gray-100 text-gray-400"
                    )}
                  >
                    {t('remote')}
                  </button>
                  <button 
                    onClick={() => setFormData({ ...formData, serviceType: 'in_person' })}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all",
                      formData.serviceType === 'in_person' ? "border-purple-600 bg-purple-50 text-purple-600" : "border-gray-100 text-gray-400"
                    )}
                  >
                    {t('in_person')}
                  </button>
                </div>
              </div>
            )}

            {publishError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 mb-4">
                {publishError}
              </div>
            )}

            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                t('publish_ad_btn')
              )}
            </button>
          </motion.div>
        );

      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 text-center py-10"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">{t('all_ready')}</h2>
              <p className="text-gray-500">{t('publish_success')}</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 p-6 rounded-3xl text-left">
              <div className="flex items-center gap-2 text-yellow-700 font-bold mb-2">
                <Zap size={20} fill="currentColor" />
                {t('sell_faster')}
              </div>
              <p className="text-sm text-yellow-800 mb-4 opacity-80">
                {t('boost_highlights')}
              </p>
              <button 
                onClick={() => navigate('/app/plans')}
                className="w-full bg-yellow-400 text-yellow-900 py-3 rounded-xl font-black text-sm active:scale-95 transition-transform"
              >
                {t('boost_now')}
              </button>
            </div>

            <button 
              onClick={() => navigate('/app')}
              className="w-full py-4 text-gray-400 font-bold text-sm"
            >
              {t('back_to_start')}
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="px-4 py-4 flex items-center justify-between border-b border-gray-50">
        {step > 1 && step < 4 ? (
          <button onClick={prevStep} className="p-1">
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-8"></div>
        )}
        <h1 className="font-bold text-gray-900">{t('publish')}</h1>
        <button onClick={() => navigate(-1)} className="text-sm font-bold text-gray-400">{t('cancel')}</button>
      </header>

      <div className="px-6 py-8">
        {renderStep()}
      </div>
    </div>
  );
};
