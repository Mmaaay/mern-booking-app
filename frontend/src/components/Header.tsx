import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggenIn } = useAppContext();
  return (
    <div className="bg-blue-800 py-5">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">MernHolidays.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggenIn ? (
            <>
              <Link to="/my-bookings" className="flex items-center text-white px-3 font-bold hover:bg-blue-600">My Booking</Link>
              <Link to="/my-hotels" className="flex items-center text-white px-3 font-bold hover:bg-blue-600">My Hotels</Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex text-l items-center bg-white text-blue-600 px-2 font-bold hover:bg-gray-100 hover:cursor-pointer"
            >
              Sign in
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
