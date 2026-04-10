const API_URL = "https://api.franciscosensaulas.com/api/v1/mercearia/categorias";

const tbodyCategorias = document.getElementById("tbody-categorias");
const botaoSalvar = document.getElementById("btn-salvar");
const inputNome = document.getElementById("input-nome");
const inputDescricao = document.getElementById("input-descricao");

let idParaEditar = null;

botaoSalvar.addEventListener("click", salvar);

function carregarCategorias() {
    fetch(API_URL)
        .then((response) => {
            return response.json();
        })
        .then((categorias) => {
            tbodyCategorias.innerHTML = "";

            for (let i = 0; i < categorias.length; i = i + 1) {
                let categoria = categorias[i];

                const novaLinha = document.createElement("tr");

                novaLinha.innerHTML = `
                  <td>${categoria.id}</td>
                  <td>${categoria.nome}</td>
                  <td>${categoria.descricao || "-"}</td>
                  <td>
                    <div class="table-actions">
                      <button class="btn-action edit botao-editar" data-id="${categoria.id}">Editar</button>
                      <button class="btn-action delete botao-apagar" data-id="${categoria.id}">Excluir</button>
                    </div>
                  </td>
                `;

                tbodyCategorias.appendChild(novaLinha);
            }

            registrarCliqueBotaoApagar();
            registrarCliqueBotaoEditar();
        })
        .catch((erro) => {
            alert("Não foi possível carregar as categorias");
        });
}

function registrarCliqueBotaoApagar() {
    let botoesApagar = document.getElementsByClassName("botao-apagar");

    for (let i = 0; i < botoesApagar.length; i += 1) {
        let botao = botoesApagar[i];
        botao.addEventListener("click", confirmarApagar);
    }
}

function confirmarApagar(event) {
    let deveApagar = confirm("Deseja apagar esta categoria?");

    if (deveApagar !== true) {
        return;
    }

    let id = event.currentTarget.getAttribute("data-id");

    fetch(`${API_URL}/${id}`, {
        "method": "DELETE"
    })
        .then(() => {
            carregarCategorias();
        })
        .catch((erro) => {
            alert("Ocorreu um erro ao apagar a categoria");
        });
}

function registrarCliqueBotaoEditar() {
    let botoesEditar = document.getElementsByClassName("botao-editar");

    for (let i = 0; i < botoesEditar.length; i += 1) {
        let botao = botoesEditar[i];
        botao.addEventListener("click", preencherFormulario);
    }
}

function preencherFormulario(event) {
    let id = event.currentTarget.getAttribute("data-id");

    fetch(`${API_URL}/${id}`)
        .then(dados => dados.json())
        .then((categoria) => {
            inputNome.value = categoria.nome;
            inputDescricao.value = categoria.descricao || "";
            idParaEditar = categoria.id;
            botaoSalvar.textContent = "Salvar Alterações";
        })
        .catch(erro => {
            alert("Erro ao carregar dados da categoria");
        });
}

function salvar() {
    let nome = inputNome.value;
    let descricao = inputDescricao.value;

    if (nome === "") {
        alert("O nome é obrigatório");
        return;
    }

    let payload = {
        "nome": nome,
        "descricao": descricao
    };

    if (idParaEditar === null) {
        cadastrar(payload);
    } else {
        editar(payload);
    }
}

function cadastrar(payload) {
    fetch(API_URL, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(payload)
    })
        .then((data) => {
            return data.json();
        })
        .then(() => {
            alert("Categoria cadastrada com sucesso");
            limparFormulario();
            carregarCategorias();
        })
        .catch((erro) => {
            alert("Não foi possível cadastrar a categoria");
        });
}

function editar(payload) {
    fetch(`${API_URL}/${idParaEditar}`, {
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(payload)
    })
        .then(() => {
            alert("Categoria alterada com sucesso");
            limparFormulario();
            carregarCategorias();
        })
        .catch((erro) => {
            alert("Não foi possível alterar a categoria");
        });
}

function limparFormulario() {
    inputNome.value = "";
    inputDescricao.value = "";
    idParaEditar = null;
    botaoSalvar.textContent = "Salvar Categoria";
}

carregarCategorias();
