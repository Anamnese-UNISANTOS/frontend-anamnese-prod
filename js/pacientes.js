const formAddPaciente = document.querySelector(".formAddPaciente");
const fNome = document.getElementById("nome");
const fSexo = document.getElementById("sexo");
const fDataNasc = document.getElementById("dataNasc");
let itensTabela = "";

function listarPacientes() {
    fetch(urlApi + endpointPacientes, {
        headers: {
            "Authorization": `${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(paciente => {
                const itemTabela = document.createElement("tr");
                itemTabela.classList.add("itemTabela");
                itemTabela.classList.add("clickable");
                itemTabela.id = paciente.id;
                tbody.appendChild(itemTabela);
                const colunaID = document.createElement("th");
                colunaID.textContent = `${paciente.id}`
                itemTabela.appendChild(colunaID);
                const colunaPaciente = document.createElement("td");
                colunaPaciente.textContent = `${paciente.nome}`
                itemTabela.appendChild(colunaPaciente);
                const colunaAt = document.createElement("td");
                const dataValue = formatDate(paciente.criadoEm);
                colunaAt.textContent = dataValue;
                itemTabela.appendChild(colunaAt);

                itemTabela.addEventListener("click", () => {
                    localStorage.setItem("pacienteId", paciente.id);
                    window.location.href = "paciente.html";
                })
            });
        })
        .catch(error => {
            console.error(error);
            fallback.textContent = "Sem conexão com a API.";
        })
}

function cadastrarPaciente() {
    return new Promise((resolve, reject) => {
        let forbidden = false;
        if (validateForm(formAddPaciente)) {
            fetch(urlApi + endpointPacientes, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                },
                method: "POST",
                body: JSON.stringify({
                    nome: fNome.value,
                    sexo: fSexo.value,
                    dataNascimento: fDataNasc.value
                })
            })
                .then(response => {
                    if (!response.ok) {
                        forbidden = true;
                        return Promise.reject();
                    }
                    goodWarning.textContent = "Paciente cadastrado com sucesso!";
                    resetForm(formAddPaciente);
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

formAddPaciente.addEventListener("submit", async event => {
    event.preventDefault();
    badWarning.textContent = "";
    goodWarning.textContent = "";
    try {
        await cadastrarPaciente();
        limparTabela();
        listarPacientes();
    } catch {
        verificarAutenticacao();
    }
});

verificarAutenticacao();
listarPacientes();
