import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    setOpen(false);
    setMobileMenu(false);
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/">
        <h1 className="text-lg md:text-xl font-semibold">
          Finance TrackFi
        </h1>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/dashboard" className="animationStyle">
          Dashboard
        </Link>

        {!currentUser && (
          <Link to="/signin" className="animationStyle">
            Sign in
          </Link>
        )}

        {currentUser && (
          <div className="relative">
            <div
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                className="w-8 h-8 rounded-full"
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="profile"
              />
              <span className="text-sm font-medium truncate max-w-[120px]">
                {currentUser.displayName || currentUser.email}
              </span>
            </div>

            {open && (
              <div className="dropdown-menu">
                <Link to="/profile">
                  <button className="dropdown-btn">Profile</button>
                </Link>

                <button className="dropdown-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="mobile-menu">
          <Link to="/dashboard" onClick={() => setMobileMenu(false)}>
            Dashboard
          </Link>

          {!currentUser && (
            <Link to="/signin" onClick={() => setMobileMenu(false)}>
              Sign in
            </Link>
          )}

          {currentUser && (
            <>
              <Link to="/profile" onClick={() => setMobileMenu(false)}>
                Profile
              </Link>

              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;