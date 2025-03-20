import DrillSizeChart from "@/features/home/drillSizeChart";
import LedCalculator from "@/features/home/ledCalculator";
import RegisterColorCode from "@/features/home/registerColorCode";

const Home = () => {
  return (
    <div className="md:flex flex-wrap gap-5">
      <RegisterColorCode />
      <LedCalculator />
      <DrillSizeChart />
      <div className="card bg-base-300 md:w-96 mb-5 md:mb-0 shadow-xl">
        test
      </div>
      <div className="card bg-base-100 md:w-96 mb-5 md:mb-0 shadow-xl">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Shoes!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
