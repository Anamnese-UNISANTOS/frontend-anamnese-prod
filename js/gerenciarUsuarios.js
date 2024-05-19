const formAddUsuario = document.querySelector(".formAddUsuario");
const fNome = document.getElementById("nome");
const fMatricula = document.getElementById("matricula");
const fRole = document.getElementById("role");
const fSenha = document.getElementById("senha");
const roles = {
    "ADMIN": "Admin",
    "USER": "Comum"
}

function limparTabela() {
    tbody.innerHTML = "";
    fallback.textContent = "";
}

function listarUsuarios() {
    fetch(urlApi + endpointUsuarios, {
        headers: {
            "Authorization": `${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(usuario => {
                const itemTabela = document.createElement('tr');
                itemTabela.classList.add("itemTabela");
                itemTabela.classList.add("clickable");
                itemTabela.id = usuario.id;
                tbody.appendChild(itemTabela);
                const colunaID = document.createElement('th');
                colunaID.textContent = `${usuario.id}`
                itemTabela.appendChild(colunaID);
                const colunaUsuario = document.createElement('td');
                colunaUsuario.textContent = `${usuario.nome}`
                itemTabela.appendChild(colunaUsuario);
                const colunaMatricula = document.createElement('td');
                colunaMatricula.textContent = `${usuario.login}`
                itemTabela.appendChild(colunaMatricula);
                const colunaTipo = document.createElement('td');
                colunaTipo.textContent = roles[usuario.role];
                itemTabela.appendChild(colunaTipo);
                const colunaAt = document.createElement('td');
                const dataValue = usuario.criadoEm;
                const partes = dataValue.split("-");
                const dataFormatada = partes[2] + "/" + partes[1] + "/" + partes[0];
                colunaAt.textContent = dataFormatada;
                itemTabela.appendChild(colunaAt);
            });
            let itensTabela = document.querySelectorAll(".itemTabela");
            itensTabela.forEach((usuario) => {
                usuario.addEventListener("click", () => {
                    localStorage.setItem("usuarioIdEdit", usuario.id);
                    window.location.href = "usuario.html";
                })
            })
        })
        .catch(error => {
            console.error(error);
            fallback.textContent = 'Sem conexão com a API.';
        })
}

function consultarUsuario(id) {
    return new Promise((resolve, reject) => {
        fetch(urlApi + endpointUsuarios + "/" + id, {
            headers: {
                "Authorization": `${token}`
            }
        })
            .then(response => response.json())
            .then(usuario => {
                resolve(usuario);
            })
            .catch(error => {
                reject(error);
            })

    })
}

function cadastrarUsuario() {
    let forbidden = false;
    return new Promise((resolve, reject) => {
        if (validateForm(formAddUsuario)) {
            fetch(urlApi + endpointUsuarios, {
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `${token}`
                },
                method: 'POST',
                body: JSON.stringify({
                    nome: fNome.value,
                    login: fMatricula.value,
                    password: fSenha.value,
                    role: fRole.value
                })
            })
                .then(response => {
                    if (!response.ok) {
                        forbidden = true;
                        return Promise.reject();
                    }
                    goodWarning.textContent = "Usuário cadastrado com sucesso!";
                    resetForm(formAddUsuario);
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
    });
}

formAddUsuario.addEventListener('submit', async event => {
    event.preventDefault();
    badWarning.textContent = "";
    goodWarning.textContent = "";
    try {
        await cadastrarUsuario();
        limparTabela();
        listarUsuarios();
    } catch {
        verificarAutenticacaoAdmin();
    }
});

verificarAutenticacaoAdmin();
listarUsuarios();
