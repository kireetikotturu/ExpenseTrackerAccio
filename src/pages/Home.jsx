import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
const Home = () => {
  const { currentUser } = useAuth();
  return (
    <div className="p-4 mt-16 font-medium flex justify-center items-center flex-col">
      {!currentUser && (
        <div className="flex flex-col gap-2 items-center">
          <p>Welcome to Your Personal secure finance tracker</p>
          <Link
            to="/signin"
            className="bg-blue-500 font-medium mt-2 h-auto w-20 text-center rounded-md text-white p-1 hover:bg-blue-400"
          >
            SingIn
          </Link>
        </div>
      )}
      {currentUser && (
        <div className="flex flex-col gap-2 items-center justify-center">
          <p>Welcome {currentUser.displayName || currentUser.email}..!</p>
          <Link
            to="/dashboard"
            className="bg-blue-500 w-auto px-3 font-medium mt-2 h-auto text-center rounded-md text-white p-1 hover:bg-blue-400"
          >
            Go To Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
