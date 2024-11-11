import About from "./about";
import Statistical from "./statistical";
import Favorite from "./favorite";
import Favorite2 from "./favorite2";
import Construction from "./construction";
export default function Home() {
  return (
    <div>
      <About />
      <Statistical />
      <Favorite />
      <div className="bg-custom_green1">
        <Favorite2 />
      </div>
      <Construction />
    </div>
  );
}
