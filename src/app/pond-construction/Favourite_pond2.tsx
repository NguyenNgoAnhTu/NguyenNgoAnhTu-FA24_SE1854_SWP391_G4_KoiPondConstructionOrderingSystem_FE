import Mountain from "assets/images/6DONE.webp";
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
          Connect with Ann Arbor Wildlife
          </Typography>
          <div className="w-[200px] h-[1px] bg-gray-A0"></div>
          <div className="flex flex-col gap-4">
            <Typography className="text-[#2B2825] text-[16px]">
            In addition to the focal feature that a pond will add to your yard, there are many other benefits to backyard koi pond construction.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            Ponds provide a perfect place for wildlife like frogs, turtles, and fish to live. They can also help to attract other animals, such as birds and butterflies – which can add a touch of beauty to your backyard.
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            This offers you a unique opportunity to connect with nature. Watching the wildlife in your koi pond can be a relaxing and enjoyable experience, and it can also be a great way to learn about the different animals in Ann Arbor. Any kids will love being around a backyard pond – it’s the perfect place to explore and imagine. 
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
            Your koi pond construction project can help you connect with nature (and your inner child).
            </Typography>
          </div>
        </div>
      </div>
     
    </div>
    </div>
  );
};
export default Favorite_pond2;
