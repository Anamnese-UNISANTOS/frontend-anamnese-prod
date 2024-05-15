endpoint = "usuarios";
const formAtualizarUsuario = document.querySelector(".formAtualizarUsuario");
const fNome = document.getElementById("nome");
const fMatricula = document.getElementById("matricula");
const fDataNasc = document.getElementById("dataNasc");
const usuarioId = localStorage.getItem("usuarioId");
const botaoDeletar = document.getElementById("botaoDeletar");
let itensTabela = "";

function consultarUsuario(id) {
    fetch(urlApi + endpoint + "/" + id, {
        headers: {
            "Authorization": `${token}`
        }
    })
        .then(response => response.json())
        .then(usuario => {
            fNome.value = usuario.nome;
            fMatricula.value = usuario.login;
        })
        .catch(error => {
            console.error(error);
        })
}

function atualizarUsuario(id) {
    return new Promise((resolve, reject) => {
        let forbidden = false;
        if (validateForm(formAtualizarUsuario)) {
            fetch(urlApi + endpoint + "/" + id, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                },
                method: "PUT",
                body: JSON.stringify({
                    nome: fNome.value,
                    login: fMatricula.value
                })
            })
                .then(response => {
                    if (!response.ok) {
                        forbidden = true;
                        return Promise.reject();
                    }
                    goodWarning.textContent = "Usuario atualizado com sucesso!";
                    resolve(response);
                })
                .catch(error => {
                    if (forbidden) {
                        badWarning.textContent = "Dados inválidos.";
                    } else {
                        badWarning.textContent = "Erro na comunicação com a API.";
                    }
                    reject(error);
                });
        }
    })
}

formAtualizarUsuario.addEventListener("submit", async event => {
    event.preventDefault();
    badWarning.textContent = "";
    goodWarning.textContent = "";
    try {
        await atualizarUsuario(usuarioId);
    } catch {
        verificarAutenticacao();
    }
});

botaoDeletar.addEventListener("click", async () => {
    try {
        await deletarItem(usuarioId);
        window.location.href = "gerenciar-usuarios.html";
    } catch {
        verificarAutenticacao();
    }
});

verificarAutenticacao();
consultarUsuario(usuarioId);
