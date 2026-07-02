import Hero from "@/components/Hero";
import TransformationProof from "@/components/TransformationProof";
import HowItWorks from "@/components/HowItWorks";
import ColorLineup from "@/components/ColorLineup";
import Editorial from "@/components/Editorial";
import SpecSheet from "@/components/SpecSheet";
import InterestForm from "@/components/InterestForm";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <TransformationProof />
      <HowItWorks />
      <ColorLineup />
      <Editorial />
      <SpecSheet />
      <InterestForm />
    </main>
  );
}
