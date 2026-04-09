const btnNovo = document.querySelector(".section-head .btn");

btnNovo.addEventListener("click", salvarFornecedor);

function salvarFornecedor(event) {
    event.preventDefault();

    let nome = document.getElementById("nome-do-fornecedor").value;
    let telefone = document.getElementById("telefone-do-fornecedor").value;

    if (!nome || !telefone) {
        alert("Preencha todos os campos!");
        return;
    }

    let payload = {
        nome: nome,
        telefone: telefone
    };

    if (fornecedorEditandoId) {
        fetch(`${API_FORNECEDORES_BASE_URL}/${fornecedorEditandoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(() => {
            resetarFormulario();
            carregarFornecedores();
        })
        .catch(error => {
            console.error(error);
            alert("Erro ao atualizar fornecedor");
        });

    } else {
        fetch(API_FORNECEDORES_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(() => {
            resetarFormulario();
            carregarFornecedores();
        })
        .catch(error => {
            console.error(error);
            alert("Erro ao cadastrar fornecedor");
        });
    }
}

function resetarFormulario() {
    document.getElementById("nome-do-fornecedor").value = "";
    document.getElementById("telefone-do-fornecedor").value = "";

    fornecedorEditandoId = null;

    document.querySelector(".section-head .btn").textContent = "Novo Fornecedor";
}