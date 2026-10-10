import type { Metadata } from "next";
import { PozeAccessGate } from "@/components/wedding-poses/PozeAccessGate";
import { PozeLandingFlow } from "@/components/wedding-poses/PozeLandingFlow";

export const metadata: Metadata = {
  title: "Izaberite svoje kadrove | Čokoladni Foto & Video",
  description:
    "Interaktivni izbor venčanih poza i inspiracije za vaš poseban dan.",
};

export default function PozePage() {
  return (
    <PozeAccessGate>
      <PozeLandingFlow />
    </PozeAccessGate>
  );
}
