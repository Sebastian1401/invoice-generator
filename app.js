document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const btnAddClient = document.getElementById('btn-add-client');
    const btnCancelClient = document.getElementById('btn-cancel-client');
    const clientModal = document.getElementById('client-modal');
    const newClientForm = document.getElementById('new-client-form');
    const clientSelect = document.getElementById('client-select');
    const totalValueInput = document.getElementById('total-value');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomValue = document.getElementById('zoom-value');
    const invoiceDocument = document.getElementById('invoice-document');
    
    // Form Inputs
    const invoiceDateInput = document.getElementById('invoice-date');
    const jobConceptInput = document.getElementById('job-concept');

    // Preview Elements
    const previewDate = document.getElementById('preview-date');
    const previewClientName = document.getElementById('preview-client-name');
    const previewClientNit = document.getElementById('preview-client-nit');
    const previewTotalValue = document.getElementById('preview-total-value');
    const previewWordsValue = document.getElementById('preview-words-value');
    const previewConcept = document.getElementById('preview-concept');

    // Zoom Logic
    zoomSlider.addEventListener('input', (e) => {
        const scale = e.target.value;
        zoomValue.textContent = `${Math.round(scale * 100)}%`;
        invoiceDocument.style.transform = `scale(${scale})`;
    });

    // Format number with dots and update preview in real-time
    totalValueInput.addEventListener('input', (e) => {
        let rawValue = e.target.value.replace(/\D/g, '');
        
        if (rawValue !== '') {
            e.target.value = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        } else {
            e.target.value = '';
        }

        const numValue = parseInt(rawValue) || 0;
        
        previewTotalValue.textContent = e.target.value || '0';
        previewWordsValue.textContent = numberToSpanishWords(numValue);
    });

    // Date Logic (Format: DD DE MES DE YYYY)
    invoiceDateInput.addEventListener('change', (e) => {
        if (!e.target.value) {
            previewDate.textContent = '[FECHA]';
            return;
        }
        
        const [year, month, day] = e.target.value.split('-');
        const months = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
        
        previewDate.textContent = `${day} DE ${months[parseInt(month) - 1]} DE ${year}`;
    });

    // Client Selection Logic
    clientSelect.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        
        if (selectedOption.value) {
            previewClientName.textContent = selectedOption.dataset.name;
            previewClientNit.textContent = selectedOption.dataset.nit;
        } else {
            previewClientName.textContent = '[NOMBRE DEL CLIENTE O EMPRESA]';
            previewClientNit.textContent = '[NIT]';
        }
    });

    // Concept Logic
    jobConceptInput.addEventListener('input', (e) => {
        previewConcept.textContent = e.target.value || '[concepto del trabajo]';
    });

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
            
            clientSelect.dispatchEvent(new Event('change'));
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

// --- Utilities ---
function numberToSpanishWords(num) {
    if (num === 0) return 'cero pesos';

    function unidades(n) {
        switch (n) {
            case 1: return 'un'; case 2: return 'dos'; case 3: return 'tres';
            case 4: return 'cuatro'; case 5: return 'cinco'; case 6: return 'seis';
            case 7: return 'siete'; case 8: return 'ocho'; case 9: return 'nueve';
            default: return '';
        }
    }

    function decenas(n) {
        const dec = Math.floor(n / 10);
        const uni = n - (dec * 10);
        switch (dec) {
            case 1:
                switch (uni) {
                    case 0: return 'diez'; case 1: return 'once'; case 2: return 'doce';
                    case 3: return 'trece'; case 4: return 'catorce'; case 5: return 'quince';
                    default: return 'dieci' + unidades(uni).toLowerCase();
                }
            case 2: return uni === 0 ? 'veinte' : 'veinti' + unidades(uni).toLowerCase();
            case 3: return uni === 0 ? 'treinta' : 'treinta y ' + unidades(uni);
            case 4: return uni === 0 ? 'cuarenta' : 'cuarenta y ' + unidades(uni);
            case 5: return uni === 0 ? 'cincuenta' : 'cincuenta y ' + unidades(uni);
            case 6: return uni === 0 ? 'sesenta' : 'sesenta y ' + unidades(uni);
            case 7: return uni === 0 ? 'setenta' : 'setenta y ' + unidades(uni);
            case 8: return uni === 0 ? 'ochenta' : 'ochenta y ' + unidades(uni);
            case 9: return uni === 0 ? 'noventa' : 'noventa y ' + unidades(uni);
            case 0: return unidades(uni);
        }
    }

    function centenas(n) {
        const cen = Math.floor(n / 100);
        const dec = n - (cen * 100);
        switch (cen) {
            case 1: return dec > 0 ? 'ciento ' + decenas(dec) : 'cien';
            case 2: return 'doscientos ' + decenas(dec);
            case 3: return 'trescientos ' + decenas(dec);
            case 4: return 'cuatrocientos ' + decenas(dec);
            case 5: return 'quinientos ' + decenas(dec);
            case 6: return 'seiscientos ' + decenas(dec);
            case 7: return 'setecientos ' + decenas(dec);
            case 8: return 'ochocientos ' + decenas(dec);
            case 9: return 'novecientos ' + decenas(dec);
            case 0: return decenas(dec);
        }
    }

    function miles(n) {
        const mil = Math.floor(n / 1000);
        const resto = n - (mil * 1000);
        const strMil = mil === 0 ? '' : (mil === 1 ? 'mil' : centenas(mil) + ' mil');
        return (strMil + ' ' + centenas(resto)).trim();
    }

    function millones(n) {
        const millon = Math.floor(n / 1000000);
        const resto = n - (millon * 1000000);
        if (millon === 0) return miles(resto);
        
        const de = resto === 0 ? ' de' : '';
        const strMillon = millon === 1 ? 'un millón' + de : centenas(millon) + ' millones' + de;
        return (strMillon + ' ' + miles(resto)).trim();
    }

    return millones(num) + ' pesos';
}