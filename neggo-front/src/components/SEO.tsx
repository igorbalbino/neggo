import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../i18n/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
}

export const SEO: React.FC<SEOProps> = ({ title, description, canonical, image }) => {
  const { t } = useTranslation();
  
  const defaultTitle = t('meta_title');
  const defaultDescription = t('meta_description');
  const siteUrl = window.location.origin;

  const seoTitle = title ? `${title} | Neggo` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || `${siteUrl}/og-image.jpg`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={window.location.href} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
};
