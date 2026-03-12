document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnAddClient = document.getElementById('btn-add-client');
    const btnCancelClient = document.getElementById('btn-cancel-client');
    const clientModal = document.getElementById('client-modal');
    const newClientForm = document.getElementById('new-client-form');
    const clientSelect = document.getElementById('client-select');

    // Load clients on startup
    loadClients();

    // Open Modal
    btnAddClient.addEventListener('click', () => {
        clientModal.classList.remove('hidden');
    });

    // Close Modal
    btnCancelClient.addEventListener('click', () => {
        closeModal();
    });

    // Save Client
    newClientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('new-client-name').value.trim();
        const nit = document.getElementById('new-client-nit').value.trim();

        if (name && nit) {
            saveClient({ name, nit });
            closeModal();
            loadClients(); 
            
            clientSelect.value = nit; 
        }
    });

    // --- Helper Functions ---

    function closeModal() {
        clientModal.classList.add('hidden');
        newClientForm.reset();
    }

    function saveClient(client) {
        const existingClients = JSON.parse(localStorage.getItem('clients')) || [];
        
        // Prevent duplicates by checking the NIT
        const index = existingClients.findIndex(c => c.nit === client.nit);
        if (index === -1) {
            existingClients.push(client);
        } else {
            existingClients[index] = client;
        }
        
        localStorage.setItem('clients', JSON.stringify(existingClients));
    }

    function loadClients() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        
        clientSelect.innerHTML = '<option value="">-- Select a saved client --</option>';
        
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.nit; 
            option.textContent = `${client.name} - NIT: ${client.nit}`;
            
            option.dataset.name = client.name;
            option.dataset.nit = client.nit;
            
            clientSelect.appendChild(option);
        });
    }
});