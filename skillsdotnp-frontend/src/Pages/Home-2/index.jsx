import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Topbar from "../../Component/Headers/Topbar";
import Header from "../../Component/Headers";
import HomeTowHero from "../../Component/Heros/HomeTowHero";
import FeatureHome2 from "../../Component/Features/FeatureHome2";
import Teachers from "../../Component/Teachers/Teachers";
import FooterHome2 from "../../Component/Footer/FooterHome2";
import GotoTop from "../../Component/GotoTop";

function Home2() {
  const [isLoading, setIsLoading] = useState(true);
  let content = undefined;
  useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  if (isLoading) {
    content = <Preloader />;
  } else {
    content = (
      <>
        <Topbar />
        <Header
          className="header-02"
          logo="assets/images/ElearningLogo.webp"
          search={true}
        />
        <HomeTowHero />
        <FeatureHome2 />
        <Teachers />
        <FooterHome2 />
        <GotoTop />
      </>
    );
  }
  return content;
}

export default Home2;
