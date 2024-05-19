const urlApi = "http://localhost:8080/"
const endpointPacientes = "pacientes";
const endpointUsuarios = "usuarios";
const endpointAuth = "auth/login";
const endpointAnamneses = "anamneses";
const usuarioId = localStorage.getItem("usuarioId");
const usuarioNome = localStorage.getItem("usuarioNome");
const token = localStorage.getItem("jwtToken");
const goodWarning = document.getElementById("goodWarning");
const goodWarningPass = document.getElementById("goodWarningPass");
const badWarningPass = document.getElementById("badWarningPass");
const badWarning = document.getElementById("badWarning");
const fallback = document.getElementById("fallback");
const tbody = document.querySelector(".tabela-tbody");
const usersTab = document.querySelector(".usersTab");
const header = document.querySelector("header");
const headerusuarioNome = document.getElementById("headerusuarioNome");

function verificarAutenticacao() {
    if (!token) {
        logout();
    } else {
        fetch(urlApi + endpointPacientes, {
            headers: {
                "Authorization": `${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
            })
            .catch(() => {
                alert("Sessão encerrada.");
                logout();
            })
    }
}

function deletarItem(id, url) {
    return new Promise((resolve, reject) => {
        fetch(urlApi + url + "/" + id, {
            headers: {
                "Authorization": `${token}`
            },
            method: "DELETE"
        })
            .then(response => {
                console.log(response);
                resolve(response);
            })
            .catch(error => {
                console.error(error);
                reject(error);
            })
    })
}

function verificarAutenticacaoAdmin() {
    if (!token) {
        logout();
    } else {
        fetch(urlApi + endpointUsuarios, {
            headers: {
                "Authorization": `${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    return Promise.reject();
                }
            })
            .catch(() => {
                alert("Sessão encerrada.");
                logout();
            })
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function validateForm(form) {
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return false;
    }
    return true;
}

function resetForm(form) {
    form.reset();
    form.classList.remove("was-validated");
}

function limparTabela() {
    tbody.innerHTML = "";
    fallback.textContent = "";
}

function hideUsersTab() {
    fetch(urlApi + endpointUsuarios, {
        headers: {
            "Authorization": `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                usersTab.remove();
            }
        })
}

function getHeaderData() {
    headerusuarioNome.textContent = usuarioNome;
    hideUsersTab();
}

if (header) {
    const exitIcon = document.getElementById("exitIcon");
    getHeaderData();

    exitIcon.addEventListener("click", logout);
}
