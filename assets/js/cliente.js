const API_CLIENTES_BASE_URL = "https://api.franciscosensaulas.com/api/v1/mercearia/clientes";


const tbodyClientes = document.getElementById("tbody-clientes");


function carregarClientes() {
    fetch(API_CLIENTES_BASE_URL)
        .then((response) => response.json())
        .then((clientes) => {
            tbodyClientes.innerHTML = "";

            for (let i = 0; i < clientes.length; i++) {
                const cliente = clientes[i];
                criarLinha(cliente);
            }
        })
        .catch(error => {
            console.log("Erro ao carregar clientes:", error);
        });
}

function criarLinha(cliente) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${cliente.id}</td>
        <td>${cliente.nome}</td>
        <td>${cliente.email}</td>
        <td><span class="badge neutral">${cliente.status || "Sem status"}</span></td>
        <td>
          <div class="table-actions">
            <button nclick="editar(this)" class="btn-action edit">Editar</button>
            <button class="btn-action delete">Excluir</button>
          </div>
        </td>
    `;

    tbodyClientes.appendChild(tr);
}

carregarClientes();


