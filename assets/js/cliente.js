const API_CLIENTES_BASE_URL =
  "https://api.franciscosensaulas.com/api/v1/mercearia/clientes";

const tbodyClientes = document.getElementById("tbody-clientes");

function carregarClientes() {
  fetch(API_CLIENTES_BASE_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao carregar clientes");
      }
      return response.json();
    })
    .then((clientes) => {
      tbodyClientes.innerHTML = "";

      for (let i = 0; i < clientes.length; i++) {
        const cliente = clientes[i];
        criarLinha(cliente);
      }
    })
    .catch((error) => {
      console.log("Erro ao carregar clientes:", error);
    });
}

function criarLinha(cliente) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
        <td>${cliente.id}</td>
        <td class="nome">${cliente.nome}</td>
        <td class="email">${cliente.email}</td>
        <td>
          <div class="table-actions">
            <button class="btn-action edit">Editar</button>
            <button class="btn-action delete">Excluir</button>
          </div>
        </td>
    `;

  const btnEditar = tr.querySelector(".edit");
  const btnExcluir = tr.querySelector(".delete");

  btnEditar.addEventListener("click", () => {
    ativarEdicao(tr, cliente);
  });

  btnExcluir.addEventListener("click", () => {
    excluirCliente(cliente.id);
  });

  tbodyClientes.appendChild(tr);
}

carregarClientes();

function excluirCliente(id) {
  if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

  fetch(`${API_CLIENTES_BASE_URL}/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao excluir cliente");
      }
      alert("Cliente excluído com sucesso!");
      carregarClientes();
    })
    .catch((error) => {
      console.error("Erro ao excluir:", error);
    });
}


function ativarEdicao(tr, cliente) {
  const nomeTd = tr.querySelector(".nome");
  const emailTd = tr.querySelector(".email");
  const btnEditar = tr.querySelector(".edit");

  nomeTd.innerHTML = `<input type="text" class="edit-nome" value="${cliente.nome}">`;
  emailTd.innerHTML = `<input type="email" class="edit-email" value="${cliente.email}">`;

  btnEditar.textContent = "Salvar";

  btnEditar.onclick = () => {
    const novoNome = tr.querySelector(".edit-nome").value;
    const novoEmail = tr.querySelector(".edit-email").value;

    if (!novoNome || !novoEmail) {
      alert("Preencha todos os campos!");
      return;
    }

    fetch(`${API_CLIENTES_BASE_URL}/${cliente.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: novoNome,
        email: novoEmail,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao atualizar cliente");
        }
        return response.json();
      })
      .then(() => {
        alert("Cliente atualizado!");
        carregarClientes();
      })
      .catch((error) => {
        console.error("Erro ao editar:", error);
      });
  };
}