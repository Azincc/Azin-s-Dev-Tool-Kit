import { Helmet } from 'react-helmet-async';
import { useAppContext } from '@/contexts/AppContext';

interface SEOProps {
  pageId: string;
}

const BASE_TITLE = "Azin's Dev Toolkit";

export const SEO: React.FC<SEOProps> = ({ pageId }) => {
  const { t, language } = useAppContext();

  const pageTitle = t(`seo.${pageId}.title`);
  const title = pageId === 'home' ? pageTitle : `${pageTitle} - ${BASE_TITLE}`;
  const description = t(`seo.${pageId}.description`);
  const keywords = t(`seo.${pageId}.keywords`);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />

      {/* Language */}
      <html lang={language} />
    </Helmet>
  );
};

export default SEO;
