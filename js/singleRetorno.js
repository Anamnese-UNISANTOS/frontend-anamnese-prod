const formAddRetorno = document.querySelector(".formAddRetorno");
const pacienteNome = document.getElementById("pacienteNome");
const criadoPor = document.getElementById("criadoPor");
const retornoId = localStorage.getItem("retornoId");
const divStepButtons = document.querySelector(".div-step-buttons");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const tabs = document.getElementsByClassName("tab");
const fPacienteSelect = document.getElementById("pacienteSelect");
const botaoDeletar = document.getElementById("botaoDeletar");
let currentTab = 0;

function consultarRetorno() {
    fetch(urlApi + endpointRetornos + "/" + retornoId, {
        headers: {
            "Authorization": `${token}`
        }
    })
        .then(response => response.json())
        .then(retorno => {
            pacienteNome.textContent = retorno.pacienteNome;
            criadoPor.textContent = retorno.usuarioNome;
            for (const key in retorno) {
                if (retorno.hasOwnProperty(key)) {
                    const value = retorno[key];
                    const input = document.querySelector(`[name=${key}]`);

                    if (input) {
                        switch (input.type) {
                            case 'radio':
                                const radioButton = document.querySelector(`input[type=radio][name=${key}][value="${value}"]`);
                                if (radioButton) {
                                    radioButton.checked = true;
                                }
                                break;
                            case 'checkbox':
                                if (value == true) {
                                    const checkbox = document.querySelector(`input[type=checkbox][name=${key}]`);
                                    if (checkbox) {
                                        checkbox.checked = true;
                                    }
                                }
                                break;
                            default:
                                input.value = value;
                        }
                    } else {
                        console.error(`Nenhum input encontrado para name="${key}"`);
                    }
                }
            }
        })
        .catch(error => {
            console.error(error);
        })
}

function atualizarRetorno() {
    const data = getData();
    const forbidden = false;
    return new Promise((resolve, reject) => {
        if (validateForm(formAddRetorno)) {
            fetch(urlApi + endpointRetornos + "/" + retornoId, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                },
                method: "PUT",
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        forbidden = true;
                        return Promise.reject();
                    }
                    goodWarning.textContent = "Retorno atualizada com sucesso!";
                    resolve(response);
                })
                .catch(error => {
                    if (forbidden) {
                        badWarning.textContent = "Dados inválidos.";
                    } else {
                        badWarning.textContent = "Erro na comunicação com a API.";
                    }
                    reject(error);
                })
        } else {
            badWarning.textContent = "Preencha todos os campos obrigatórios";
        }
    })
}

function getData() {
    // Seleciona todos os inputs e checkboxes dentro do formulário
    const inputs = document.querySelectorAll('.formAddRetorno input, .formAddRetorno select, .formAddRetorno textarea');
    const data = { usuarioId: usuarioId, };

    // Itera sobre cada elemento e adiciona seu valor ao objeto data
    inputs.forEach(input => {
        let value = input.value;

        if (input.type === 'checkbox') {
            value = input.checked;
        } else if (input.type === 'radio') {
            if (input.checked) {
                value = input.value;
            } else {
                return;
            }
        } else if (value === "") {
            value = null;
        }

        data[input.name] = value;
    });

    return data;
}

botaoDeletar.addEventListener("click", async () => {
    try {
        await deletarItem(retornoId, endpointRetornos);
        window.location.href = "formularios.html";
    } catch {
        verificarAutenticacao();
    }
});

verificarAutenticacao();
listarPacientesSelect(fPacienteSelect);
consultarRetorno();
showTab(currentTab);
