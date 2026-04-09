const API_FORNECEDORES_BASE_URL = "https://api.franciscosensaulas.com/api/v1/mercearia/fornecedores";

const tbodyFornecedores = document.getElementById("tbody-fornecedores");

let fornecedorEditandoId = null;

function carregarFornecedores() {
    fetch(API_FORNECEDORES_BASE_URL)
        .then((response) => response.json())
        .then((fornecedores) => {
            tbodyFornecedores.innerHTML = "";

            fornecedores.forEach(criarLinha);
        })
        .catch(error => {
            console.log("Erro ao carregar fornecedores:", error);
        });
}

function criarLinha(fornecedor) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${fornecedor.id}</td>
        <td>${fornecedor.nome}</td>
        <td>${fornecedor.telefone}</td>
        <td>
          <div class="table-actions">
            <button class="btn-action edit">Editar</button>
            <button class="btn-action delete">Excluir</button>
          </div>
        </td>
    `;

    tr.querySelector(".edit").addEventListener("click", () => {
        document.getElementById("nome-do-fornecedor").value = fornecedor.nome;
        document.getElementById("telefone-do-fornecedor").value = fornecedor.telefone;

        fornecedorEditandoId = fornecedor.id;

        document.querySelector(".section-head .btn").textContent = "Salvar Alterações";
    });

    tr.querySelector(".delete").addEventListener("click", () => {
        if (!confirm("Deseja excluir este fornecedor?")) return;

        fetch(`${API_FORNECEDORES_BASE_URL}/${fornecedor.id}`, {
            method: "DELETE"
        })
        .then(() => carregarFornecedores())
        .catch(error => console.error("Erro ao excluir fornecedor:", error));
    });

    tbodyFornecedores.appendChild(tr);
}

carregarFornecedores();