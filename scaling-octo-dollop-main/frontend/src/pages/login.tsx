import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Login() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      alert("Username and password are required!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: username,
        password,
      });
      

      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error:", error.response.data);
        alert(error.response.data.message || "Login failed.");
      } else {
        console.error("Unexpected error:", error);
        alert("Something went wrong. Try again later.");
      }
    }
  }

  return (
    <div className="h-screen w-screen bg-[#0B1F44] flex justify-center items-center">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-96">
        <h2 className="text-center text-3xl font-semibold mb-8 text-[#0B1F44]">Welcome Back</h2>
        <Input placeholder="Username" reference={usernameRef} />
        <Input placeholder="Password" reference={passwordRef} type="password" />
        <button
          onClick={signin}
          className="w-full mt-6 bg-[#D3AF37] hover:bg-[#c89d2e] cursor-pointer text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
}

function Input({
  placeholder,
  reference,
  type = "text",
}: {
  placeholder: string;
  reference?: any;
  type?: string;
}) {
  return (
    <div className="mb-6">
      <input
        ref={reference}
        placeholder={placeholder}
        type={type}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#D3AF37] transition duration-300"
      />
    </div>
  );
}
