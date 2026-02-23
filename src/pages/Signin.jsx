import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {useState} from 'react'
import { signInWithPopup } from "firebase/auth";
import { provider } from "../firebase/firebase";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleSignin = async (e)=>{
    e.preventDefault()
    try{
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    }catch(error){
      toast.error(error.message)
    }
  }

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
        <h2 className="text-2xl font-semibold text-center mb-6">Signin</h2>
        <form onSubmit={handleSignin}>
          <input
            onChange={(e)=>setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
          />

          <input
            onChange={(e)=>setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
          />

          <button
            type="submit"
            className="w-full cursor-pointer hover:bg-blue-600 bg-blue-500 text-white py-2 rounded mb-4"
          >
            
            Signin
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
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-medium">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
