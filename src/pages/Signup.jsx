import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { provider } from "../firebase/firebase";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
   const navigate = useNavigate();

  const onFormSubmit = async (e) => {
    e.preventDefault();
    await signupWithEmailAndPassword();
  };

  const signupWithEmailAndPassword = async () => {
    //Authenticate the user
    if(password!==confirmPassword){
      toast.error('Password do not match')
      return;
    }
    try{
      const userCredentail = await createUserWithEmailAndPassword(auth, email, password)
      toast.success('Account created successfully!')
      navigate('/dashboard');
    }catch(error){
      toast.error(error.message)
    }

    
  };

  const handleGoogleSignup = async () => {
  try {
    await signInWithPopup(auth, provider);
    toast.success("Signed in with Google!");
    navigate("/dashboard");
  } catch (error) {
    toast.error(error.message);
  }
};

  return (
    <div className="min-h-screen mt-16 flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={onFormSubmit}>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="w-full p-2 mb-4 border rounded"
          />

          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
          />

          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
          />

          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm Password"
            className="w-full p-2 mb-4 border rounded"
          />

          <button
            type="submit"
            className="w-full cursor-pointer hover:bg-blue-600 bg-blue-500 text-white py-2 rounded mb-4"
          >
            Sign Up
          </button>

          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full border cursor-pointer border-gray-300 py-2 rounded mb-4 hover:bg-gray-100"
          >
            Continue with Google
          </button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-500 font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
