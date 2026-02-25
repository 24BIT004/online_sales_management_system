import React, { useState, useEffect } from "react";
import axios from "axios";

import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import img5 from "../assets/img5.png";

import "./CustomerDashboard.css";

const API_GUEST_ORDER = "https://online-sales-management-system.onrender.com/guest-order/";

function CustomerDashboard() {
    const [activeTab, setActiveTab] = useState("home");
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: "",
        customer_email: "",
        product_name: "",
        quantity: 1,
        price_per_unit: "",
        delivery_date: "",
        delivery_address: "",
        payment_method: "mobile_money",
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Payment flow states
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [secretCode, setSecretCode] = useState("");
    const [generatedControlNumber, setGeneratedControlNumber] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentStep, setPaymentStep] = useState("initial");

    // Slider
    const images = [img1, img2, img3, img4, img5];
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setSlide((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [images.length]);

    useEffect(() => {
        if (formData.customer_email?.trim()) {
            fetchRecentOrders();
        }
    }, [formData.customer_email]);

    const fetchRecentOrders = async () => {
        try {
            const res = await axios.get(API_GUEST_ORDER, {
                params: { email: formData.customer_email.trim() },
            });
            setRecentOrders(res.data || []);
        } catch (err) {
            console.error("Failed to fetch recent orders:", err);
            setRecentOrders([]);
        }
    };

    const fetchAllOrders = async () => {
        try {
            const res = await axios.get(API_GUEST_ORDER);
            setAllOrders(res.data || []);
        } catch (err) {
            console.error("Failed to fetch all orders:", err);
            setAllOrders([]);
        }
    };

    useEffect(() => {
        if (activeTab === "order_history") {
            fetchAllOrders();
        }
    }, [activeTab]);

    const generateControlNumber = () => {
        const now = new Date();
        const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        return `CTRL-${datePart}-${randomPart}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errorMessage) setErrorMessage(null);
    };

    const handleProceedToPayment = (e) => {
        e.preventDefault();
        setErrorMessage(null);

        const required = [
            "customer_name",
            "customer_email",
            "product_name",
            "price_per_unit",
            "delivery_date",
            "delivery_address",
        ];

        for (const field of required) {
            if (!formData[field]?.toString().trim()) {
                setErrorMessage("Please complete all required fields.");
                return;
            }
        }

        setActiveTab("payment");
        setPaymentStep("initial");
        setSelectedProvider(null);
        setPhoneNumber("");
        setSecretCode("");
        setGeneratedControlNumber(null);
    };

    const handlePlaceOrder = async () => {
        const payload = {
            customer_name: formData.customer_name.trim(),
            customer_email: formData.customer_email.trim(),
            product_name: formData.product_name.trim(),
            quantity: parseInt(formData.quantity) || 1,
            price_per_unit: parseFloat(formData.price_per_unit) || 0,
            delivery_date: formData.delivery_date || null,
            delivery_address: formData.delivery_address.trim(),
            payment_method: formData.payment_method === "mobile_money" ? "phone" : "control_number",
        };

        try {
            setLoading(true);
            const res = await axios.post(API_GUEST_ORDER, payload);

            setSuccessMessage(`Order #${res.data.id} placed successfully! Thank you 🎉`);
            setTimeout(() => setSuccessMessage(null), 7000);

            setFormData({
                customer_name: formData.customer_name,
                customer_email: formData.customer_email,
                product_name: "",
                quantity: 1,
                price_per_unit: "",
                delivery_date: "",
                delivery_address: "",
                payment_method: "mobile_money",
            });

            setActiveTab("place_order");
            fetchRecentOrders();
            fetchAllOrders();
        } catch (err) {
            setErrorMessage("Unable to place order. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleProviderSelect = (provider) => {
        setSelectedProvider(provider);
        setPaymentStep("enter_details");
    };

    const handleConfirmMobilePayment = () => {
        if (!phoneNumber.trim() || !secretCode.trim()) {
            setErrorMessage("Please enter phone number and PIN.");
            return;
        }
        setPaymentLoading(true);
        setTimeout(() => {
            setPaymentLoading(false);
            setPaymentStep("confirm");
        }, 2800 + Math.random() * 1500);
    };

    const handleGenerateControlNumber = () => {
        setGeneratedControlNumber(generateControlNumber());
        setPaymentStep("confirm");
    };

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    return (
        <div className={`app ${isDarkMode ? "dark-mode" : ""}`}>
            <header className="header">🛒 Online Sales System</header>

            <div className="layout">
                <aside className="sidebar">
                    <h3>Main Menu</h3>
                    <ul className="sidebar-menu">
                        <li
                            className={activeTab === "home" ? "active" : ""}
                            onClick={() => setActiveTab("home")}
                        >
                            🏠 Home
                        </li>
                        <li
                            className={activeTab === "place_order" ? "active" : ""}
                            onClick={() => setActiveTab("place_order")}
                        >
                            📝 Place Order
                        </li>
                        <li
                            className={activeTab === "payment" ? "active" : ""}
                            onClick={() => setActiveTab("payment")}
                        >
                            💳 Payment
                        </li>
                        <li
                            className={activeTab === "about_us" ? "active" : ""}
                            onClick={() => setActiveTab("about_us")}
                        >
                            ℹ️ About Us
                        </li>
                        <li
                            className={activeTab === "order_history" ? "active" : ""}
                            onClick={() => setActiveTab("order_history")}
                        >
                            📜 Order History
                        </li>
                        <li
                            className={activeTab === "help" ? "active" : ""}
                            onClick={() => setActiveTab("help")}
                        >
                            ❓ Help & FAQ
                        </li>
                        <li
                            className={activeTab === "settings" ? "active" : ""}
                            onClick={() => setActiveTab("settings")}
                        >
                            ⚙️ Settings
                        </li>
                    </ul>

                    {activeTab === "place_order" && recentOrders.length > 0 && (
                        <>
                            <h4>Recent Orders</h4>
                            {recentOrders.map((order) => (
                                <div className="order-card" key={order.id}>
                                    <p>
                                        <strong>#{order.id}</strong> – {order.product_name}
                                    </p>
                                    <p>Total: {Number(order.amount).toLocaleString()} TZS</p>
                                </div>
                            ))}
                        </>
                    )}
                </aside>

                <main className="content">
                    {/* HOME */}
                    {activeTab === "home" && (
                        <div className={`fullscreen-page ${isDarkMode ? "dark" : "light"}`}>
                            <div className="slider-wrapper">
                                <img src={images[slide]} alt="Featured" className="slider-image" />
                            </div>
                            <div className="welcome-text">
                                <h1>Welcome to Online Sales System</h1>
                                <p>Shop fast. Shop secure. Shop simple.</p>
                            </div>
                        </div>
                    )}

                    {/* PLACE ORDER */}
                    {activeTab === "place_order" && (
                        <div className="fullscreen-page">
                            {successMessage && (
                                <div className="success-message">{successMessage}</div>
                            )}
                            {errorMessage && <div className="error-message">{errorMessage}</div>}

                            <h2>Place Your Order</h2>

                            <form onSubmit={handleProceedToPayment} className="order-form">
                                <input
                                    name="customer_name"
                                    placeholder="Your Name *"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    name="customer_email"
                                    type="email"
                                    placeholder="Email *"
                                    value={formData.customer_email}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    name="product_name"
                                    placeholder="Product Name *"
                                    value={formData.product_name}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    name="quantity"
                                    type="number"
                                    min="1"
                                    placeholder="Quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                />
                                <input
                                    name="price_per_unit"
                                    type="number"
                                    step="0.01"
                                    placeholder="Price per Unit (TZS) *"
                                    value={formData.price_per_unit}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    name="delivery_date"
                                    type="date"
                                    value={formData.delivery_date}
                                    onChange={handleChange}
                                    required
                                />
                                <textarea
                                    name="delivery_address"
                                    placeholder="Delivery Address *"
                                    value={formData.delivery_address}
                                    onChange={handleChange}
                                    required
                                />
                                <select
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleChange}
                                >
                                    <option value="mobile_money">Mobile Money</option>
                                    <option value="control_number">Control Number</option>
                                </select>

                                <button type="submit" disabled={loading}>
                                    {loading ? "Processing..." : "Continue to Payment"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* PAYMENT */}
                    {activeTab === "payment" && (
                        <div className="fullscreen-page payment-page">
                            <h2>Complete Your Payment</h2>

                            <div className="summary-box">
                                <p>
                                    <strong>Product:</strong> {formData.product_name || "—"}
                                </p>
                                <p>
                                    <strong>Total Amount:</strong>{" "}
                                    {(formData.quantity * formData.price_per_unit || 0).toLocaleString()} TZS
                                </p>
                            </div>

                            {formData.payment_method === "mobile_money" && (
                                <>
                                    {paymentStep === "initial" && (
                                        <div className="provider-selection">
                                            <p>Choose your mobile money provider:</p>
                                            <div className="providers-grid">
                                                <button onClick={() => handleProviderSelect("airtel")}>
                                                    Airtel Money
                                                </button>
                                                <button onClick={() => handleProviderSelect("vodacom")}>
                                                    M-Pesa
                                                </button>
                                                <button onClick={() => handleProviderSelect("tigo")}>
                                                    Tigo Pesa
                                                </button>
                                                <button onClick={() => handleProviderSelect("ttcl")}>
                                                    TTCL Money
                                                </button>
                                                <button onClick={() => handleProviderSelect("halotel")}>
                                                    Halopesa
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {paymentStep === "enter_details" && selectedProvider && (
                                        <div className="payment-form">
                                            <h3>{selectedProvider.toUpperCase()} Payment</h3>
                                            <input
                                                type="tel"
                                                placeholder="Phone Number (e.g. 077x xxx xxx)"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                            <input
                                                type="password"
                                                placeholder="PIN / Secret Code"
                                                value={secretCode}
                                                onChange={(e) => setSecretCode(e.target.value)}
                                            />
                                            <button
                                                onClick={handleConfirmMobilePayment}
                                                disabled={paymentLoading || !phoneNumber.trim() || !secretCode.trim()}
                                            >
                                                {paymentLoading ? "Processing..." : "Confirm Payment"}
                                            </button>
                                        </div>
                                    )}

                                    {paymentStep === "confirm" && (
                                        <div className="success-box">
                                            <h3>Payment Received</h3>
                                            <button
                                                onClick={handlePlaceOrder}
                                                disabled={loading}
                                                className="final-btn"
                                            >
                                                {loading ? "Finalizing..." : "Place Order"}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {formData.payment_method === "control_number" && (
                                <>
                                    {paymentStep === "initial" && (
                                        <div className="control-box">
                                            <p>Click below to receive your payment control number.</p>
                                            <button
                                                onClick={handleGenerateControlNumber}
                                                className="generate-btn"
                                            >
                                                Generate Control Number
                                            </button>
                                        </div>
                                    )}

                                    {paymentStep === "confirm" && generatedControlNumber && (
                                        <div className="success-box">
                                            <h3>Your Control Number</h3>
                                            <p className="big-number">{generatedControlNumber}</p>
                                            <p>Use this number to complete payment through your preferred channel.</p>
                                            <button
                                                onClick={handlePlaceOrder}
                                                disabled={loading}
                                                className="final-btn"
                                            >
                                                {loading ? "Finalizing..." : "Place Order"}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {paymentLoading && (
                                <div className="loading-overlay">Processing payment... ⏳</div>
                            )}
                        </div>
                    )}

                    {/* ORDER HISTORY */}
                    {activeTab === "order_history" && (
                        <div className="fullscreen-page">
                            <h2>Your Order History</h2>
                            {allOrders.length > 0 ? (
                                <div className="orders-list">
                                    {allOrders.map((order) => (
                                        <div className="order-card" key={order.id}>
                                            <div className="order-top">
                                                <span>Order #{order.id}</span>
                                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p><strong>Item:</strong> {order.product_name}</p>
                                            <p><strong>Total:</strong> {Number(order.amount).toLocaleString()} TZS</p>
                                            <p><strong>Status:</strong> {order.is_paid ? "Paid" : "Pending"}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No orders placed yet.</p>
                            )}
                        </div>
                    )}

                    {/* ABOUT US */}
                    {activeTab === "about_us" && (
                        <div className="fullscreen-page about-page">
                            <div className="about-wrapper">
                                <h1>About Online Sales System</h1>

                                <p className="lead-text">
                                    Online Sales System is a modern e-commerce platform that brings fast, secure, and convenient online shopping to customers in Zanzibar, Tanzania, and beyond.
                                </p>

                                <div className="about-block">
                                    <h2>Our Mission</h2>
                                    <p>
                                        We aim to make buying products online simple, reliable, and enjoyable for everyone. Whether you're ordering groceries, electronics, or daily essentials, our platform offers a smooth experience from selection to delivery.
                                    </p>
                                </div>

                                <div className="about-block">
                                    <h2>What We Offer</h2>
                                    <div className="features-grid">
                                        <div className="feature">
                                            <span className="icon">🛒</span>
                                            <h3>Easy Ordering</h3>
                                            <p>Quick guest checkout — no account needed to start shopping.</p>
                                        </div>
                                        <div className="feature">
                                            <span className="icon">📱</span>
                                            <h3>Local Payments</h3>
                                            <p>Support for Airtel Money, M-Pesa, Tigo Pesa, Halopesa, TTCL Money and more.</p>
                                        </div>
                                        <div className="feature">
                                            <span className="icon">🚚</span>
                                            <h3>Reliable Delivery</h3>
                                            <p>Choose your preferred delivery date and address with ease.</p>
                                        </div>
                                        <div className="feature">
                                            <span className="icon">📦</span>
                                            <h3>Order Tracking</h3>
                                            <p>View your full order history anytime with detailed information.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="about-block">
                                    <h2>Built for Zanzibar & Tanzania</h2>
                                    <p>
                                        We understand the needs of customers in our region. That's why we focus on familiar payment methods, clear pricing in Tanzanian Shillings, and an interface that works perfectly on both mobile phones and computers.
                                    </p>
                                </div>

                                <div className="about-closing">
                                    <p>Shop smarter. Live better.</p>
                                    <p className="small">Online Sales System – Serving Zanzibar since 2026</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SETTINGS */}
                    {activeTab === "settings" && (
                        <div className="fullscreen-page settings-page">
                            <h2>Settings</h2>
                            <div className="settings-card">
                                <label className="toggle-label">
                                    <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                                    <span>Dark Mode {isDarkMode ? "On" : "Off"}</span>
                                </label>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <footer className="footer">
                © 2026 Online Sales System – All rights reserved
            </footer>
        </div>
    );
}

export default CustomerDashboard;