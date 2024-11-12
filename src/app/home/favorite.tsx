import Mountain from "assets/images/Moms-pond.png";
import Typography from "components/typography";
const Favorite = () => {
  return (
    <div className="max-w-[1440px] w-[90%] flex gap-4 mx-auto mt-[150px] phone:flex-col phone:w-[95%] ">
      <div className="w-[50%] phone:w-full">
        <div className="flex flex-col gap-6">
          <Typography className="text-[38px] font-bold leading-12">
          Transform Your Ann Arbor Home's Backyard
          </Typography>
          <div className="w-[200px] h-[1px] bg-gray-A0"></div>
          <div className="flex flex-col gap-4">
            <Typography className="text-[#2B2825] text-[16px]">
            There’s something incredibly peaceful about ponds. Whether it’s the trickling of a fountain or the gentle ripple of water as fish swim by, the sound of water can instantly transport you to a calmer state of mind.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            The sparkling water, lush greenery, and colorful flowers create an oasis right in your backyard. Spending time by a pond is like taking a mini vacation – it’s the perfect way to unwind and de-stress.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            Plus, ponds are great for entertaining. Whether you’re hosting a barbecue or throwing a party, your guests will be amazed by your backyard oasis.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            Use our pond contractor team in Ann Arbor to create the space you’ve been dreaming of with a custom designed pond.
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
export default Favorite;
