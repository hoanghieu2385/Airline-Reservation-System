import api from "./api";

export const eticketAPI = {
  getETicketByCode: (ticketCode) => {
      console.log('Searching for ticket:', ticketCode);
      return api.get(`/ETicket/${ticketCode}`);
  }
};
