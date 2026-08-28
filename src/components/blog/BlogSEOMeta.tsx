/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { BlogPost } from '../../types';

interface BlogSEOMetaProps {
  post?: BlogPost | null;
  isCatalog?: boolean;
  categoryName?: string;
}

export default function BlogSEOMeta({ post, isCatalog = false, categoryName }: BlogSEOMetaProps) {
  useEffect(() => {
    const siteName = 'Engraced Logistics';
    const baseUrl = 'https://www.engracedlogistics.com.ng';
    const defaultImage = 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80';

    let pageTitle = 'Executive Insights & VIP Logistics Blog | Engraced Logistics Benin City';
    let pageDesc = 'Explore the latest insights on luxury car rentals in Benin City, VIP security escort protocols, and interstate executive travel across Nigeria.';
    let pageKeywords = 'car rental Benin City, luxury SUV hire Nigeria, VIP transport Benin City, armed escort convoy Lagos, Toyota Prado rental';
    let pageUrl = `${baseUrl}/blog`;
    let pageImage = defaultImage;
    let schemaJsonList: object[] = [];

    if (post) {
      pageTitle = post.seo?.metaTitle || `${post.title} | ${siteName}`;
      pageDesc = post.seo?.metaDescription || post.excerpt;
      pageKeywords = (post.seo?.targetKeywords || post.tags || []).join(', ');
      pageUrl = `${baseUrl}/blog/${post.slug}`;
      pageImage = post.seo?.ogImage || post.coverImage || defaultImage;

      // 1. Article / BlogPosting JSON-LD Schema
      const blogPostingSchema = {
        '@context': 'https://schema.org',
        '@type': post.seo?.schemaType || 'BlogPosting',
        '@id': `${pageUrl}#article`,
        headline: post.title,
        description: post.excerpt,
        image: [pageImage],
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        inLanguage: 'en-NG',
        author: {
          '@type': 'Person',
          name: post.author.name,
          jobTitle: post.author.role,
          image: post.author.avatar,
        },
        publisher: {
          '@type': 'Organization',
          name: siteName,
          url: baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/favicon.svg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        keywords: (post.tags || []).join(', '),
        articleSection: post.category,
        wordCount: post.content.split(/\s+/).length,
      };
      schemaJsonList.push(blogPostingSchema);

      // 2. Breadcrumbs Schema
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${baseUrl}/blog`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: pageUrl,
          },
        ],
      };
      schemaJsonList.push(breadcrumbSchema);

      // 3. FAQPage Schema if FAQ items exist
      if (post.seo?.faqSchema && post.seo.faqSchema.length > 0) {
        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.seo.faqSchema.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        };
        schemaJsonList.push(faqSchema);
      }
    } else if (isCatalog) {
      if (categoryName && categoryName !== 'All Insights') {
        pageTitle = `${categoryName} Insights | Engraced Logistics Blog`;
        pageDesc = `Read expert articles and guidelines about ${categoryName} in Nigeria by Engraced Logistics.`;
      }

      const collectionSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: pageTitle,
        description: pageDesc,
        url: pageUrl,
        publisher: {
          '@type': 'Organization',
          name: siteName,
          url: baseUrl,
        },
      };
      schemaJsonList.push(collectionSchema);
    }

    // Set Document Title
    document.title = pageTitle;

    // Helper to safely set meta tag attributes
    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', pageDesc);
    setMeta('keywords', pageKeywords);
    setMeta('og:title', pageTitle, 'property');
    setMeta('og:description', pageDesc, 'property');
    setMeta('og:url', pageUrl, 'property');
    setMeta('og:image', pageImage, 'property');
    setMeta('og:type', post ? 'article' : 'website', 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDesc);
    setMeta('twitter:image', pageImage);
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Canonical link tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);

    // Injected Dynamic JSON-LD Script Tags
    const existingDynamicScripts = document.querySelectorAll('script[data-dynamic-seo="true"]');
    existingDynamicScripts.forEach((s) => s.remove());

    schemaJsonList.forEach((schemaData) => {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-dynamic-seo', 'true');
      script.textContent = JSON.stringify(schemaData);
      document.head.appendChild(script);
    });

    return () => {
      const cleanupScripts = document.querySelectorAll('script[data-dynamic-seo="true"]');
      cleanupScripts.forEach((s) => s.remove());
    };
  }, [post, isCatalog, categoryName]);

  return null;
}