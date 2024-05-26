const urlApi = "https://backend-anamnese.onrender.com/"
const endpointPacientes = "pacientes";
const endpointUsuarios = "usuarios";
const endpointAuth = "auth/login";
const endpointAnamneses = "anamneses";
const endpointRetornos = "retornos";
const endpointFormularios = "formularios";
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

function formatDate(data) {
  const partes = data.split("-");
  return partes[2].slice(0,2) + "/" + partes[1] + "/" + partes[0];
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

async function showTab(n) {
    tabs[n].style.display = "block"
  
    if (n == 0) {
      prevBtn.style.display = "none";
      divStepButtons.style.flexDirection = "row-reverse"
    } else if (n == (tabs.length - 1)) {
      nextBtn.textContent = "Enviar";
      prevBtn.style.display = "inline";
    } else {
      nextBtn.textContent = "Próximo";
      divStepButtons.style.flexDirection = "row"
      prevBtn.style.display = "inline";
    }
    fixStepIndicator(n)
  }

  async function nextTab(func) {
    if (currentTab >= tabs.length - 1) {
      try {
        goodWarning.textContent = "";
        badWarning.textContent = "";
        await func();
        window.location.href = "formularios.html";
      }
      catch (error) {
        verificarAutenticacao();
      }
    } else {
      tabs[currentTab].style.display = "none";
      currentTab += 1;
      showTab(currentTab);
      window.scrollTo(0, 0);
    }
  }
  
  function prevTab() {
    tabs[currentTab].style.display = "none";
    currentTab -= 1;
    showTab(currentTab);
    window.scrollTo(0, 0);
  }
  
  function fixStepIndicator(n) {
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    x[n].className += " active";
  }

function listarPacientesSelect(pacienteSelect) {
    fetch(urlApi + endpointPacientes, {
      headers: {
        "Authorization": `${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        data.forEach(paciente => {
          const optionElement = document.createElement('option');
          optionElement.value = paciente.id;
          optionElement.textContent = paciente.nome;
          pacienteSelect.appendChild(optionElement);
        });
      })
      .catch(error => {
        console.error(error);
      })
  }

if (header) {
    const exitIcon = document.getElementById("exitIcon");
    getHeaderData();

    exitIcon.addEventListener("click", logout);
}
