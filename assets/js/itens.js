const API_ITENS_URL = "https://api.franciscosensaulas.com/api/v1/mercearia/itens";
const API_CATEGORIAS_URL = "https://api.franciscosensaulas.com/api/v1/mercearia/categorias";

const tbodyItens = document.getElementById("tbody-itens");
const selectCategoria = document.getElementById("select-categoria");
const botaoSalvar = document.getElementById("btn-salvar");
const inputNome = document.getElementById("input-nome");
const inputPreco = document.getElementById("input-preco");

let idParaEditar = null;

botaoSalvar.addEventListener("click", salvar);

function carregarCategoriasNoSelect() {
    fetch(API_CATEGORIAS_URL)
        .then(response => response.json())
        .then(categorias => {
            // Mantém a primeira opção vazia e limpa o resto
            selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';

            for (let i = 0; i < categorias.length; i = i + 1) {
                const categoria = categorias[i];
                
                // Cria a opção usando template string como no book-flow
                const optionSelect = `<option value="${categoria.id}">${categoria.nome}</option>`;
                
                selectCategoria.innerHTML += optionSelect;
            }
        })
        .catch(error => console.error("Erro ao carregar categorias:", error));
}

function carregarItens() {
    fetch(API_ITENS_URL)
        .then((response) => {
            return response.json();
        })
        .then((itens) => {
            tbodyItens.innerHTML = "";

            for (let i = 0; i < itens.length; i = i + 1) {
                let item = itens[i];

                const novaLinha = document.createElement("tr");

                // Formatação simples de preço
                const precoFormatado = "R$ " + Number(item.preco).toFixed(2);
                const nomeCategoria = item.categoria ? item.categoria.nome : "Sem categoria";

                novaLinha.innerHTML = `
                  <td>${item.id}</td>
                  <td>${item.nome}</td>
                  <td>${precoFormatado}</td>
                  <td>${nomeCategoria}</td>
                  <td>
                    <div class="table-actions">
                      <button class="btn-action edit botao-editar" data-id="${item.id}">Editar</button>
                      <button class="btn-action delete botao-apagar" data-id="${item.id}">Excluir</button>
                    </div>
                  </td>
                `;

                tbodyItens.appendChild(novaLinha);
            }

            registrarCliqueBotaoApagar();
            registrarCliqueBotaoEditar();
        })
        .catch((erro) => {
            alert("Não foi possível carregar os itens");
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
    let deveApagar = confirm("Deseja apagar este item?");

    if (deveApagar !== true) {
        return;
    }

    let id = event.currentTarget.getAttribute("data-id");

    fetch(`${API_ITENS_URL}/${id}`, {
        "method": "DELETE"
    })
    .then(() => {
        carregarItens();
    })
    .catch((erro) => {
        alert("Ocorreu um erro ao apagar the item");
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
    
    fetch(`${API_ITENS_URL}/${id}`)
        .then(dados => dados.json())
        .then((item) => {
            inputNome.value = item.nome;
            inputPreco.value = item.preco;
            selectCategoria.value = item.categoriaId || "";
            
            idParaEditar = item.id;
            botaoSalvar.textContent = "Salvar Alterações";
        })
        .catch(erro => {
            alert("Erro ao carregar dados do item");
        });
}

function salvar() {
    let nome = inputNome.value;
    let preco = inputPreco.value;
    let categoriaId = selectCategoria.value;

    if (nome === "" || preco === "") {
        alert("Nome e Preço são obrigatórios");
        return;
    }

    let payload = {
        "nome": nome,
        "preco": Number(preco),
        "categoriaId": categoriaId === "" ? null : Number(categoriaId)
    };

    if (idParaEditar === null) {
        cadastrar(payload);
    } else {
        editar(payload);
    }
}

function cadastrar(payload) {
    fetch(API_ITENS_URL, {
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
        alert("Item cadastrado com sucesso");
        limparFormulario();
        carregarItens();
    })
    .catch((erro) => {
        alert("Não foi possível cadastrar o item");
    });
}

function editar(payload) {
    fetch(`${API_ITENS_URL}/${idParaEditar}`, {
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(payload)
    })
    .then(() => {
        alert("Item alterado com sucesso");
        limparFormulario();
        carregarItens();
    })
    .catch((erro) => {
        alert("Não foi possível alterar o item");
    });
}

function limparFormulario() {
    inputNome.value = "";
    inputPreco.value = "";
    selectCategoria.value = "";
    idParaEditar = null;
    botaoSalvar.textContent = "Salvar Item";
}

carregarCategoriasNoSelect();
carregarItens();
