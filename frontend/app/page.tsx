import DrillSizeChart from "@/features/home/drillSizeChart";
import LedCalculator from "@/features/home/ledCalculator";
import RegisterColorCode from "@/features/home/registerColorCode";
import RegisterMemo from "@/features/home/registerMemo";

const Home = () => {
  return (
    <div className="md:flex flex-wrap gap-5">
      <RegisterColorCode />
      <LedCalculator />
      <DrillSizeChart />
      <RegisterMemo />
    </div>
  );
};

export default Home;
