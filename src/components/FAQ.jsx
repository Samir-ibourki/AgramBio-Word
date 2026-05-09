import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalLayout from './LegalLayout';

const FAQ = () => {
  const { t } = useTranslation();
  
  const faqData = t('legal.faq', { returnObjects: true });

  return (
    <LegalLayout 
      title={faqData.title} 
      tag={t('nav.legal_tag')}
      intro={faqData.intro}
    >
      <div className="space-y-12">
        {faqData.sections && faqData.sections.map((section, idx) => (
          <div key={idx} className="group border-b border-gold/10 pb-8 last:border-0">
            <h3 className="text-xl md:text-2xl font-serif mb-4 text-brown flex items-start gap-4">
              <span className="text-gold font-sans text-xs md:text-sm not-italic mt-1.5 md:mt-2">{String(idx + 1).padStart(2, '0')}</span>
              {section.question}
            </h3>
            <div className="ps-2 md:ps-10">
              <p className="text-muted leading-relaxed whitespace-pre-line text-sm md:text-base">
                {section.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </LegalLayout>
  );
};

export default FAQ;
