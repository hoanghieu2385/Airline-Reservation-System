import api from "./api";

export const eticketAPI = {
  GetCustomerInfoByReservationCode: (reservationCode) => {
    console.log('Searching for reservation:', reservationCode);
    return api.get(`/ETicket/customerinfo/${reservationCode}`);
  },
  GetAllETickets: (all) => {
    console.log('Searching for all ticket:', all);
    return api.get(`/ETicket/${all}`);
  },
};
