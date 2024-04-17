import CardFour from "../../components/Card/CardFour.tsx";
import CardOne from "../../components/Card/CardOne.tsx";
import CardThree from "../../components/Card/CardThree.tsx";
import CardTwo from "../../components/Card/CardTwo.tsx";

const ECommerce = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>
    </>
  );
};

export default ECommerce;
