import { LandingBenefits } from "./landing-benefits";
import { LandingClosing } from "./landing-closing";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";

export function LandingPage() {
  return (
    <div className="min-h-svh">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingBenefits />
        <LandingClosing />
      </main>
    </div>
  );
}
