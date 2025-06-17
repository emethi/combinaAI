// Este arquivo SIMULA um backend. No mundo real, aqui seriam feitas chamadas `fetch` a uma API.

const MOCK_SERVICES = [
    { id: 1, name: "Corte Social", duration: 30, price: "40,00" },
    { id: 2, name: "Barba Terapia", duration: 45, price: "50,00" },
    { id: 3, name: "Corte + Barba", duration: 75, price: "85,00" },
    { id: 4, name: "Pezinho", duration: 15, price: "15,00" },
    { id: 5, name: "Sobrancelha", duration: 20, price: "25,00" },
    { id: 6, name: "Platinado", duration: 120, price: "250,00" }
];

// Simula a busca de horários disponíveis para uma data específica
// No mundo real, o backend faria essa lógica, verificando agendamentos já existentes
const getAvailableTimesForDate = (date) => {
    console.log(`Buscando horários para a data: ${date}`);
    const availableSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    ];
    // Simula alguns horários já ocupados
    return availableSlots.filter(() => Math.random() > 0.3);
};

// --- Funções que serão exportadas e usadas pelo main.js ---

export const api = {
    /**
     * Busca a lista de serviços.
     * @returns {Promise<Array>} Uma promessa que resolve com a lista de serviços.
     */
    getServices: async () => {
        console.log("API: Buscando serviços...");
        // Simula um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log("API: Serviços encontrados.");
        return MOCK_SERVICES;
    },

    /**
     * Busca os horários disponíveis para uma data.
     * @param {string} dateString - A data no formato 'YYYY-MM-DD'.
     * @returns {Promise<Array>} Uma promessa que resolve com a lista de horários.
     */
    getAvailableTimes: async (dateString) => {
        console.log("API: Buscando horários...");
        await new Promise(resolve => setTimeout(resolve, 300));
        const times = getAvailableTimesForDate(dateString);
        console.log("API: Horários encontrados.", times);
        return times;
    },

    /**
     * Envia um novo agendamento.
     * @param {object} bookingData - Os dados do agendamento.
     * @returns {Promise<object>} Uma promessa que resolve com a confirmação.
     */
    submitBooking: async (bookingData) => {
        console.log("API: Enviando agendamento...", bookingData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("API: Agendamento confirmado com sucesso!");
        // No mundo real, o backend retornaria o agendamento salvo com um ID.
        return { success: true, booking: { ...bookingData, id: new Date().getTime() } };
    }
};