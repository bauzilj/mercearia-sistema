let formClientes = document.getElementById("form-cliente");


formClientes.addEventListener("submit", salvar);

function salvar(event) {
    event.preventDefault();

    let nomeCliente = document.getElementById("nome-do-cliente").value;
    let emailCliente = document.getElementById("email-do-cliente").value;

    if (!nomeCliente || !emailCliente) {
        alert("Preencha todos os campos!");
        return;
    }

    let payload = {
        nome: nomeCliente,
        email: emailCliente
    };

    fetch(API_CLIENTES_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(async response => {
        const data = await response.text();
        console.log("Resposta da API:", data); 

        if (!response.ok) {
            throw new Error("Erro ao cadastrar cliente");
        }

        return data;
    })
    .then(() => {
        formClientes.reset();
        carregarClientes();
    })
    .catch(erro => {
        console.error(erro);
        alert("Ocorreu um erro ao cadastrar o cliente");
    });
}