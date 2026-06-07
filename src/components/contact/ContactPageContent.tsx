import { ContactHero } from "./ContactHero";
import { ContactForm } from "./ContactForm";
import { FaqAccordion } from "./FaqAccordion";
import { ContactCtaStrip } from "./ContactCtaStrip";
import { ScrollSection } from "@/components/ScrollSection";
import { aboutContainer, aboutPage, aboutSection } from "@/lib/about-tw";

type ContactPageContentProps = {
  userEmail: string | null;
};

export function ContactPageContent({ userEmail }: ContactPageContentProps) {
  return (
    <div className={aboutPage}>
      <ScrollSection className="pb-0 pt-0">
        <ContactHero />
      </ScrollSection>

      <ScrollSection className={`${aboutSection} bg-white`} id="form">
        <div className={aboutContainer}>
          <div className="mx-auto max-w-[640px]">
            <ContactForm defaultEmail={userEmail ?? ""} />
          </div>
        </div>
      </ScrollSection>

      <ScrollSection className={aboutSection}>
        <FaqAccordion />
      </ScrollSection>

      <ContactCtaStrip />
    </div>
  );
}
