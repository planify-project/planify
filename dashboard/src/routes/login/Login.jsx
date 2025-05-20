import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeProviderContext } from "../../contexts/theme-context";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Login = () => {
    const { login, loginWithGoogle, loginWithFacebook } = useContext(AuthContext);
    const { theme } = useContext(ThemeProviderContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Login failed");
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate("/dashboard");
        } catch (err) {
            setError("Google login failed");
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await loginWithFacebook();
            navigate("/dashboard");
        } catch (err) {
            setError("Facebook login failed");
        }
    };

    return (
        <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${theme.startsWith("dark") ? "bg-gray-900" : "bg-gray-100"}`}>
            <div className={`w-full max-w-md rounded-lg p-8 shadow-md ${theme.startsWith("dark") ? "bg-gray-800" : "bg-white"}`}>
                <h1 className={`mb-2 text-3xl font-bold ${theme.startsWith("dark") ? "text-green-300" : "text-gray-800"}`}>Login</h1>
                <p className={`mb-6 ${theme.startsWith("dark") ? "text-gray-300" : "text-gray-600"}`}>Sign in to your account</p>

                {error && <div className="mb-4 text-red-500">{error}</div>}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className={`mb-2 block text-sm font-medium ${theme.startsWith("dark") ? "text-gray-200" : "text-gray-700"}`}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${theme.startsWith("dark") ? "border-gray-600 bg-gray-700 text-gray-100" : ""}`}
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className={`mb-2 block text-sm font-medium ${theme.startsWith("dark") ? "text-gray-200" : "text-gray-700"}`}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${theme.startsWith("dark") ? "border-gray-600 bg-gray-700 text-gray-100" : ""}`}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <div className="flex items-center justify-between">
                        <Link
                            to="/reset-password"
                            className="font-semibold text-blue-600 hover:text-blue-800"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </form>

                <div className="mt-6 space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                            theme.startsWith("dark") ? "bg-white text-black hover:bg-gray-200" : "border border-gray-300 hover:bg-gray-100"
                        } `}
                    >
                        <FcGoogle size={20} /> Continue with Google
                    </button>
                    <button
                        onClick={handleFacebookLogin}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                        <FaFacebook size={20} /> Continue with Facebook
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
