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
        <td>
          <div class="table-actions">
            <button class="btn-action edit">Editar</button>
            <button class="btn-action delete">Excluir</button>
          </div>
        </td>
    `;

    // Pegando os botões
    const btnEditar = tr.querySelector(".edit");
    const btnExcluir = tr.querySelector(".delete");

    // Evento de editar
    btnEditar.addEventListener("click", () => {
        editarCliente(cliente);
    });

    // Evento de excluir
    btnExcluir.addEventListener("click", () => {
        excluirCliente(cliente.id);
    });

    tbodyClientes.appendChild(tr);
}

carregarClientes()

function excluirCliente(id) {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    fetch(`${API_CLIENTES_BASE_URL}/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            alert("Cliente excluído com sucesso!");
            carregarClientes(); 
        })
        .catch(error => {
            console.error("Erro ao excluir:", error);
        });
}

function editarCliente(cliente) {
    const novoNome = prompt("Novo nome:", cliente.nome);
    const novoEmail = prompt("Novo email:", cliente.email);

    if (!novoNome || !novoEmail) return;

    fetch(`${API_CLIENTES_BASE_URL}/${cliente.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: novoNome,
            email: novoEmail
        })
    })
        .then(() => {
            alert("Cliente atualizado!");
            carregarClientes();
        })
        .catch(error => {
            console.error("Erro ao editar:", error);
        });
}

