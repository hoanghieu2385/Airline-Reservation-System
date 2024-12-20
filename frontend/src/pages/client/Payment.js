import React, { useState, useEffect } from "react";
import "../../assets/css/Payment.css";

const PaymentPage = () => {
  const [tripDetails, setTripDetails] = useState({});
  const [contactInfo, setContactInfo] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    try {
      // Fetch data from localStorage
      const storedData = localStorage.getItem("checkoutData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const { baggagePrice, totalPrice, contactInfo } = parsedData;

        // Update state with validated data
        setTripDetails({
          baggagePrice: baggagePrice || 0,
        });
        setContactInfo(contactInfo || {});
        setTotalPrice(totalPrice || 0);
      } else {
        console.error("No data found in localStorage for 'tripDetails'");
      }
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
    }
  }, []);

  const paymentMethods = [
    { id: "wechat", label: "WeChat Pay" },
    { id: "credit", label: "International credit or debit card" },
    { id: "clicktopay", label: "Click to Pay" },
    { id: "paypal", label: "PayPal" },
    { id: "googlepay", label: "Google Pay" },
    { id: "unionpay", label: "UnionPay" },
    { id: "alipay", label: "Alipay" },
  ];

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-methods">
          <h3>Select your preferred payment method</h3>
          <div className="payment-methods-list">
            {paymentMethods.map((method) => (
              <div key={method.id} className="payment-method-box">
                <input
                  type="radio"
                  id={method.id}
                  name="payment"
                  value={method.id}
                />
                <label htmlFor={method.id}>{method.label}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="trip-details">
          <h3>Trip details</h3>
          <p>
            <strong>Baggage Price:</strong> {tripDetails.baggagePrice} VND
          </p>
          <h4>Total Price</h4>
          <p className="total-price">{totalPrice} VND</p>

          <h4>Contact Information</h4>
          <p>
            <strong>Name:</strong> {contactInfo.firstName} {contactInfo.lastName}
          </p>
          <p>
            <strong>Phone:</strong> {contactInfo.phone}
          </p>
          <p>
            <strong>Email:</strong> {contactInfo.email}
          </p>
          <p>
            <strong>Age:</strong> {contactInfo.age}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
