import Typography from "components/typography";
const Favorite = () => {
  return (
    <div className="max-w-[1440px] w-[90%] flex gap-4 mx-auto mt-[150px] phone:flex-col phone:w-[95%] ">
      <div className="w-[50%] phone:w-full">
        <div className="flex flex-col gap-6 elementor-widget-container">
          <Typography className="text-[38px] font-bold leading-12">
            Our <span className="text-custom_green">Mission</span>
          </Typography>
          <div className="w-[200px] h-[1px] bg-gray-A0"></div>
          <div className="flex flex-col gap-4">
            <Typography className="text-[#2B2825] text-[16px]">
              <p>At Grass Roots, we know that every pond is unique – just like the person who dreamed it up in the first place.</p>
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
              <p>Whether you’re looking for a serene oasis or a playful spot for your kids to explore, we’ll work with you to create a one-of-a-kind pond that perfectly fits your vision.</p>
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
              <p>Our core values consist of three things:&nbsp;</p>
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
              <p><span><strong>Family First</strong>: We want our clients to feel more like a part of the family.</span></p>
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
              <p><span><strong>Quality is Everything</strong>: We strive to show you our attention to detail in every aspect of our business. We want our customers to feel that they received quality information, customer service, products and craftsmanship.</span></p>
            </Typography>
            <Typography className="text-[#2B2825] text-[16px]">
              <p><span><strong>Integrity</strong>: Do the right thing when no one is looking.</span></p>
            </Typography>
          </div>
        </div>
      </div>
      <div className="w-[50%] phone:w-full">
        <img loading="lazy" decoding="async" width="560" height="468" src="https://www.grassrootspondandgarden.com/wp-content/uploads/2024/01/Close-up-of-greenery-around-a-pond.webp" data-src="https://www.grassrootspondandgarden.com/wp-content/uploads/2024/01/Close-up-of-greenery-around-a-pond.webp" className="attachment-full size-full wp-image-8701 ls-is-cached lazyloaded" alt="Close up of greenery around a pond" data-srcset="https://www.grassrootspondandgarden.com/wp-content/uploads/2024/01/Close-up-of-greenery-around-a-pond.webp 560w, https://www.grassrootspondandgarden.com/wp-content/uploads/2024/01/Close-up-of-greenery-around-a-pond-300x251.webp 300w" sizes="(max-width: 560px) 100vw, 560px" title="Close up of greenery around a pond - Grass Roots Pond And Garden - Grass Roots Pond And Garden" srcSet="https://www.grassrootspondandgarden.com/wp-content/uploads/2024/01/Close-up-of-greenery-around-a-pond.webp 560w, https://www.grassrootspondandgarden.com/wp-content/uploads/2024/01/Close-up-of-greenery-around-a-pond-300x251.webp 300w" />
      </div>
    </div>
  );
};
export default Favorite;
