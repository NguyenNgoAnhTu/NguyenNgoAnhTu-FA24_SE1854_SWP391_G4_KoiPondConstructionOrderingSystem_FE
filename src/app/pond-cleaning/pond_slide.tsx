import Slider from "react-slick";
import Typography from "components/typography/typography";
import EventImg_1 from "assets/images/average-pond-maintenance.webp";
import EventImg_2 from "assets/images/Moms-pond.png";
import EventImg_3 from "assets/images/high-end-pond-maintenance.webp";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./pond_slide.css";
import { useState, useEffect } from "react";
import FormCleaning from "./form_cleaning";

interface PondConfig {
  serviceCategoryId: number,
  type: string,
  cost: number,
  description: string,
  note: string
}

const Pond_slide = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blog, setBlog] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [categoryType, setCategoryType] = useState<string | null>(null);

  const handleOpen = (id: number, type: string) => {
    setSelectedServiceId(id); // Set the selected serviceCategoryId
    setCategoryType(type);
    setShowPopup(true); // Show the popup
    
  };
  const images = [EventImg_1, EventImg_2, EventImg_3];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/service-categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}. ${errorText}`
          );
        }

        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div id="event" className="w-full h-auto bg-white z-50">
      <div className="w-full h-auto flex flex-col items-center gap-20 phone:gap-[30px] pb-7 phone:pb-6">
        <div className="flex gap-3 mt-[100px] phone:mt-[30px]">
          <Typography
            variant={"h1"}
            color={"black-06"}
            fontWeight={"bold"}
            className="text-black-06 phone:!text-[24px]"
          >
            Pond Maintenance & Cleaning Prices In Ann Arbor
          </Typography>
        </div>

        <Slider {...settings} className="w-full mx-auto mt-[50px]">
          {blog.map((data: PondConfig,index:any) => (
            <a
              onClick={() => handleOpen(data.serviceCategoryId, data.type)} // Pass the id and type to handleOpen
              key={data.serviceCategoryId}
              className="bg-white flex flex-col items-center gap-10 w-full rounded-3xl shadow-md hover:opacity-60"
            >
              <div className="w-full">
                <img
                  src={images[index % images.length]}
                  alt=""
                  className="w-full h-[300px] object-cover rounded-t-3xl"
                />
              </div>

              <div className="flex justify-center -mt-16">
                <div className="bg-[#EBF8F2] text-[#076839] text-[24px] font-bold rounded-full w-[80px] h-[80px] flex items-center justify-center">
                  {data.cost}
                </div>
              </div>

              <div className="text-center px-5">
                <Typography
                  variant={"medium"}
                  fontWeight={"bold"}
                  className="text-[24px]"
                >
                  {data.type}
                </Typography>
                <Typography
                  variant={"small"}
                  className="text-gray-600 mt-2 text-sm"
                >
                  {data.description}
                </Typography>
                <Typography
                  variant={"small"}
                  fontWeight={"bold"}
                  className="text-gray-800 mt-4"
                >
                  {data.note}
                </Typography>
              </div>
            </a>
          ))}
        </Slider>
      </div>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div>
            <FormCleaning 
              onClose={() => setShowPopup(false)} 
              serviceCategoryId={selectedServiceId || 0}
              categoryType={categoryType || ''}
            />
          </div>
        </div>
      )}
    </div>
  );
};
  
export default Pond_slide;
