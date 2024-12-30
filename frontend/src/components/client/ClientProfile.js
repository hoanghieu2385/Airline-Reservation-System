import React, { useState } from "react";
import { updateUser } from "../../services/clientApi";
import "../../assets/css/ClientDashboard/ClientProfile.css";

const UserProfile = ({ profile }) => {
    const [formData, setFormData] = useState({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email,
        phone: profile.phone || "",
        address: profile.address || "",
        skyMiles: profile.skyMiles || 0,
    });

    const [editMode, setEditMode] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            setIsChanged(JSON.stringify(updated) !== JSON.stringify(profile));
            return updated;
        });
    };

    const handleSave = async () => {
        try {
            const userId = profile.id;
            await updateUser(userId, formData);
            alert("Profile updated successfully.");
            setEditMode(false);
            setIsChanged(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            alert("Failed to update profile.");
        }
    };

    return (
        <div className="flight-profile">
            <div className="flight-profile__header">
                <h2>My Profile</h2>
            </div>
            <div className="flight-profile__content">
                <div className="profile__field">
                    <div className="profile__name-container">
                        <div>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            />
                        </div>
                    </div>
                </div>
                <div className="profile__field">
                    <div className="profile__contact-container">
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>
                        <div>
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!editMode}
                            />
                        </div>
                    </div>
                </div>
                <div className="profile__field">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                </div>
                <div className="profile__field">
                    <label htmlFor="skyMiles">Sky Miles: 
                        <span id="skyMiles" className="profile__value">{formData.skyMiles}</span>
                    </label>
                </div>
            </div>
            <div className="profile__actions">
                {editMode ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={!isChanged}
                            className="profile__save-btn"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditMode(false)}
                            className="profile__cancel-btn"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button onClick={() => setEditMode(true)} className="profile__edit-btn">
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserProfile;