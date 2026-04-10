

let formClientes = document.getElementById("form-cliente");
formClientes.addEventListener("click", salvar);

function salvar(event) {
    event.preventDefault();

    let nomeCliente = document.getElementById("nome-do-cliente").value;
    let emailCliente = document.getElementById("email-do-cliente").value;

    if (!nomeCliente || !emailCliente) {
        alert("Preencha todos os campos!");
        return;
    }

    let payload = {
        "nome": nomeCliente,
        "email": emailCliente
    };

    

    fetch(API_CLIENTES_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao cadastrar cliente");
        }
        return response.json();
    })
    .then(() => {
        window.location.href = "./cliente.html";
    })
    .catch(erro => {
        console.error(erro);
        alert("Ocorreu um erro ao cadastrar o cliente");
    });
}

