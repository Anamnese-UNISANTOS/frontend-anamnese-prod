const urlApi = "https://backend-anamnese.onrender.com"
let endpoint = "";
const token = localStorage.getItem("jwtToken");
const userName = localStorage.getItem("userName");
const goodWarning = document.getElementById("goodWarning");
const badWarning = document.getElementById("badWarning");
const fallback = document.getElementById("fallback");
const tbody = document.querySelector(".tabela-tbody");
const usersTab = document.querySelector(".usersTab");
const header = document.querySelector("header");
const headerUserName = document.getElementById("headerUserName");

function verificarAutenticacao() {
    if (!token) {
        logout();
    } else {
        fetch(urlApi + "pacientes", {
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

function deletarItem(id) {
    return new Promise((resolve, reject) => {
        fetch(urlApi + endpoint + "/" + id, {
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
        fetch(urlApi + "usuarios", {
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
    fetch(urlApi + "usuarios", {
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
    headerUserName.textContent = userName;
    hideUsersTab();
}

if (header) {
    const exitIcon = document.getElementById("exitIcon");
    getHeaderData();

    exitIcon.addEventListener("click", logout);
}
