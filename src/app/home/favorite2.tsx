import Mountain from "assets/images/2DONE.webp";
import Typography from "components/typography";
const Favorite2 = () => {
  return (
    <div className="max-w-[1440px] w-[90%] flex gap-4 mx-auto mt-[150px] phone:flex-col phone:w-[95%]">
         <div className="w-[50%] phone:w-full">
        <img src={Mountain} alt="" className="w-full" />
      </div>
      <div className="w-[50%] phone:w-full">
        <div className="flex flex-col gap-6">
          <Typography className="text-[38px] font-bold leading-12">
          Keep Your Pond Healthy
          </Typography>
          <div className="w-[200px] h-[1px] bg-gray-A0"></div>
          <div className="flex flex-col gap-4">
            <Typography className="text-[#2B2825] text-[16px]">
            A healthy pond is essential to the health of the ecosystem that it supports. Not only do fish and other aquatic creatures rely on a clean, well-oxygenated pond for survival, but so do the plants and insects that live along its shores.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            If you have a pond in Ann Arbor, there is a great chance that your water feature is acting as a vital water source for birds and other animals that live in the surrounding area.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            And to be honest, a dirty pond simply isn’t inviting like it should be. As Ann Arbors top pond contractor, we offer maintenance and cleaning packages to take the work of caring for your pond off your plate, so you can focus on enjoying it.
            </Typography>
            {/* <Typography className="text-[#2B2825] text-[16px]">
              Turn that unused space in your yard into the space you need to
              spend time with the people you love.
            </Typography> */}
          </div>
        </div>
      </div>
     
    </div>
  );
};
export default Favorite2;
