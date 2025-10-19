"use client"

import BooleanForceBanner from "./components/BooleanForceBanner/BooleanForceBanner";
import BooleanLogicDemo from "./components/BooleanLogicDemo/BooleanLogicDemo";
import BooleanLogicSplit from "./components/BooleanLogicSplit/BooleanLogicSplit";
import OurServices from "./components/OurServices/OurServices";
import TechBanner from "./components/TechBanner/TechBanner";

export default function Home() {
  return (
    <>
      {/* <TechBanner /> */}
      <BooleanForceBanner />
      <BooleanLogicDemo />
      <BooleanLogicSplit />
      <OurServices />
    </>
  );
}
