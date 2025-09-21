import { Helmet } from 'react-helmet-async';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  twitterHandle?: string;
  structuredData?: object;
  noIndex?: boolean;
}

export function MetaTags({
  title = 'Prashiskshan - College-Verified Internships & Micro-Projects',
  description = 'India\'s leading platform for college-verified internships and micro-projects. Apply via SMS, work offline, and get paid securely through escrow.',
  keywords = ['internships', 'micro-projects', 'college-verified', 'rural India', 'SMS application', 'offline support', 'escrow payments'],
  image = 'https://prashiskshan.in/og-image.png',
  url = 'https://prashiskshan.in',
  type = 'website',
  siteName = 'Prashiskshan',
  twitterHandle = '@prashiskshan',
  structuredData,
  noIndex = false
}: MetaTagsProps) {
  const fullTitle = title.includes('Prashiskshan') ? title : `${title} | Prashiskshan`;
  const keywordsString = keywords.join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      
      {/* Additional SEO Tags */}
      <meta name="author" content="Prashiskshan Team" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Mobile & PWA */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Prashiskshan" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#8b5cf6" />
      <meta name="msapplication-navbutton-color" content="#8b5cf6" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Preload Critical Resources */}
      <link 
        rel="preload" 
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Playfair+Display:wght@400;600;700&family=Fira+Code:wght@300;400;500&display=swap" 
        as="style" 
      />
      
      {/* DNS Prefetch for External Resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Helmet>
  );
}

// Common structured data generators
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Prashiskshan",
  "description": "India's leading platform for college-verified internships and micro-projects",
  "url": "https://prashiskshan.in",
  "logo": "https://prashiskshan.in/logo.png",
  "sameAs": [
    "https://twitter.com/prashiskshan",
    "https://linkedin.com/company/prashiskshan"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-98765-43210",
    "contactType": "customer service",
    "availableLanguage": ["English", "Hindi"]
  }
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Prashiskshan",
  "url": "https://prashiskshan.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://prashiskshan.in/projects?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const generateJobPostingSchema = (project: any) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": project.title,
  "description": project.description,
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Prashiskshan",
    "sameAs": "https://prashiskshan.in"
  },
  "jobLocation": {
    "@type": "Place",
    "addressLocality": "Remote",
    "addressCountry": "IN"
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "value": {
      "@type": "QuantitativeValue",
      "value": project.stipend_amount,
      "unitText": "TOTAL"
    }
  },
  "employmentType": "CONTRACTOR",
  "datePosted": project.created_at,
  "validThrough": project.application_deadline,
  "applicantLocationRequirements": {
    "@type": "Country",
    "name": "IN"
  },
  "skills": project.skills_required
});