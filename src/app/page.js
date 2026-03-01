// app/page.jsx
"use client";

import { usePathname } from "next/navigation";
import BooleanForceBanner from "./components/BooleanForceBanner/BooleanForceBanner";
import BooleanLogicDemo from "./components/BooleanLogicDemo/BooleanLogicDemo";
import BooleanLogicSplit from "./components/BooleanLogicSplit/BooleanLogicSplit";
import OurServices from "./components/OurServices/OurServices";
import OurServices2 from "./components/OurServices2/OurServices2";
import OurServices3 from "./components/OurServices3/OurServices3";
import OurServicesOnlySlider from "./components/OurServicesOnlySlider/OurServicesOnlySlider";
import OurServicesSlider from "./components/OurServicesSlider/OurServicesSlider";
import Partnership from "./components/Partnership/Partnership";
import PricingCard from "./components/PricingCard/PricingCard";
import TechBanner from "./components/TechBanner/TechBanner";
import Banner from "./components/banner/Banner";
import PricingCart from "./components/PricingCart/PricingCart";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import HeroSection from "./components/HeroSection/HeroSection";
import WhyUs from "./components/WhyUs";

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
