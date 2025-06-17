import { api } from './api.js';

// ---- Estado da Aplicação ----
// Guarda as seleções do usuário
const appState = {
    selectedService: null,
    selectedDate: null,
    selectedTime: null,
};

// ---- Seletores de Elementos do DOM ----
const servicesListEl = document.getElementById('services-list');
const datePickerEl = document.getElementById('date-picker');
const timeSlotsEl = document.getElementById('time-slots');
const bookingFormEl = document.getElementById('booking-form');
const confirmationModalEl = document.getElementById('confirmation-modal');

const steps = {
    step1: document.getElementById('step-1'),
    step2: document.getElementById('step-2'),
    step3: document.getElementById('step-3'),
};

// ---- Funções de Renderização ----

/** Renderiza os cartões de serviço na tela */
const renderServices = (services) => {
    servicesListEl.innerHTML = ''; // Limpa o loader
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.dataset.serviceId = service.id;
        card.innerHTML = `
            <h5>${service.name}</h5>
            <div class="service-info">
                <span>Duração: ${service.duration} min</span>
                <span>R$ ${service.price}</span>
            </div>
        `;
        card.addEventListener('click', () => handleServiceSelection(service, card));
        servicesListEl.appendChild(card);
    });
};

/** Renderiza os horários disponíveis */
const renderTimeSlots = (times) => {
    timeSlotsEl.innerHTML = '';
    if (times.length === 0) {
        timeSlotsEl.innerHTML = '<p>Nenhum horário disponível para esta data. Por favor, escolha outra.</p>';
        return;
    }
    times.forEach(time => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.textContent = time;
        slot.addEventListener('click', () => handleTimeSelection(time, slot));
        timeSlotsEl.appendChild(slot);
    });
};

// ---- Funções de Manipulação de Eventos (Handlers) ----

/** Lida com a seleção de um serviço */
const handleServiceSelection = (service, card) => {
    appState.selectedService = service;

    // Atualiza a UI para refletir a seleção
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    // Avança para o próximo passo
    showStep('step2');
    console.log('Serviço selecionado:', appState.selectedService);
};

/** Lida com a mudança de data */
const handleDateChange = async (event) => {
    const date = event.target.value;
    if (!date) return;

    appState.selectedDate = date;
    timeSlotsEl.innerHTML = '<div class="loader"></div>';
    
    const availableTimes = await api.getAvailableTimes(date);
    renderTimeSlots(availableTimes);
    console.log('Data selecionada:', appState.selectedDate);
};

/** Lida com a seleção de um horário */
const handleTimeSelection = (time, slot) => {
    appState.selectedTime = time;

    // Atualiza UI
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');

    // Avança para o passo final
    showStep('step3');
    console.log('Horário selecionado:', appState.selectedTime);
};

/** Lida com o envio do formulário de agendamento */
const handleBookingSubmit = async (event) => {
    event.preventDefault();
    const clientName = document.getElementById('client-name').value;
    const clientPhone = document.getElementById('client-phone').value;

    if (!clientName || !clientPhone) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const bookingData = {
        serviceId: appState.selectedService.id,
        date: appState.selectedDate,
        time: appState.selectedTime,
        clientName,
        clientPhone,
    };
    
    const button = event.target.querySelector('button');
    button.disabled = true;
    button.textContent = 'Agendando...';

    const response = await api.submitBooking(bookingData);

    button.disabled = false;
    button.textContent = 'Confirmar Agendamento';

    if (response.success) {
        showConfirmation(bookingData);
    } else {
        alert('Ocorreu um erro ao agendar. Tente novamente.');
    }
};

// ---- Funções de Controle da UI ----

/** Mostra um passo específico do agendador e esconde os outros */
const showStep = (stepToShow) => {
    Object.values(steps).forEach(stepEl => stepEl.classList.add('hidden'));
    steps[stepToShow].classList.remove('hidden');
    steps[stepToShow].scrollIntoView({ behavior: 'smooth', block: 'center' });
};

/** Mostra o modal de confirmação */
const showConfirmation = (bookingData) => {
    const detailsEl = document.getElementById('confirmation-details');
    detailsEl.innerHTML = `
        <strong>Serviço:</strong> ${appState.selectedService.name}<br>
        <strong>Data:</strong> ${new Date(bookingData.date + 'T00:00:00-03:00').toLocaleDateString('pt-BR')}<br>
        <strong>Horário:</strong> ${bookingData.time}
    `;
    confirmationModalEl.classList.remove('hidden');
};

/** Reseta o fluxo de agendamento */
const resetScheduler = () => {
    appState.selectedService = null;
    appState.selectedDate = null;
    appState.selectedTime = null;

    bookingFormEl.reset();
    datePickerEl.value = '';
    
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    
    showStep('step1');
    confirmationModalEl.classList.add('hidden');
    timeSlotsEl.innerHTML = '';
};

// ---- Função de Inicialização ----

/** Inicializa a aplicação */
const init = async () => {
    // Carrega os serviços iniciais
    const services = await api.getServices();
    renderServices(services);

    // Configura os event listeners
    datePickerEl.addEventListener('change', handleDateChange);
    bookingFormEl.addEventListener('submit', handleBookingSubmit);
    
    // Seta a data mínima para hoje
    datePickerEl.min = new Date().toISOString().split("T")[0];

    // Listeners do modal
    confirmationModalEl.querySelector('.close-button').addEventListener('click', resetScheduler);
};

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);