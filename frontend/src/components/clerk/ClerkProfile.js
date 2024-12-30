import React, { useState, useEffect } from "react";
import { getClerkProfile, updateClerk } from "../../services/clerkApi";
import "../../assets/css/Clerk/ClerkProfile.css";
import { notifyError, notifySuccess } from "../../utils/notification";


const ClerkProfile = () => {
    const [formData, setFormData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [clerkId, setClerkId] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                    let storedClerkId = sessionStorage.getItem("clerkId");
                    console.log("Clerk ID from session:", storedClerkId);

                    const data = await getClerkProfile(storedClerkId);
                    console.log("Fetched Clerk Profile Data:", data);

                // If clerkId is missing from session, use the API response id
                if (!storedClerkId && data?.id) {
                    storedClerkId = data.id;
                    sessionStorage.setItem("clerkId", storedClerkId);
                }
                setClerkId(storedClerkId);

                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    phone: data.phoneNumber || "",
                    address: data.address || "",
                });
            } catch (error) {
                console.error("Failed to fetch clerk profile:", error);
                notifyError("Failed to load profile.");
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            setIsChanged(JSON.stringify(updated) !== JSON.stringify(formData));
            return updated;
        });
    };

    const handleSave = async () => {
        try {
            console.log("Updating Clerk ID:", clerkId);
            await updateClerk(clerkId, formData);
            notifySuccess("Profile updated successfully.");
            setEditMode(false);
            setIsChanged(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            notifyError("Failed to update profile.");
        }
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="clerk-profile">
            <div className="clerk-profile__header">
                <h2>Clerk Profile</h2>
            </div>
            <div className="clerk-profile__content">
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

export default ClerkProfile;
