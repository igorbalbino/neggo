import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut, MessageSquare, Phone, User as UserIcon, Check, Loader2, KeyRound, Copy, X } from 'lucide-react';
import { useTranslation, Language } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { api } from '../services/api';

type ScopeOption = { id: string; label: string; description: string };
type TokenRow = {
  id: string;
  name: string;
  tokenPrefix: string;
  scopes: string[];
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string | null;
};

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();
  const { user, logout, updateUser } = useAuth();
  
  const [contactMode, setContactMode] = useState<'chat' | 'both'>(user?.preferences?.contactMode || 'chat');
  const [showPhoto, setShowPhoto] = useState(user?.preferences?.showPhoto ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [scopes, setScopes] = useState<ScopeOption[]>([]);
  const [tokensLoading, setTokensLoading] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [plainToken, setPlainToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadIntegrations = async () => {
    setTokensLoading(true);
    try {
      const [scopesData, tokensData] = await Promise.all([
        api.getIntegrationScopes(),
        api.getIntegrationTokens(),
      ]);
      setScopes(scopesData);
      setTokens(tokensData);
    } catch (err) {
      console.error(err);
    } finally {
      setTokensLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleSave = async (updates: any) => {
    setIsSaving(true);
    try {
      const updatedUser = await api.updateProfile({ 
        preferences: { 
          ...user?.preferences, 
          ...updates 
        } 
      });
      updateUser(updatedUser);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleScope = (id: string) => {
    setSelectedScopes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const openGenerate = () => {
    setTokenName('');
    setSelectedScopes([]);
    setPlainToken(null);
    setFormError(null);
    setCopied(false);
    setShowGenerate(true);
  };

  const handleGenerate = async () => {
    setFormError(null);
    if (!tokenName.trim()) {
      setFormError(t('integrations_token_name'));
      return;
    }
    if (selectedScopes.length === 0) {
      setFormError(t('integrations_select_one'));
      return;
    }
    setGenerating(true);
    try {
      const result = await api.createIntegrationToken({
        name: tokenName.trim(),
        scopes: selectedScopes,
      });
      setPlainToken(result.token);
      await loadIntegrations();
    } catch (err: any) {
      setFormError(err.message || 'Error');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!plainToken) return;
    try {
      await navigator.clipboard.writeText(plainToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await api.revokeIntegrationToken(id);
      setTokens((prev) => prev.filter((tok) => tok.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      <header className="px-4 py-4 md:px-8 flex items-center gap-3 bg-white border-b border-gray-50 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-gray-900">{t('settings_title')}</h1>
      </header>

      <div className="px-6 py-8 md:px-12 space-y-8">
        {/* Language Switcher */}
        <section>
          <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest pl-1">
            {t('app_language')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'pt-BR', label: t('lang_pt') },
              { id: 'es', label: t('lang_es') },
              { id: 'en', label: t('lang_en') },
              { id: 'py', label: t('lang_py') },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id as Language)}
                className={cn(
                  "flex items-center justify-center p-4 rounded-2xl border-2 font-bold text-sm transition-all",
                  language === lang.id ? "border-blue-600 bg-blue-50 text-blue-700" : "bg-white border-transparent text-gray-500"
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </section>

        {/* Contact Preferences */}
        <section>
          <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest pl-1">
            {t('contact_me')}
          </label>
          <div className="space-y-3">
            <button 
              onClick={() => { setContactMode('chat'); handleSave({ contactMode: 'chat' }); }}
              className={cn(
                "w-full flex items-center justify-between p-5 rounded-3xl transition-all border-2",
                contactMode === 'chat' ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-transparent text-gray-700"
              )}
            >
              <div className="flex items-center gap-4">
                <MessageSquare size={22} />
                <span className="font-bold">{t('contact_chat')}</span>
              </div>
              {contactMode === 'chat' && <Check size={20} />}
            </button>

            <button 
              onClick={() => { setContactMode('both'); handleSave({ contactMode: 'both' }); }}
              className={cn(
                "w-full flex items-center justify-between p-5 rounded-3xl transition-all border-2",
                contactMode === 'both' ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-transparent text-gray-700"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <MessageSquare size={18} />
                  <Phone size={18} />
                </div>
                <span className="font-bold">{t('contact_phone')}</span>
              </div>
              {contactMode === 'both' && <Check size={20} />}
            </button>
          </div>
        </section>

        {/* Privacy */}
        <section>
          <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest pl-1">
            Privacidade
          </label>
          <div className="bg-white rounded-[32px] p-2 shadow-sm">
            <button 
              onClick={() => { setShowPhoto(!showPhoto); handleSave({ showPhoto: !showPhoto }); }}
              className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <UserIcon size={22} className="text-gray-400" />
                <span className="font-bold text-gray-700">{t('show_photo')}</span>
              </div>
              <div className={cn(
                "w-12 h-6 rounded-full relative transition-colors",
                showPhoto ? "bg-blue-600" : "bg-gray-200"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  showPhoto ? "right-1" : "left-1"
                )} />
              </div>
            </button>
          </div>
        </section>

        {/* Integrations */}
        <section>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest pl-1">
            {t('integrations_title')}
          </label>
          <p className="text-sm text-gray-500 mb-4 pl-1">{t('integrations_desc')}</p>

          <button
            onClick={openGenerate}
            className="w-full mb-4 flex items-center justify-center gap-2 p-4 rounded-2xl bg-blue-600 text-white font-bold active:scale-[0.98] transition-transform"
          >
            <KeyRound size={18} />
            {t('integrations_generate')}
          </button>

          <div className="space-y-3">
            {tokensLoading && (
              <div className="flex justify-center py-6 text-gray-400">
                <Loader2 className="animate-spin" size={20} />
              </div>
            )}
            {!tokensLoading && tokens.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">{t('integrations_empty')}</p>
            )}
            {tokens.map((tok) => (
              <div key={tok.id} className="bg-white rounded-3xl p-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">{tok.name}</p>
                  <p className="text-xs font-mono text-gray-400 mt-1">{tok.tokenPrefix}…</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {t('integrations_expiry')}
                    {tok.expiresAt ? ` · ${new Date(tok.expiresAt).toLocaleDateString(language)}` : ''}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 break-all">
                    {tok.scopes.join(', ')}
                  </p>
                </div>
                <button
                  onClick={() => handleRevoke(tok.id)}
                  className="shrink-0 text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl"
                >
                  {t('integrations_revoke')}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Account */}
        <section>
          <label className="block text-xs font-black text-gray-400 uppercase mb-4 tracking-widest pl-1">
            Conta
          </label>
          <div className="bg-white rounded-[32px] p-2 shadow-sm">
            <button 
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center justify-between p-5 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-4">
                <LogOut size={22} />
                <span>{t('logout_btn')}</span>
              </div>
            </button>
          </div>
        </section>

        <div className="text-center pt-8">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Neggo v1.0.4</p>
          <p className="text-[10px] font-bold text-gray-400 mt-1">© Creatio Inc. 2026</p>
        </div>
      </div>

      {isSaving && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl z-50">
          <Loader2 size={14} className="animate-spin" />
          Salvando...
        </div>
      )}

      {/* Generate token modal */}
      {showGenerate && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-white w-full md:max-w-lg md:rounded-[32px] rounded-t-[32px] max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg text-gray-900">{t('integrations_generate')}</h2>
              <button onClick={() => setShowGenerate(false)} className="p-2 text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {plainToken ? (
              <div className="space-y-4">
                <p className="text-sm text-amber-700 bg-amber-50 rounded-2xl p-4 font-medium">
                  {t('integrations_created')}
                </p>
                <div className="bg-gray-50 rounded-2xl p-4 font-mono text-xs break-all text-gray-800">
                  {plainToken}
                </div>
                <button
                  onClick={handleCopy}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-blue-600 text-white font-bold"
                >
                  <Copy size={16} />
                  {copied ? t('integrations_copied') : t('integrations_copy')}
                </button>
                <button
                  onClick={() => setShowGenerate(false)}
                  className="w-full p-4 rounded-2xl font-bold text-gray-600 bg-gray-100"
                >
                  {t('integrations_close')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">
                    {t('integrations_token_name')}
                  </label>
                  <input
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="Agente Cursor"
                    className="w-full p-4 rounded-2xl border border-gray-200 font-medium outline-none focus:border-blue-500"
                  />
                </div>

                <p className="text-sm font-bold text-blue-700 bg-blue-50 rounded-2xl px-4 py-3">
                  {t('integrations_expiry')}
                </p>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">
                    {t('integrations_permissions')}
                  </label>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {scopes.map((scope) => {
                      const checked = selectedScopes.includes(scope.id);
                      return (
                        <button
                          key={scope.id}
                          type="button"
                          onClick={() => toggleScope(scope.id)}
                          className={cn(
                            "w-full text-left p-4 rounded-2xl border-2 transition-all",
                            checked ? "border-blue-600 bg-blue-50" : "border-transparent bg-gray-50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-bold text-sm text-gray-900">{scope.label}</p>
                              <p className="text-xs text-gray-500 mt-1">{scope.description}</p>
                              <p className="text-[10px] font-mono text-gray-400 mt-1">{scope.id}</p>
                            </div>
                            {checked && <Check size={18} className="text-blue-600 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {formError && (
                  <p className="text-sm font-bold text-red-500">{formError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowGenerate(false)}
                    className="flex-1 p-4 rounded-2xl font-bold text-gray-600 bg-gray-100"
                  >
                    {t('integrations_cancel')}
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="flex-1 p-4 rounded-2xl font-bold bg-blue-600 text-white disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {generating ? <Loader2 className="animate-spin" size={18} /> : t('integrations_generate')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
