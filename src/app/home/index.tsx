import MainHome from "./main_home";
import Statistical from "./statistical";
import Favorite from "./favorite";
import Favorite2 from "./favorite2";
import Construction from "./construction";
export default function Home() {
  return (
    <div>
      <MainHome />
      <Statistical />
      <Favorite />
      <div className="bg-custom_green1">
        <Favorite2 />
      </div>
      <Construction />
    </div>
  );
}
