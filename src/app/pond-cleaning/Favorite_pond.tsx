import Mountain from "assets/images/clean-1.webp";
import Typography from "components/typography";
const Favorite_pond = () => {
  return (
    <div className="max-w-[1440px] w-[90%] flex gap-4 mx-auto mt-[150px] phone:flex-col phone:w-[95%] ">
      <div className="w-[50%] phone:w-full">
        <div className="flex flex-col gap-6">
          <Typography className="text-[38px] font-bold leading-12">
          Keep Your Ann Arbor Pond Clean And Clear With Pond Maintenance
          </Typography>
          <div className="w-[200px] h-[1px] bg-gray-A0"></div>
          <div className="flex flex-col gap-4">
            <Typography className="text-[#2B2825] text-[16px]">
            Ponds and water features can add a touch of beauty and tranquility to any landscape. However, they require regular maintenance in order to remain safe and functional.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            Pond maintenance includes cleaning the sides and bottom of the pond, removing debris from the water, trimming back vegetation, and checking the pump and filtration system to make sure they are working properly. Water features, such as fountains and waterfalls, also need to be regularly cleaned and serviced.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            By taking the time to perform these simple maintenance tasks, you can ensure that your pond or water feature stays clean and clear.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            Let Grass Roots Pond & Garden Center in Ann Arbor take care of the maintenance and cleaning of your pond so you can spend your time enjoying it.
            </Typography>
          </div>
        </div>
      </div>
      <div className="w-[50%] phone:w-full">
        <img src={Mountain} alt="" className="w-full" />
      </div>
    </div>
  );
};
export default Favorite_pond;
