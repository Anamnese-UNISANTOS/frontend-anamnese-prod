const formAddAnamnese = document.querySelector(".formAddAnamnese");
const pacienteNome = document.getElementById("pacienteNome");
const criadoPor = document.getElementById("criadoPor");
const anamneseId = localStorage.getItem("anamneseId");
const divStepButtons = document.querySelector(".div-step-buttons");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const tabs = document.getElementsByClassName("tab");
const fPacienteSelect = document.getElementById("pacienteSelect");
const botaoDeletar = document.getElementById("botaoDeletar");
let currentTab = 0;

function consultarAnamnese() {
    fetch(urlApi + endpointAnamneses + "/" + anamneseId, {
        headers: {
            "Authorization": `${token}`
        }
    })
        .then(response => response.json())
        .then(anamnese => {
            pacienteNome.textContent = anamnese.pacienteNome;
            criadoPor.textContent = anamnese.usuarioNome;
            for (const key in anamnese) {
                if (anamnese.hasOwnProperty(key)) {
                    const value = anamnese[key];
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

function atualizarAnamnese() {
    const data = getData();
    const forbidden = false;
    return new Promise((resolve, reject) => {
        if (validateForm(formAddAnamnese)) {
            fetch(urlApi + endpointAnamneses + "/" + anamneseId, {
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
                    goodWarning.textContent = "Anamnese atualizada com sucesso!";
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

async function showTab(n) {
    tabs[n].style.display = "block"

    if (n == 0) {
        prevBtn.style.display = "none";
        divStepButtons.style.flexDirection = "row-reverse"
    } else if (n == (tabs.length - 1)) {
        nextBtn.textContent = "Atualizar";
        prevBtn.style.display = "inline";
    } else {
        nextBtn.textContent = "Próximo";
        divStepButtons.style.flexDirection = "row"
        prevBtn.style.display = "inline";
    }
    fixStepIndicator(n)
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

function getData() {
    // Seleciona todos os inputs e checkboxes dentro do formulário
    const inputs = document.querySelectorAll('.formAddAnamnese input, .formAddAnamnese select, .formAddAnamnese textarea');
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
        await deletarItem(anamneseId, endpointAnamneses);
        window.location.href = "formularios.html";
    } catch {
        verificarAutenticacao();
    }
});

verificarAutenticacao();
listarPacientesSelect(fPacienteSelect);
consultarAnamnese();
showTab(currentTab);
