import DropdownUser from "./DropdownUser";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1">
      <div className="flex w-full items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex-grow"></div> {/* Spacer div to push the user area to the right */}
        <div className="flex items-center gap-3 2xsm:gap-7 justify-end">
          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
