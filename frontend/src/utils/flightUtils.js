// Utility function to validate seat allocations
export const validateSeatAllocations = (seatAllocations, totalSeats) => {
    const totalAllocatedSeats = seatAllocations.reduce(
        (sum, allocation) => sum + (parseInt(allocation.availableSeats) || 0),
        0
    );

    if (totalAllocatedSeats !== parseInt(totalSeats)) {
        return `Total allocated seats (${totalAllocatedSeats}) must match total seats (${totalSeats}).`;
    }

    for (const allocation of seatAllocations) {
        if (!allocation.className || !allocation.availableSeats) {
            return "Please fill in all seat allocation details.";
        }
    }

    return null; // Valid allocations
};

// Utility function to validate departure and arrival times
export const validateTimes = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);

    if (departure >= arrival) {
        return "Departure time must be before arrival time.";
    }

    return null; // Valid times
};

// Utility function to format dates
export const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
};
