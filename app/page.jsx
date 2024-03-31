
import Image from "next/image";
import Slider from "./components/slider/page";
import trending from '@/public/Trending.png'
import newArrivals from '@/public/New Arrivals.png'
import ProductSlider from "./components/productSlider/page";
import Blocks from "./components/blocks/page";

export default function Home() {

  return (
    <main className="min-h-screen">
      <Slider />

      {/* second section */}
      <Blocks/>

      {/* recommended section */}

      <div className="recommendedWrapper p-3">
        <p className="text-2xl font-bold text-[#030203] pl-4">Recommended by Earthie</p>

        <div className="carousel">
          <ProductSlider endpoint={'products'}/>
        </div>
      </div>

      {/* New Arrivals section */}
      <div className="recommendedWrapper p-3">
        <p className="text-2xl font-bold text-[#030203] pl-4">New Arrivals</p>

        <div className="carousel">
          <ProductSlider endpoint={'products/?new_arrivals=true'}/>
        </div>
      </div>
    </main>
  );
}
