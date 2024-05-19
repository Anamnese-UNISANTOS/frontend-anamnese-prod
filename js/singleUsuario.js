const formAtualizarUsuario = document.querySelector(".formAtualizarUsuario");
const formAtualizarSenha = document.querySelector(".formAtualizarSenha");
const fNome = document.getElementById("nome");
const fMatricula = document.getElementById("matricula");
const fDataNasc = document.getElementById("dataNasc");
const fSenha = document.getElementById("novaSenha");
const fSenhaConfirm = document.getElementById("novaSenhaConfirm");
const usuarioIdEdit = localStorage.getItem("usuarioIdEdit");
const botaoDeletar = document.getElementById("botaoDeletar");
const captionName = document.getElementById("captionName");

function consultarUsuario() {
    fetch(urlApi + endpointUsuarios + "/" + usuarioIdEdit, {
        headers: {
            "Authorization": `${token}`
        }
    })
        .then(response => response.json())
        .then(usuario => {
            fNome.value = usuario.nome;
            fMatricula.value = usuario.login;
            captionName.textContent = usuario.nome;
        })
        .catch(error => {
            console.error(error);
        })
}

function listarAnamnesesDoUsuario() {
    fetch(urlApi + endpointAnamneses + "/" + endpointUsuarios + "/" + usuarioIdEdit, {
        headers: {
            "Authorization": `${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(anamnese => {
                const itemTabela = document.createElement("tr");
                itemTabela.classList.add("itemTabela");
                itemTabela.classList.add("clickable");
                itemTabela.id = anamnese.id;
                tbody.appendChild(itemTabela);
                const colunaId = document.createElement("th");
                colunaId.textContent = `${anamnese.id}`
                itemTabela.appendChild(colunaId);
                const colunaPaciente = document.createElement("td");
                colunaPaciente.textContent = `${anamnese.pacienteNome}`
                itemTabela.appendChild(colunaPaciente);
                const colunaAt = document.createElement("td");
                const dataValue = anamnese.criadoEm;
                const partes = dataValue.split("-");
                const dataFormatada = partes[2] + "/" + partes[1] + "/" + partes[0];
                colunaAt.textContent = dataFormatada;
                itemTabela.appendChild(colunaAt);
            });
            let itensTabela = document.querySelectorAll(".itemTabela");
            itensTabela.forEach((anamnese) => {
                anamnese.addEventListener("click", () => {
                    localStorage.setItem("anamneseId", anamnese.id);
                    window.location.href = "anamnese.html";
                })
            })
        })
        .catch(error => {
            console.error(error);
            fallback.textContent = "Sem conexão com a API.";
        })
}

function atualizarUsuario() {
    return new Promise((resolve, reject) => {
        let forbidden = false;
        if (validateForm(formAtualizarUsuario)) {
            fetch(urlApi + endpointUsuarios + "/" + usuarioIdEdit, {
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

function atualizarSenha() {
    return new Promise((resolve, reject) => {
        let forbidden = false;
        if (validateForm(formAtualizarUsuario)) {
            fetch(urlApi + endpointUsuarios + "/" + usuarioIdEdit, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                },
                method: "PUT",
                body: JSON.stringify({
                    password: fSenha.value,
                    passwordConfirm: fSenhaConfirm.value
                })
            })
                .then(response => {
                    if (!response.ok) {
                        forbidden = true;
                        return Promise.reject();
                    }
                    goodWarningPass.textContent = "Senha atualizada com sucesso!";
                    resolve(response);
                })
                .catch(error => {
                    if (forbidden) {
                        badWarningPass.textContent = "Dados inválidos.";
                    } else {
                        badWarningPass.textContent = "Erro na comunicação com a API.";
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
        await atualizarUsuario();
    } catch {
        verificarAutenticacao();
    }
});

formAtualizarSenha.addEventListener("submit", async event => {
    event.preventDefault();
    badWarningPass.textContent = "";
    goodWarningPass.textContent = "";
    try {
        await atualizarSenha();
    } catch {
        verificarAutenticacao();
    }
});

botaoDeletar.addEventListener("click", async () => {
    try {
        await deletarItem(usuarioIdEdit, endpointUsuarios);
        window.location.href = "gerenciar-usuarios.html";
    } catch {
        verificarAutenticacao();
    }
});

verificarAutenticacao();
consultarUsuario();
listarAnamnesesDoUsuario();
