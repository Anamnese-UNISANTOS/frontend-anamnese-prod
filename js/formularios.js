const formAddAnamnese = document.querySelector(".formAddAnamnese");
const fNome = document.getElementById("nome");
const fSexo = document.getElementById("sexo");
const fDataNasc = document.getElementById("dataNasc");
const tbodyRetornos = document.querySelector(".tabela-tbody-retornos");
const botaoExportarAnamneses = document.getElementById("botaoExportarAnamneses");
const botaoExportarRetornos = document.getElementById("botaoExportarRetornos");
let itensTabela = "";

function listarFormularios() {
    fetch(urlApi + endpointFormularios, {
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

function exportarAnamneses() {
    return new Promise((resolve, reject) => {
        fetch(urlApi + endpointFormularios + "/" + "export-anamnese", {
            headers: {
                "Authorization": `${token}`,
                'Content-Type': 'text/csv'
            }
        })
            .then(response => {
                return response.blob();
            })
            .then(blob => {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = "anamnese.csv";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                resolve();
            })
            .catch(error => {
                console.error(error);
                reject(error);
            })
    })
}

function exportarRetornos() {
    return new Promise((resolve, reject) => {
        fetch(urlApi + endpointFormularios + "/" + "export-retorno", {
            headers: {
                "Authorization": `${token}`,
                'Content-Type': 'text/csv'
            }
        })
            .then(response => {
                return response.blob();
            })
            .then(blob => {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = "retorno.csv";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                resolve();
            })
            .catch(error => {
                console.error(error);
                reject(error);
            })
    })
}

botaoExportarAnamneses.addEventListener("click", async () => {
    try {
        await exportarAnamneses();
    } catch {
        verificarAutenticacao();
    }
});

botaoExportarRetornos.addEventListener("click", async () => {
    try {
        await exportarRetornos();
    } catch {
        verificarAutenticacao();
    }
});

verificarAutenticacao();
listarFormularios();
