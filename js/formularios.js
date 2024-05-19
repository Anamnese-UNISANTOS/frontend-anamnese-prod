const formAddAnamnese = document.querySelector(".formAddAnamnese");
const fNome = document.getElementById("nome");
const fSexo = document.getElementById("sexo");
const fDataNasc = document.getElementById("dataNasc");
let itensTabela = "";

function listarAnamneses() {
    fetch(urlApi + endpointAnamneses, {
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

/* formAddAnamnese.addEventListener("submit", async event => {
    event.preventDefault();
    badWarning.textContent = "";
    goodWarning.textContent = "";
    try {
        await cadastrarAnamnese();
        limparTabela();
        listarAnamneses();
    } catch {
        verificarAutenticacao();
    }
}); */

verificarAutenticacao();
listarAnamneses();
