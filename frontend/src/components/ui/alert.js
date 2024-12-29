import React from "react";
import PropTypes from "prop-types";

const Alert = ({ variant, className, children }) => {
  const variantStyles = {
    success: "bg-green-100 text-green-800 border-green-300",
    destructive: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };

  return (
    <div
      className={`p-4 border rounded ${variantStyles[variant] || ""} ${className}`}
    >
      {children}
    </div>
  );
};

Alert.propTypes = {
  variant: PropTypes.oneOf(["success", "destructive", "info", "warning"]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Alert.defaultProps = {
  variant: "info",
  className: "",
};

export default Alert;
