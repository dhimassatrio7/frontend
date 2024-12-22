// src/pages/auth/SignIn.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Impor Link
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import { login } from "../../api/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(loginStart());
    try {
      const credentials = { identifier: email, password };
      const data = await login(credentials);

      // Save the JWT token in localStorage
      localStorage.setItem("jwt", data.jwt);
      localStorage.setItem("documentId", data.user.documentId);
      localStorage.setItem("id", data.user.id);
      localStorage.setItem("userRole", data.user.user_role);


      // Dispatch success action with user and token
      dispatch(loginSuccess({ user: data.user, token: data.jwt }));

      console.log("User logged in:", data.user.documentId);

      const userRole = data.user.user_role;
      if (userRole === "Admin") {
        navigate("/dashboard-admin");
      } else if (userRole === "Service Provider") {
        navigate("/dashboard-partner");
      } else if (userRole === "Authenticated") {
        navigate("/customer-profile");
      } else {
        navigate("/home");
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <CardHeader className="font-semibold text-lg text-center">
          Masuk
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email atau Nama Pengguna"
              type="text"
              name="identifier"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
            <Input
              label="Kata Sandi"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
            <Button
              type="submit"
              isDisabled={isLoading}
              className="w-full mt-4"
            >
              {isLoading ? "Sedang masuk..." : "Masuk"}
            </Button>
          </form>
          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}
          <p className="mt-4 text-sm text-center text-gray-600">
            Belum punya akun?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Daftar
            </Link>
          </p>
        </CardBody>
      </Card>
      <div className="absolute top-4 left-4 flex items-center">
        <svg
          className="w-5 h-5 text-blue-500 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7m-9-5v12m0 0H5m7 0h7"
          />
        </svg>
        <Link to="/" className="text-blue-500 hover:underline">
          Beranda
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
