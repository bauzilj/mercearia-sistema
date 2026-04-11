const API_CLIENTES_BASE_URL =
  "https://api.franciscosensaulas.com/api/v1/mercearia/clientes";

const tbodyClientes = document.getElementById("tbody-clientes");

document.addEventListener("DOMContentLoaded", carregarClientes);



async function fetchAPI(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  
  if (response.status === 204) return null;

  return response.json();
}



async function carregarClientes() {
  try {
    const clientes = await fetchAPI(API_CLIENTES_BASE_URL);

    tbodyClientes.innerHTML = "";

    clientes.forEach(criarLinha);
  } catch (error) {
    console.error("Erro ao carregar clientes:", error);
    alert("Erro ao carregar clientes.");
  }
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

  const btnEditar = tr.querySelector(".edit");
  const btnExcluir = tr.querySelector(".delete");

  btnEditar.addEventListener("click", () => editarCliente(cliente));
  btnExcluir.addEventListener("click", () => excluirCliente(cliente.id, tr));

  tbodyClientes.appendChild(tr);
}


async function excluirCliente(id, rowElement) {
  const confirmacao = confirm("Tem certeza que deseja excluir este cliente?");
  if (!confirmacao) return;

  try {
    await fetchAPI(`${API_CLIENTES_BASE_URL}/${id}`, {
      method: "DELETE",
    });

    alert("Cliente excluído com sucesso!");

    rowElement.remove();
  } catch (error) {
    console.error("Erro ao excluir:", error);
    alert("Erro ao excluir cliente.");
  }
}


async function editarCliente(cliente) {
  const novoNome = prompt("Novo nome:", cliente.nome);
  const novoEmail = prompt("Novo email:", cliente.email);

  if (!novoNome?.trim() || !novoEmail?.trim()) return;

  try {
    await fetchAPI(`${API_CLIENTES_BASE_URL}/${cliente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: novoNome,
        email: novoEmail,
      }),
    });

    alert("Cliente atualizado com sucesso!");
    carregarClientes();
  } catch (error) {
    console.error("Erro ao editar:", error);
    alert("Erro ao atualizar cliente.");
  }
}