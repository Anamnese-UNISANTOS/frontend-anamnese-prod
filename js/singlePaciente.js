const formAtualizarPaciente = document.querySelector(".formAtualizarPaciente");
const fNome = document.getElementById("nome");
const fSexo = document.getElementById("sexo");
const fDataNasc = document.getElementById("dataNasc");
const pacienteId = localStorage.getItem("pacienteId");
const botaoDeletar = document.getElementById("botaoDeletar");
const captionName = document.getElementById("captionName");

function consultarPaciente() {
    fetch(urlApi + endpointPacientes + "/" + pacienteId, {
        headers: {
            "Authorization": `${token}`
        }
    })
        .then(response => response.json())
        .then(paciente => {
            fNome.value = paciente.nome;
            fSexo.value = paciente.sexo;
            fDataNasc.value = paciente.dataNascimento;
            captionName.textContent = paciente.nome;
        })
        .catch(error => {
            console.error(error);
        })
}

function listarFormulariosDoPaciente() {
    fetch(urlApi + endpointFormularios + "/" + endpointPacientes + "/" + pacienteId, {
        headers: {
            "Authorization": `${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(formulario => {
                const itemTabela = document.createElement("tr");
                itemTabela.classList.add("itemTabela");
                itemTabela.classList.add("clickable");
                itemTabela.id = formulario.id;
                tbody.appendChild(itemTabela);
                const colunaId = document.createElement("th");
                colunaId.textContent = `${formulario.id}`
                itemTabela.appendChild(colunaId);
                const colunaTipoForm = document.createElement("td");
                colunaTipoForm.textContent = `${formulario.tipoFormulario}`
                itemTabela.appendChild(colunaTipoForm);
                const colunaPaciente = document.createElement("td");
                colunaPaciente.textContent = `${formulario.pacienteNome}`
                itemTabela.appendChild(colunaPaciente);
                const colunaAt = document.createElement("td");
                const dataValue = formatDate(formulario.criadoEm);
                colunaAt.textContent = dataValue;
                itemTabela.appendChild(colunaAt);

                itemTabela.addEventListener("click", () => {
                    if (formulario.tipoFormulario == "Anamnese") {
                        localStorage.setItem("anamneseId", formulario.id);
                        window.location.href = "anamnese.html";
                    } else {
                        localStorage.setItem("retornoId", formulario.id);
                        window.location.href = "retorno.html";
                    }
                })
            });
        })
        .catch(error => {
            console.error(error);
            fallback.textContent = "Sem conexão com a API.";
        })
}

function atualizarPaciente() {
    return new Promise((resolve, reject) => {
        let forbidden = false;
        if (validateForm(formAtualizarPaciente)) {
            fetch(urlApi + endpointPacientes + "/" + pacienteId, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                },
                method: "PUT",
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
                    goodWarning.textContent = "Paciente atualizado com sucesso!";
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

formAtualizarPaciente.addEventListener("submit", async event => {
    event.preventDefault();
    badWarning.textContent = "";
    goodWarning.textContent = "";
    try {
        await atualizarPaciente();
    } catch {
        verificarAutenticacao();
    }
});

botaoDeletar.addEventListener("click", async () => {
    try {
        await deletarItem(pacienteId, endpointPacientes);
        window.location.href = "pacientes.html";
    } catch {
        verificarAutenticacao();
    }
});

verificarAutenticacao();
consultarPaciente();
listarFormulariosDoPaciente();
