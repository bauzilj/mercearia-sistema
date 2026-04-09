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
            selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';

            for (let i = 0; i < categorias.length; i = i + 1) {
                const categoria = categorias[i];
                
                const optionSelect = `<option value="${categoria.id}">${categoria.nome}</option>`;
                
                selectCategoria.innerHTML += optionSelect;
            }
        })
        .catch(error => console.error("Erro ao carregar categorias:", error));
}