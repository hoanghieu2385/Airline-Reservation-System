import React, { useEffect } from "react";

const Success = () => {
  useEffect(() => {
    // Redirect to Dashboard after 4 seconds
    const timeout = setTimeout(() => {
      window.location.href = "/user/dashboard";
    }, 4000);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="success-page" style={styles.container}>
      <h1 style={styles.text}>Payment Success!</h1>
      <p style={styles.subtext}>Redirecting to Dashboard...</p>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
    fontFamily: "Arial, sans-serif",
  },
  text: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#4CAF50", // Success color
  },
  subtext: {
    fontSize: "1rem",
    color: "#555",
  },
};

export default Success;
