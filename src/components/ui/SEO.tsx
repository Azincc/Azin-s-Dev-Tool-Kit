import { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';

interface SEOProps {
  pageId: string;
}

const BASE_TITLE = "Azin's Dev Toolkit";

export const SEO: React.FC<SEOProps> = ({ pageId }) => {
  const { t, language } = useAppContext();

  useEffect(() => {
    // Update document title
    const pageTitle = t(`seo.${pageId}.title`);
    const title = pageId === 'home' ? pageTitle : `${pageTitle} - ${BASE_TITLE}`;
    document.title = title;

    // Update meta description
    const description = t(`seo.${pageId}.description`);
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update meta keywords
    const keywords = t(`seo.${pageId}.keywords`);
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // Update Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', description);

    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', 'website');

    // Update language meta tag
    document.documentElement.lang = language;
  }, [pageId, t, language]);

  return null;
};

export default SEO;
