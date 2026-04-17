import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'pt-BR' | 'es' | 'en' | 'py';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  // Landing
  landing_title: {
    'pt-BR': 'Conectando você ao que importa localmente.',
    'es': 'Conectándote con lo que importa localmente.',
    'en': 'Connecting you to what matters locally.',
    'py': 'Oñembojoaju ndéve umi mba\'e oñekotevẽva ndéve g̃uarã.',
  },
  landing_subtitle: {
    'pt-BR': 'A plataforma P2P mais rápida para comprar, vender e contratar serviços na sua região.',
    'es': 'La plataforma P2P más rápida para comprar, vender y contratar servicios en tu región.',
    'en': 'The fastest P2P platform to buy, sell, and hire services in your region.',
    'py': 'Pe plataforma P2P pya\'evéva rejogua, revende ha rehupyty hag̃ua tembiapo ne rendápe.',
  },
  get_started: {
    'pt-BR': 'Começar agora',
    'es': 'Empezar ahora',
    'en': 'Get started',
    'py': 'Eñepyrũ ko\'ág̃a',
  },
  login: {
    'pt-BR': 'Entrar',
    'es': 'Iniciar sesión',
    'en': 'Login',
    'py': 'Eike',
  },
  register: {
    'pt-BR': 'Cadastrar',
    'es': 'Registrarse',
    'en': 'Register',
    'py': 'Eñemboguapy',
  },
  // Home
  search_placeholder: {
    'pt-BR': 'Buscar produtos ou serviços...',
    'es': 'Buscar productos o servicios...',
    'en': 'Search products or services...',
    'py': 'Eheka tembiapo térã mba\'erepy...',
  },
  products: {
    'pt-BR': 'Produtos',
    'es': 'Productos',
    'en': 'Products',
    'py': 'Mba\'erepykuéra',
  },
  services: {
    'pt-BR': 'Serviços',
    'es': 'Servicios',
    'en': 'Services',
    'py': 'Tembiapokuéra',
  },
  highlights: {
    'pt-BR': 'Destaques',
    'es': 'Destacados',
    'en': 'Highlights',
    'py': 'Ojehecharamovéva',
  },
  recent: {
    'pt-BR': 'Recentes',
    'es': 'Recientes',
    'en': 'Recent',
    'py': 'Ipyahuvéva',
  },
  see_all: {
    'pt-BR': 'Ver tudo',
    'es': 'Ver todo',
    'en': 'See all',
    'py': 'Ehecha opaite',
  },
  // Ad Detail
  negotiable: {
    'pt-BR': 'A combinar',
    'es': 'A convenir',
    'en': 'Negotiable',
    'py': 'Oñeñe\'ẽ hag̃ua',
  },
  description: {
    'pt-BR': 'Descrição',
    'es': 'Descripción',
    'en': 'Description',
    'py': 'Mba\'éichapa',
  },
  chat_now: {
    'pt-BR': 'Conversar agora',
    'es': 'Chatear ahora',
    'en': 'Chat now',
    'py': 'Eñe\'ẽ ko\'ág̃a',
  },
  view_profile: {
    'pt-BR': 'Ver perfil',
    'es': 'Ver perfil',
    'en': 'View profile',
    'py': 'Ehecha perfil',
  },
  // Create Ad
  create_ad: {
    'pt-BR': 'Criar Anúncio',
    'es': 'Crear Anuncio',
    'en': 'Create Ad',
    'py': 'Ejapo marandu',
  },
  ad_title: {
    'pt-BR': 'Título do anúncio',
    'es': 'Título del anuncio',
    'en': 'Ad title',
    'py': 'Marandu réra',
  },
  price: {
    'pt-BR': 'Preço',
    'es': 'Precio',
    'en': 'Price',
    'py': 'Hepykue',
  },
  location: {
    'pt-BR': 'Localização',
    'es': 'Ubicación',
    'en': 'Location',
    'py': 'Tenda',
  },
  publish: {
    'pt-BR': 'Publicar',
    'es': 'Publicar',
    'en': 'Publish',
    'py': 'Emyasãi',
  },
  // Profile
  my_ads: {
    'pt-BR': 'Meus Anúncios',
    'es': 'Mis Anuncios',
    'en': 'My Ads',
    'py': 'Che marandukuéra',
  },
  favorites: {
    'pt-BR': 'Favoritos',
    'es': 'Favoritos',
    'en': 'Favorites',
    'py': 'Umi oguerohoryvéva',
  },
  plans: {
    'pt-BR': 'Planos e Assinatura',
    'es': 'Planes y Suscripción',
    'en': 'Plans & Subscription',
    'py': 'Planes ha suscripción',
  },
  logout: {
    'pt-BR': 'Sair',
    'es': 'Salir',
    'en': 'Logout',
    'py': 'Esẽ',
  },
  // Auth Pages
  email: {
    'pt-BR': 'E-mail',
    'es': 'E-mail',
    'en': 'E-mail',
    'py': 'E-mail',
  },
  password: {
    'pt-BR': 'Senha',
    'es': 'Contraseña',
    'en': 'Password',
    'py': 'Ñe\'ẽmbyte',
  },
  forgot_password: {
    'pt-BR': 'Esqueceu a senha?',
    'es': '¿Olvidaste tu contraseña?',
    'en': 'Forgot password?',
    'py': '¿Ndereguerekovéipa nde ñe\'ẽmbyte?',
  },
  full_name: {
    'pt-BR': 'Nome Completo',
    'es': 'Nombre Completo',
    'en': 'Full Name',
    'py': 'Téra Tee',
  },
  phone: {
    'pt-BR': 'WhatsApp / Telefone',
    'es': 'WhatsApp / Teléfono',
    'en': 'WhatsApp / Phone',
    'py': 'Pumbyry',
  },
  finish_registration: {
    'pt-BR': 'Finalizar Cadastro',
    'es': 'Finalizar Registro',
    'en': 'Finish Registration',
    'py': 'Emohu\'ã ñemboguapy',
  },
  already_have_account: {
    'pt-BR': 'Já tem uma conta?',
    'es': '¿Ya tienes una cuenta?',
    'en': 'Already have an account?',
    'py': '¿Reguerekómapa peteĩ cuenta?',
  },
  dont_have_account: {
    'pt-BR': 'Não tem uma conta?',
    'es': '¿No tienes una cuenta?',
    'en': "Don't have an account?",
    'py': '¿Ndereguerekói gueteri peteĩ cuenta?',
  },
  register_subtitle: {
    'pt-BR': 'Crie sua conta em segundos.',
    'es': 'Cree su cuenta en segundos.',
    'en': 'Create your account in seconds.',
    'py': 'Ejapo ne cuenta pya\'e.',
  },
  loading_ads: {
    'pt-BR': 'Carregando anúncios...',
    'es': 'Cargando anuncios...',
    'en': 'Loading ads...',
    'py': 'Marandu ojehechauka...',
  },
  city_filter_placeholder: {
    'pt-BR': 'Filtrar por cidade (ex: São Paulo)...',
    'es': 'Filtrar por ciudad (ex: Madrid)...',
    'en': 'Filter by city (e.g., New York)...',
    'py': 'Eheka táva rupive...',
  },
  highlights_subtitle: {
    'pt-BR': 'Os melhores anúncios perto de você',
    'es': 'Los mejores anuncios cerca de ti',
    'en': 'The best ads near you',
    'py': 'Umi marandu iporãvéva ne rendápe',
  },
  recent_subtitle: {
    'pt-BR': 'Publicados agora pouco',
    'es': 'Publicados hace poco',
    'en': 'Published just now',
    'py': 'Oñemyasãiva ko\'ág̃a',
  },
  serves_national: {
    'pt-BR': 'Atende todo o país',
    'es': 'Atiende a todo el país',
    'en': 'Serves the entire country',
    'py': 'Oñemyasãiva tetã guasu pukue',
  },
  more_locations: {
    'pt-BR': 'locais',
    'es': 'lugares',
    'en': 'locations',
    'py': 'tenda',
  },
  no_location: {
    'pt-BR': 'Localização não informada',
    'es': 'Ubicación no informada',
    'en': 'No location provided',
    'py': 'Ndojeikuaái moõpa oĩ',
  },
  boost_ad: {
    'pt-BR': 'Turbinar Anúncio',
    'es': 'Potenciar Anuncio',
    'en': 'Boost Ad',
    'py': 'Emombarete marandu',
  },
  boost_success: {
    'pt-BR': 'Anúncio impulsionado com sucesso!',
    'es': '¡Anuncio potenciado con éxito!',
    'en': 'Ad boosted successfully!',
    'py': '¡Marandu omombarete porã!',
  },
  boost_error: {
    'pt-BR': 'Erro ao impulsionar anúncio.',
    'es': 'Error al potenciar el anuncio.',
    'en': 'Error boosting ad.',
    'py': 'Jejavy marandu ñemombaretehápe.',
  },
  new: {
    'pt-BR': 'Novo',
    'es': 'Nuevo',
    'en': 'New',
    'py': 'Ipyahu',
  },
  used: {
    'pt-BR': 'Usado',
    'es': 'Usado',
    'en': 'Used',
    'py': 'Ima\'ẽva',
  },
  start_chat: {
    'pt-BR': 'Começar conversa',
    'es': 'Comenzar conversación',
    'en': 'Start chat',
    'py': 'Eñepyrũ eñe\'ẽ',
  },
  plans_title: {
    'pt-BR': 'Planos e Assinatura',
    'es': 'Planes y Suscripción',
    'en': 'Plans & Subscription',
    'py': 'Planes ha suscripción',
  },
  evolve_business: {
    'pt-BR': 'Evolua seu negócio',
    'es': 'Evolucione su negocio',
    'en': 'Evolve your business',
    'py': 'Emotenonde ne negocio',
  },
  choose_ideal_plan: {
    'pt-BR': 'Escolha o plano ideal para suas necessidades',
    'es': 'Elija el plan ideal para sus necesidades',
    'en': 'Choose the ideal plan for your needs',
    'py': 'Eiporavo pe plan iporãvéva ndéve g̃uarã',
  },
  plan_current: {
    'pt-BR': 'Plano Atual',
    'es': 'Plan Actual',
    'en': 'Current Plan',
    'py': 'Ko\'ag̃agua plan',
  },
  plan_subscribe: {
    'pt-BR': 'Assinar Agora',
    'es': 'Suscribirse Ahora',
    'en': 'Subscribe Now',
    'py': 'Eñemboguapy ko\'ág̃a',
  },
  most_popular: {
    'pt-BR': 'Mais Popular',
    'es': 'Más Popular',
    'en': 'Most Popular',
    'py': 'Herakuãvéva',
  },
  per_month: {
    'pt-BR': 'mês',
    'es': 'mes',
    'en': 'month',
    'py': 'jasypo',
  },
  up_to: {
    'pt-BR': 'Até',
    'es': 'Hasta',
    'en': 'Up to',
    'py': 'Peve',
  },
  safe_payment: {
    'pt-BR': 'Pagamento Seguro',
    'es': 'Pago Seguro',
    'en': 'Safe Payment',
    'py': 'Ñemyasãi hekoitépe',
  },
  data_protected: {
    'pt-BR': 'Seus dados estão protegidos por criptografia de ponta a ponta.',
    'es': 'Sus datos están protegidos por encriptación de extremo a extremo.',
    'en': 'Your data is protected by end-to-end encryption.',
    'py': 'Nde moarandukuéra oñeñangareko porã.',
  },
  plan_success: {
    'pt-BR': 'Plano assinado com sucesso!',
    'es': '¡Plan suscrito con éxito!',
    'en': 'Plan subscribed successfully!',
    'py': '¡Oñemboguapy porã pe plan!',
  },
  plan_error: {
    'pt-BR': 'Erro ao assinar plano.',
    'es': 'Error al suscribirse al plan.',
    'en': 'Error subscribing to plan.',
    'py': 'Jejavy plan ñemboguapyhápe.',
  },
  what_announce: {
    'pt-BR': 'O que você quer anunciar?',
    'es': '¿Qué quieres anunciar?',
    'en': 'What do you want to announce?',
    'py': '¿Mba\'épa reipota remyasãi?',
  },
  sell_something: {
    'pt-BR': 'Venda algo que você não usa mais',
    'es': 'Vende algo que ya no uses',
    'en': 'Sell something you no longer use',
    'py': 'Ehepyme\'ẽ mba\'e ndereipuruvéiva',
  },
  offer_talent: {
    'pt-BR': 'Ofereça seu talento ou trabalho',
    'es': 'Ofrezca su talento o trabajo',
    'en': 'Offer your talent or work',
    'py': 'Eikuave\'ẽ ne rembiapo',
  },
  basic_details: {
    'pt-BR': 'Detalhes básicos',
    'es': 'Detalles básicos',
    'en': 'Basic details',
    'py': 'Mba\'ekuaarã tenondegua',
  },
  ad_title_label: {
    'pt-BR': 'Título do anúncio',
    'es': 'Título del anuncio',
    'en': 'Ad title',
    'py': 'Marandu réra',
  },
  description_placeholder: {
    'pt-BR': 'Descreva o que está vendendo ou oferecendo...',
    'es': 'Describa lo que está vendiendo u ofreciendo...',
    'en': 'Describe what you are selling or offering...',
    'py': 'Emombe\'u mba\'épa rehepy me\'ẽ...',
  },
  price_label: {
    'pt-BR': 'Preço (R$)',
    'es': 'Precio (R$)',
    'en': 'Price (R$)',
    'py': 'Hepykue (R$)',
  },
  where_deliver: {
    'pt-BR': 'Onde você atende ou entrega?',
    'es': '¿Dónde atiende o entrega?',
    'en': 'Where do you serve or deliver?',
    'py': '¿Moõpa remba\'apo térã rembou?',
  },
  current_city: {
    'pt-BR': 'Minha cidade atual',
    'es': 'Mi ciudad actual',
    'en': 'My current city',
    'py': 'Che táva ko\'ág̃agua',
  },
  multiple_cities: {
    'pt-BR': 'Selecionar múltiplas cidades',
    'es': 'Seleccionar múltiples ciudades',
    'en': 'Select multiple cities',
    'py': 'Eiporavo heta táva',
  },
  photos_conditions: {
    'pt-BR': 'Fotos e Condições',
    'es': 'Fotos y Condiciones',
    'en': 'Photos & Conditions',
    'py': 'Ta\'ãnga ha ñe\'ẽme\'ẽ',
  },
  condition_label: {
    'pt-BR': 'Condição',
    'es': 'Condición',
    'en': 'Condition',
    'py': 'Mba\'éichapa oĩ',
  },
  service_type_label: {
    'pt-BR': 'Tipo de Serviço',
    'es': 'Tipo de Servicio',
    'en': 'Service Type',
    'py': 'Mba\'eichagua tembiapo',
  },
  remote: {
    'pt-BR': 'Remoto',
    'es': 'Remoto',
    'en': 'Remote',
    'py': 'Mombyryguive',
  },
  in_person: {
    'pt-BR': 'Presencial',
    'es': 'Presencial',
    'en': 'In person',
    'py': 'Hechaitehápe',
  },
  publish_ad_btn: {
    'pt-BR': 'Publicar Anúncio',
    'es': 'Publicar Anuncio',
    'en': 'Publish Ad',
    'py': 'Emyasãi marandu',
  },
  all_ready: {
    'pt-BR': 'Tudo pronto!',
    'es': '¡Todo listo!',
    'en': 'All ready!',
    'py': '¡Oĩmbáma!',
  },
  publish_success: {
    'pt-BR': 'Seu anúncio foi publicado com sucesso.',
    'es': 'Su anuncio ha sido publicado con éxito.',
    'en': 'Your ad has been published successfully.',
    'py': 'Ne marandu oñemyasãi porãma.',
  },
  sell_faster: {
    'pt-BR': 'Venda 10x mais rápido!',
    'es': '¡Venda 10 veces más rápido!',
    'en': 'Sell 10x faster!',
    'py': '¡Ehepyme\'ẽ pya\'eve!',
  },
  boost_highlights: {
    'pt-BR': 'Impulsione seu anúncio para aparecer no topo das buscas e na página inicial.',
    'es': 'Potencie su anuncio para que aparezca al principio de las búsquedas y en la página de inicio.',
    'en': 'Boost your ad to appear at the top of searches and on the home page.',
    'py': 'Emombarete ne marandu ojehecha hag̃ua tenondépe.',
  },
  boost_now: {
    'pt-BR': 'Impulsionar agora',
    'es': 'Potenciar ahora',
    'en': 'Boost now',
    'py': 'Emombarete ko\'ág̃a',
  },
  back_to_start: {
    'pt-BR': 'Voltar para o início',
    'es': 'Volver al inicio',
    'en': 'Back to start',
    'py': 'Jevy ñepyrũme',
  },
  continue: {
    'pt-BR': 'Continuar',
    'es': 'Continuar',
    'en': 'Continue',
    'py': 'Segui',
  },
  cancel: {
    'pt-BR': 'Cancelar',
    'es': 'Cancelar',
    'en': 'Cancel',
    'py': 'Cancelá',
  },
  // Meta / SEO
  meta_title: {
    'pt-BR': 'Neggo | Marketplace de Produtos e Serviços na sua Região',
    'es': 'Neggo | Marketplace de Productos y Servicios en su Región',
    'en': 'Neggo | Products and Services Marketplace in your Region',
    'py': 'Neggo | Mba\'erepy ha Tembiapo ne rendápe',
  },
  meta_description: {
    'pt-BR': 'Compre, venda e anuncie serviços localmente. A plataforma mais rápida e intuitiva para fazer negócios na sua região.',
    'es': 'Compre, venda e anuncie servicios localmente. La plataforma más rápida e intuitiva para hacer negocios en su región.',
    'en': 'Buy, sell, and advertise services locally. The fastest and most intuitive platform for doing business in your region.',
    'py': 'Ejogua, evende ha emyasãi tembiapo ne rendápe. Pe plataforma pya\'eve ha iporãvéva rejapo hag̃ua negocios ne rendápe.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('neggo_lang') as Language;
    if (saved) return saved;
    
    const browserLang = navigator.language;
    if (browserLang.includes('pt')) return 'pt-BR';
    if (browserLang.includes('es')) return 'es';
    if (browserLang.includes('gn') || browserLang.includes('py')) return 'py'; // Guaraní
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('neggo_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within a LanguageProvider');
  return context;
};
