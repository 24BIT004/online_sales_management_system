import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaArrowLeft } from "react-icons/fa";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://online-sales-management-system.onrender.com";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            await axios.post(
                `${API_BASE_URL}/api/register/`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 60000,
                }
            );

            alert("Registration successful!");
            navigate("/login");
        } catch (err) {
            if (err.code === "ECONNABORTED") {
                setError("Request timeout. Check internet/backend and try again.");
            } else if (err.response && err.response.data) {
                const data = err.response.data;
                const message =
                    data.message ||
                    data.detail ||
                    data.non_field_errors?.[0] ||
                    data.username?.[0] ||
                    data.email?.[0] ||
                    data.password?.[0] ||
                    data.confirm_password?.[0] ||
                    `Registration failed (${err.response.status}).`;
                setError(message);
            } else {
                setError("Network/CORS error. Check backend deployment and CORS settings.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                {/* Back to Login Button */}
                <div
                    onClick={() => navigate("/login")}
                    style={styles.backButton}
                >
                    <FaArrowLeft style={{ marginRight: "5px" }} /> Back to Login
                </div>

                <h2 style={styles.title}>Create Account</h2>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputBox}>
                        <FaUser style={styles.icon} />
                        <input
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputBox}>
                        <FaEnvelope style={styles.icon} />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputBox}>
                        <FaLock style={styles.icon} />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputBox}>
                        <FaLock style={styles.icon} />
                        <input
                            name="confirm_password"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p style={styles.linkText}>
                    Already have an account?{" "}
                    <Link to="/" style={styles.link}>
                        Login
                    </Link>
                </p>
            </div>

            <footer style={styles.footer}>
                © 2026 Online Sales Management System
            </footer>
        </div>
    );
};

const styles = {
    page: {
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #2563eb, #1e40af)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Segoe UI', sans-serif",
    },
    card: {
        background: "#fff",
        padding: "40px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease",
    },
    backButton: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        color: "#2563eb",
        fontWeight: "bold",
        marginBottom: "15px",
        fontSize: "14px",
    },
    title: {
        textAlign: "center",
        marginBottom: "10px",
    },
    inputBox: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "15px",
        padding: "10px",
        transition: "all 0.2s ease",
    },
    icon: {
        marginRight: "10px",
        color: "#555",
    },
    input: {
        border: "none",
        outline: "none",
        width: "100%",
        fontSize: "15px",
    },
    button: {
        width: "100%",
        padding: "12px",
        background: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        marginTop: "10px",
    },
    linkText: {
        textAlign: "center",
        marginTop: "15px",
        fontSize: "14px",
        color: "#555",
    },
    link: {
        color: "#16a34a",
        textDecoration: "none",
        fontWeight: "bold",
    },
    error: {
        color: "red",
        textAlign: "center",
        marginBottom: "10px",
    },
    footer: {
        marginTop: "25px",
        color: "#e5e7eb",
        fontSize: "13px",
    },
};

export default Register;
