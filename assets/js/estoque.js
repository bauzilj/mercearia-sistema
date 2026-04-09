const API_ESTOQUE_BASE_URL = "https://api.franciscosensaulas.com/api/v1/mercearia/estoques";
const API_FORNECEDORES_BASE_URL = "https://api.franciscosensaulas.com/api/v1/mercearia/fornecedores";

const tbodyEstoque = document.getElementById("tbody-estoque");
const selectFornecedor = document.getElementById("fornecedor-id");
const btnEstoque = document.getElementById("btn-estoque");

let estoqueEditandoId = null;
let listaFornecedores = [];

function carregarPaginaEstoque() {
    Promise.all([carregarFornecedores(), carregarEstoque()])
        .catch((error) => {
            console.error("Erro ao carregar dados da página:", error);
        });
}

function carregarFornecedores() {
    return fetch(API_FORNECEDORES_BASE_URL)
        .then((response) => response.json())
        .then((fornecedores) => {
            listaFornecedores = fornecedores;
            preencherSelectFornecedores(fornecedores);
        })
        .catch((error) => {
            console.error("Erro ao carregar fornecedores:", error);
        });
}

function preencherSelectFornecedores(fornecedores) {
    selectFornecedor.innerHTML = `
        <option value="">Selecione um fornecedor</option>
    `;

    fornecedores.forEach((fornecedor) => {
        const option = document.createElement("option");
        option.value = fornecedor.id;
        option.textContent = `${fornecedor.id} - ${fornecedor.nome}`;
        selectFornecedor.appendChild(option);
    });
}

function carregarEstoque() {
    return fetch(API_ESTOQUE_BASE_URL)
        .then((res) => res.json())
        .then((estoque) => {
            tbodyEstoque.innerHTML = "";
            estoque.forEach(criarLinha);
        })
        .catch((err) => console.error("Erro ao carregar estoque:", err));
}

function criarLinha(item) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${item.produto}</td>
        <td>${item.quantidade}</td>
        <td>${item.fornecedorId ?? "-"}</td>
        <td>
          <div class="table-actions">
            <button class="btn-action edit" type="button">Editar</button>
            <button class="btn-action delete" type="button">Excluir</button>
          </div>
        </td>
    `;

    tr.querySelector(".edit").addEventListener("click", () => {
        document.getElementById("nome-item").value = item.produto;
        document.getElementById("quantidade-item").value = item.quantidade;
        document.getElementById("fornecedor-id").value = item.fornecedorId ?? "";

        estoqueEditandoId = item.id;
        btnEstoque.textContent = "Salvar Alterações";
    });

    tr.querySelector(".delete").addEventListener("click", () => {
        if (!confirm("Deseja excluir este item?")) return;

        fetch(`${API_ESTOQUE_BASE_URL}/${item.id}`, {
            method: "DELETE"
        })
            .then(() => carregarEstoque())
            .catch((err) => console.error("Erro ao excluir:", err));
    });

    tbodyEstoque.appendChild(tr);
}

function resetarFormularioEstoque() {
    document.getElementById("form-estoque").reset();
    estoqueEditandoId = null;
    btnEstoque.textContent = "Novo Item";
}

carregarPaginaEstoque();