// ForgotPasswordForm.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/ForgotPasswordForm.css";

const ForgotPasswordForm = () => {
    const API = process.env.REACT_APP_API_URL; //Use environment variable
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await res.json();
            setLoading(false);

            if (!res.ok) {
                setError(data.message || "Something went wrong");
            } else {
                setMessage("Password updated successfully! You can now login.");
                setEmail("");
                setNewPassword("");
                setTimeout(() => navigate("/auth"), 2000);
            }
        } catch (err) {
            setLoading(false);
            setError("Server error. Try again later.");
        }
    };

    return (
        <div className="forgot-password-page">
            <form className="forgot-password-form" onSubmit={handleSubmit}>
                <h1>Reset Password</h1>

                {error && <p className="error">{error}</p>}
                {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />

                <button type="submit">{loading ? "Resetting..." : "Reset Password"}</button>

                <Link to="/auth" className="back-link">Back to Login</Link>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
