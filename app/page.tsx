import { Footer } from "@/components/Footer";
import { SignupDialog } from "@/components/SignupDialog";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { Program } from "@/components/Program";
import { How } from "@/components/How";
import { Faq, FinalCta, Tools } from "@/components/Sections";
import { Works } from "@/components/Works";

export default function Home() {
  return (
    <>
      <Header />
      <main className="overflow-x-clip">
        {/* phase — плавный переход блока при прокрутке (см. globals.css) */}
        <div className="phase-exit">
          <Hero />
        </div>
        <div className="phase">
          <Tools />
        </div>
        <div className="phase">
          <Program />
        </div>
        <div className="phase">
          <How />
        </div>
        <div className="phase">
          <Pricing />
        </div>
        <div className="phase">
          <Works />
        </div>
        <div className="phase">
          <Faq />
        </div>
        <div className="phase">
          <FinalCta />
        </div>
      </main>
      <Footer />
      <SignupDialog />
    </>
  );
}
