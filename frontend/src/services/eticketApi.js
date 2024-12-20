// src/services/eticketApi.js
import api from "./api";

export const getAllETickets = async () => {
  try {
    const response = await api.get("/ETicket/all"); // endpoint của backend
    return response.data;
  } catch (error) {
    console.error("Error fetching all eTickets:", error);
    throw error;
  }
};

export const getETicketByTicketCode = async (ticketCode) => {
  try {
    const response = await api.get(`/ETicket/${ticketCode}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching eTicket with code ${ticketCode}:`, error);
    throw error;
  }
};

export const updateETicket = async (passengerId, updateData) => {
  try {
    const response = await api.put(`/ETicket/${passengerId}`, updateData);
    return response.data;
  } catch (error) {
    console.error(
      `Error updating eTicket for passenger ID ${passengerId}:`,
      error
    );
    throw error;
  }
};

export const deleteETicket = async (passengerId) => {
  try {
    const response = await api.delete(`/ETicket/${passengerId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting eTicket for passenger ID ${passengerId}:`,
      error
    );
    throw error;
  }
};

export const createETicket = async (createData) => {
  try {
    const response = await api.post("/ETicket", createData);
    return response.data;
  } catch (error) {
    console.error("Error creating new eTicket:", error);
    throw error;
  }
};
