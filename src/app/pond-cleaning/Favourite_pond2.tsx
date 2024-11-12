import Mountain from "assets/images/clean-2.webp";
import Typography from "components/typography";
const Favorite_pond2 = () => {
  return (
    <div style={{ backgroundColor: 'rgb(236, 248, 242)' }}>
    <div className="max-w-[1440px] w-[90%] flex gap-4 mx-auto mt-[150px] phone:flex-col phone:w-[95%]">
      <div className="w-[50%] phone:w-full">
        <img src={Mountain} alt="" className="w-full" />
      </div>
      <div className="w-[50%] phone:w-full">
        <div className="flex flex-col gap-6">
          <Typography className="text-[38px] font-bold leading-12">
          The Exploratory Drain & Clean
          </Typography>
          <div className="w-[200px] h-[1px] bg-gray-A0"></div>
          <div className="flex flex-col gap-4">
            <Typography className="text-[#2B2825] text-[16px]">
            Anyone who owns a pond in Ann Arbor knows that they require regular maintenance to stay healthy and functioning properly. One of the most important things you can do for your pond is to have an exploratory drain and clean performed regularly.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            This pond maintenance process involves draining all the water from the pond so that it can be thoroughly cleaned. This gives you a chance to inspect the liner for any damage, remove debris and ensure that the pump is working properly.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            Although it may seem like a lot of work, an exploratory drain and clean is essential for keeping your pond healthy and looking its best. Furthermore, it can help to prevent serious problems from developing in the future.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            We’re here and happy to do the hard work and diagnose any issues that we find, that way you can love your pond for years to come.
            </Typography>
          </div>
        </div>
      </div>
    </div>
      </div>
  );
};
export default Favorite_pond2;
