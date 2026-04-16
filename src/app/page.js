// app/page.jsx
"use client";

import BooleanForceBanner from "../../src/app/components/BooleanForceBanner/BooleanForceBanner.jsx";
import BooleanLogicDemo from "./components/BooleanLogicDemo/BooleanLogicDemo";
import OurServicesOnlySlider from "./components/OurServicesOnlySlider/OurServicesOnlySlider";
import Partnership from "./components/Partnership/Partnership";
import PricingCart from "./components/PricingCart/PricingCart";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Home Component - Session status:", status);
    console.log("Home Component - Session data:", session);
  }, [session, status]);

  return (
    <div className="min-h-screen my-12">
      {/* <TechBanner /> */}

      <BooleanForceBanner />
      {/* <HeroSection /> */}
      <BooleanLogicDemo />
      {/* <BooleanLogicSplit /> */}
      {/* <OurServices />
      <OurServices2 />
      <OurServices3 /> */}
      {/* <OurServicesSlider /> */}
      <OurServicesOnlySlider />
      {/* <PricingCard /> */}
      <PricingCart />
      <Partnership />
     
    </div>
  );
}
