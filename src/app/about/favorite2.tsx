import Typography from "components/typography";
const Favorite2 = () => {
  return (
    <div className="max-w-[1440px] w-[90%] flex gap-4 mx-auto mt-[150px] phone:flex-col phone:w-[95%]">
      <div className=" phone:w-full">
        <img loading="lazy" decoding="async" width="560" height="468" src="https://www.grassrootspondandgarden.com/wp-content/uploads/2022/08/updated-team-pic.webp" data-src="https://www.grassrootspondandgarden.com/wp-content/uploads/2022/08/updated-team-pic.webp" className="attachment-full size-full wp-image-6656 ls-is-cached lazyloaded" alt="Grass Roots team pic" data-srcset="https://www.grassrootspondandgarden.com/wp-content/uploads/2022/08/updated-team-pic.webp 560w, https://www.grassrootspondandgarden.com/wp-content/uploads/2022/08/updated-team-pic-300x251.webp 300w" sizes="(max-width: 560px) 100vw, 560px" title="updated team pic - Grass Roots Pond And Garden - Grass Roots Pond And Garden" srcSet="https://www.grassrootspondandgarden.com/wp-content/uploads/2022/08/updated-team-pic.webp 560w, https://www.grassrootspondandgarden.com/wp-content/uploads/2022/08/updated-team-pic-300x251.webp 300w" />
      </div>
      <div className="w-[50%] phone:w-full">
        <div className="flex flex-col gap-4 elementor-widget-container">
          <h2 className="elementor-heading-title elementor-size-default">
            <Typography className="text-[38px] font-bold leading-12">
              Your Pond <span className="text-custom_green">Family</span>
            </Typography>
          </h2>
          <div className="w-[200px] h-[1px] bg-gray-A0"></div>
          <div className="flex flex-col gap-4">
            <Typography className="text-[#2B2825] text-[16px]">
              <p>Grass Roots first began in 1973 with a simple mission: to bring the sights and sounds of moving water to their customers’ yards.</p>
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
              <p>For over four decades, they have been dedicated to providing quality services and products that bring the joy of water to their clients’ outdoor spaces.</p>
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
              <p>From complete pond construction to simple leak repairs, Grass Roots takes pride in being able to enhance the beauty and functionality of their customers’ yards.</p>
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
              <p>Seeing the reaction of excitement, wonder, and happiness on their homeowners faces is the best part of what they do.</p>
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
              <p>It’s a shared love of ponds that has kept Grass Roots going strong for over 40 years, and they look forward to many more years of service.</p>
            </Typography>
          </div>
        </div>
      </div>

    </div>
  );
};
export default Favorite2;
