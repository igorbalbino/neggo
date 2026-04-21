import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../i18n/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  keywords?: string;
  type?: 'website' | 'article' | 'product';
  robots?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonical, 
  image, 
  keywords,
  type = 'website',
  robots = 'index, follow'
}) => {
  const { t, language } = useTranslation();
  
  const defaultTitle = t('meta_title');
  const defaultDescription = t('meta_description');
  const defaultKeywords = t('meta_keywords');
  const siteUrl = window.location.origin;

  const seoTitle = title ? `${title} | Neggo` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image || `${siteUrl}/neggo-bg.png`;
  const seoCanonical = canonical || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={seoCanonical} />
      <html lang={language.split('-')[0]} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoCanonical} />
      <meta property="og:site_name" content="Neggo" />
      <meta property="og:locale" content={language.replace('-', '_')} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:site" content="@neggo_app" />
    </Helmet>
  );
};
