const btnNovoEstoque = document.getElementById("btn-estoque");

btnNovoEstoque.addEventListener("click", salvarEstoque);

function salvarEstoque(event) {
    event.preventDefault();

    const nome = document.getElementById("nome-item").value.trim();
    const quantidade = document.getElementById("quantidade-item").value;
    const fornecedorId = document.getElementById("fornecedor-id").value;

    if (!nome || !quantidade || !fornecedorId) {
        alert("Preencha todos os campos!");
        return;
    }

    const payload = {
        produto: nome,
        quantidade: Number(quantidade),
        fornecedorId: Number(fornecedorId)
    };

    if (estoqueEditandoId !== null) {
        fetch(`${API_ESTOQUE_BASE_URL}/${estoqueEditandoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao atualizar item");
                }
                return response.json().catch(() => null);
            })
            .then(() => {
                resetarFormularioEstoque();
                carregarEstoque();
            })
            .catch((error) => {
                console.error(error);
                alert("Erro ao atualizar item");
            });
    } else {
        fetch(API_ESTOQUE_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao cadastrar item");
                }
                return response.json().catch(() => null);
            })
            .then(() => {
                resetarFormularioEstoque();
                carregarEstoque();
            })
            .catch((error) => {
                console.error(error);
                alert("Erro ao cadastrar item");
            });
    }
}