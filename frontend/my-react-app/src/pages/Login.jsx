import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://online-sales-management-system.onrender.com";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);


        try {
            const response = await axios.post(`${API_BASE_URL}/login/`, {
                username,
                password,
            });

            alert("Login successful!");

            // ✅ Redirect to Customer Dashboard
            navigate("/Dashboard");

        } catch (err) {
            if (err.response && err.response.data) {
                const data = err.response.data;
                const message =
                    data.detail ||
                    data.non_field_errors?.[0] ||
                    data.username?.[0] ||
                    data.password?.[0] ||
                    "Invalid username or password";
                setError(message);
            } else {
                setError("Server error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Login to continue</p>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputBox}>
                        <FaUser style={styles.icon} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputBox}>
                        <FaLock style={styles.icon} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p style={styles.linkText}>
                    Don’t have an account?{" "}
                    <Link to="/register" style={styles.link}>
                        Register
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
    title: {
        textAlign: "center",
        marginBottom: "5px",
    },
    subtitle: {
        textAlign: "center",
        color: "#555",
        marginBottom: "20px",
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
        background: "#2563eb",
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
        color: "#2563eb",
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

export default Login;
