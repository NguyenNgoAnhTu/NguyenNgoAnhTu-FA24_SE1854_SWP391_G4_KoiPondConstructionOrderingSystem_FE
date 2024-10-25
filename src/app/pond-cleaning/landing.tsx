import nhatban from "assets/images/nhatban.jpg";

const Landing1 = () => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${nhatban})` }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <div className="relative flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Finest Pond Maintenance & Cleaning In Ann Arbor, Michigan And
          Surrounding Areas
        </h1>
        <p className="mt-4 text-lg md:text-xl lg:text-2xl">
          Keep your pond functioning and looking perfectly all year round with
          pond Maintenance and cleaning services
        </p>
      </div>
    </div>
  );
};

export default Landing1;
