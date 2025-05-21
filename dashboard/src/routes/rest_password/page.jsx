import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProviderContext } from "../../contexts/theme-context";
import { AuthContext } from "../../contexts/AuthContext";

const ResetPassword = () => {
    const { theme } = useContext(ThemeProviderContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useContext(AuthContext);

    const handleReset = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage("");
        setLoading(true);

        try {
            await resetPassword(email);
            setMessage("Password reset instructions have been sent to your email.");
        } catch (err) {
            setError(err.message || "Failed to send reset instructions. Try again.");
        }

        setLoading(false);
    };

    return (
        <div className={`flex min-h-screen flex-col items-center justify-center p-4 ${theme.startsWith("dark") ? "bg-gray-900" : "bg-gray-100"}`}>
            <div className={`w-full max-w-md rounded-lg p-8 shadow-md ${theme.startsWith("dark") ? "bg-gray-800" : "bg-white"}`}>
                <h1 className={`mb-2 text-3xl font-bold ${theme.startsWith("dark") ? "text-green-300" : "text-gray-800"}`}>Reset Password</h1>
                <p className={`mb-6 ${theme.startsWith("dark") ? "text-gray-300" : "text-gray-600"}`}>
                    Enter your email and we'll send instructions to reset your password.
                </p>

                {error && <div className="alert alert-danger mb-4 text-red-500">{error}</div>}
                {message && <div className="alert alert-success mb-4 text-green-500">{message}</div>}

                <form onSubmit={handleReset} className="space-y-6">
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
                            required
                            className={`w-full rounded-lg border px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${theme.startsWith("dark") ? "border-gray-600 bg-gray-700 text-gray-100" : ""}`}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Back to login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
