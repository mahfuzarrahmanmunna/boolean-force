"use client"

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

export default function Home() {
  return (
    <>
      {/* <TechBanner /> */}
      <BooleanForceBanner />
      <BooleanLogicDemo />
      <BooleanLogicSplit />
      <OurServices />
      <OurServices2 />
      <OurServices3 />
      <OurServicesSlider />
      <OurServicesOnlySlider />
      <PricingCard />
      <Partnership />
    </>
  );
}
