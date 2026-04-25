import { useTranslation } from "react-i18next";
import LegalLayout from "./LegalLayout";

function PrivacyPolicy() {
  const { t } = useTranslation();
  const privacyData = t('legal.privacy', { returnObjects: true });

  return (
    <LegalLayout title={privacyData.title}>
      <p className="lead mb-8">{privacyData.intro}</p>
      
      <div className="space-y-12">
        {privacyData.sections.map((section, index) => (
          <section key={index} className="border-b border-black/5 pb-8 last:border-0">
            <h2 className="text-xl font-bold mb-4">{section.title}</h2>
            <p className="leading-relaxed">{section.content}</p>
          </section>
        ))}
      </div>
    </LegalLayout>
  );
}

export default PrivacyPolicy;
