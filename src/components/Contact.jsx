import { MapPin, Mail, Clock, Phone, MessageCircle } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BOUTIQUE_INFO } from "../constants/config";
import { SOCIAL_LINKS } from "../constants/socials";

function Contact() {
  const { t } = useTranslation();
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".page-header", { y: 30, opacity: 0, duration: 1 });
      tl.from(
        ".contact-card",
        { y: 40, opacity: 0, stagger: 0.2, duration: 0.8 },
        "-=0.5",
      );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* header section */}
      <div className="pt-20 pb-16 page-header text-center max-w-7xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-serif text-dark mb-4">
          {t("contact.title")}
        </h1>
        <p className="text-dark/40 text-sm max-w-2xl mx-auto leading-relaxed">
          {t("contact.description")}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* map */}
        <div className="contact-card h-full min-h-162.5 bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm p-4">
          <div className="w-full h-full rounded-2xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55160.01353139358!2d-9.40798155!3d30.2144795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3ea608df9e81b%3A0x6331a96759c9597!2sBiougra%2C%20Morocco!5e0!3m2!1sen!2sma!4v1713550000000!5m2!1sen!2sma"
              className="w-full h-full border-none"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* info blocks */}
        <div className="flex flex-col gap-6">
          {/* contact information */}
          <div className="contact-card bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-8">
            <h3 className="text-lg font-bold text-dark mb-6">
              {t("contact.info_title")}
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-dark/30 tracking-widest leading-none mb-1">
                    {t("contact.address")}
                  </h4>
                  <p className="text-sm text-dark font-medium leading-relaxed uppercase">
                    {BOUTIQUE_INFO.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-dark/30 tracking-widest leading-none mb-1">
                    {t("contact.phone")}
                  </h4>
                  <p className="text-sm text-dark font-medium leading-relaxed">
                    {BOUTIQUE_INFO.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-dark/30 tracking-widest leading-none mb-1">
                    {t("contact.email")}
                  </h4>
                  <p className="text-sm text-dark font-medium leading-relaxed">
                    {BOUTIQUE_INFO.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-black text-dark/30 tracking-widest leading-none mb-1">
                    {t("contact.whatsapp")}
                  </h4>
                  <p className="text-sm text-dark font-medium leading-relaxed">
                    {t("contact.whatsapp_text")} <br />
                    <span className="text-emerald-600 font-bold uppercase tracking-wider">
                      {BOUTIQUE_INFO.whatsapp}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* business hours */}
          <div className="contact-card bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Clock size={20} className="text-dark/30" />
              <h3 className="text-lg font-bold text-dark">
                {t("contact.hours_title")}
              </h3>
            </div>
            <p className="text-sm text-dark/60 leading-relaxed ml-9">
              {t("contact.hours_text")}{" "}
              <span className="font-bold text-dark">
                {BOUTIQUE_INFO.hours}
              </span>
              <br />
              {t("contact.hours_note")}
            </p>
          </div>

          {/* follow us */}
          <div className="contact-card bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
            <h3 className="text-lg font-bold text-dark mb-6">
              {t("contact.follow")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="flex items-center bg-[#F8F9FA] rounded-2xl p-4 gap-3 hover:bg-gold hover:text-dark transition-all group"
                >
                  <div className="text-dark/40 group-hover:text-dark transition-colors">
                    {social.icon}
                  </div>
                  <span className="text-sm font-bold lowercase">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
