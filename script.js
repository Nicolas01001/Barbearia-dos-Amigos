// Dados de Login dos Barbeiros
const validBarbers = {
    'João': 'Jota01',
    'Miguel': 'Mjuan02',
    'Japa': 'Japa03',
    'Henrique': 'Henri04',
    'Pinguin' : 'Ping05',
    'Careca' : 'Care06',
};

// Credenciais do Admin
const adminCredentials = {
    username: 'admin',
    password: 'Henriquebarber'
};

// Carregar clientes do localStorage
let allClients = JSON.parse(localStorage.getItem('clients')) || [];

// Carrega os clientes ao acessar a página do ADM
if (window.location.pathname.includes('admin.html')) {
    updateAdminTable();
}

// Login dos Barbeiros
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const barberName = document.getElementById('barberName').value;
    const password = document.getElementById('password').value;

    if (validBarbers[barberName] === password) {
        localStorage.setItem('barberName', barberName);
        window.location.href = 'barbearia.html';
    } else {
        document.getElementById('errorMessage').innerText = 'Nome ou senha inválidos!';
    }
});

// Login do Administrador
document.getElementById('adminLoginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;

    if (username === adminCredentials.username && password === adminCredentials.password) {
        window.location.href = 'admin.html';
    } else {
        document.getElementById('adminErrorMessage').innerText = 'Usuário ou senha inválidos!';
    }
});

// Adiciona cliente à tabela do barbeiro
document.getElementById('clientForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const clientName = document.getElementById('clientName').value;
    const price = parseFloat(document.getElementById('price').value);
    const service = document.getElementById('service').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const barberName = localStorage.getItem('barberName');

    if (!isNaN(price) && price > 0) {
        const newClient = { barberName, clientName, price, service, paymentMethod };
        allClients.push(newClient);
        localStorage.setItem('clients', JSON.stringify(allClients));
        updateClientTable();
        updateAdminTable();  // Atualiza tabela do ADM
        document.getElementById('clientForm').reset();
    } else {
        alert('Por favor, insira um preço válido!');
    }
});

// Atualiza a tabela do barbeiro
function updateClientTable() {
    const tableBody = document.getElementById('clientTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    const barberName = localStorage.getItem('barberName');

    allClients.filter(client => client.barberName === barberName).forEach(client => {
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).innerText = client.clientName;
        newRow.insertCell(1).innerText = `R$ ${client.price.toFixed(2)}`;
        newRow.insertCell(2).innerText = client.service; // Exibe o serviço
        newRow.insertCell(3).innerText = client.paymentMethod; // Exibe o método de pagamento
        const actionsCell = newRow.insertCell(4);
        
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Remover';
        deleteButton.onclick = () => {
            allClients = allClients.filter(c => c !== client);
            localStorage.setItem('clients', JSON.stringify(allClients));
            updateClientTable();
            updateAdminTable();  // Atualiza tabela do ADM
        };
        actionsCell.appendChild(deleteButton);
    });
}

// Atualiza a tabela do ADM
function updateAdminTable() {
    const adminTableBody = document.getElementById('adminTable').getElementsByTagName('tbody')[0];
    adminTableBody.innerHTML = '';

    const totalsByBarber = {};
    const fragment = document.createDocumentFragment();

    allClients.forEach(client => {
        const newRow = document.createElement('tr');
        newRow.insertCell(0).innerText = client.barberName;
        newRow.insertCell(1).innerText = client.clientName;
        newRow.insertCell(2).innerText = `R$ ${client.price.toFixed(2)}`;
        newRow.insertCell(3).innerText = client.service; // Exibe o serviço
        newRow.insertCell(4).innerText = client.paymentMethod; // Exibe o método de pagamento

        fragment.appendChild(newRow);

        if (!totalsByBarber[client.barberName]) {
            totalsByBarber[client.barberName] = 0;
        }
        totalsByBarber[client .barberName] += client.price;
    });

    adminTableBody.appendChild(fragment);
    
    // Aqui você pode adicionar lógica para exibir totais por barbeiro, se necessário
}   