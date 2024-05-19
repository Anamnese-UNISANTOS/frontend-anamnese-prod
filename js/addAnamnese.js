const formAddAnamnese = document.querySelector(".formAddAnamnese");
const selectPacientes = document.getElementById('selectPacientes');
const divStepButtons = document.querySelector(".div-step-buttons");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const tabs = document.getElementsByClassName("tab");
const fPacienteId = document.getElementById("selectPacientes");
const fEscolaridade = document.getElementById("escolaridade");
const fPeriodoEstudo = document.getElementById("periodoEstudo");
const fLancheEstudo = document.getElementById("lancheEstudo");
const fPeriodoTrabalho = document.getElementById("periodoTrabalho");
const fLancheTrabalho = document.getElementById("lancheTrabalho");
const fProfissao = document.getElementById("profissao");
const fRendaFamiliar = document.getElementById("rendaFamiliar");
const fNumPessoasDomicilio = document.getElementById("numPessoasDomicilio");
const fMotivo = document.getElementById("motivo");
const fApresentaDoenca = document.getElementById("apresentaDoenca");
const fAntecedentesFamiliares = document.getElementById("antecedentesFamiliares");
const fMedicamentosContinuos = document.getElementById("medicamentosContinuos");
const fSuplementosComplementos = document.getElementById("suplementosComplementos");
const fFrequenciaEvacuacao = document.getElementById("frequenciaEvacuacao");
const fConsistenciaEvacuacao = document.getElementById("consistenciaEvacuacao");
const fPraticaAtvFisica = document.getElementById("praticaAtvFisica");
const fAtvFisica = document.getElementById("atvFisica");
let currentTab = 0;

// exibe os Anamneses no select do formulario
function listarPacientesSelect() {
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
        selectPacientes.appendChild(optionElement);
      });
    })
    .catch(error => {
      console.error(error);
      fallback.textContent = "Sem conexão com a API.";
    })
}

function cadastrarAnamnese() {
  return new Promise((resolve, reject) => {
    if (validateForm(formAddAnamnese)) {
      fetch(urlApi + endpointAnamneses, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        },
        method: "POST",
        body: JSON.stringify({
          pacienteId: fPacienteId.value,
          usuarioId: usuarioId,
          escolaridade: fEscolaridade.value,
          periodoEstudo: fPeriodoEstudo.value,
          lancheEstudo: fLancheEstudo.checked,
          periodoTrabalho: fPeriodoTrabalho.value,
          lancheTrabalho: fLancheTrabalho.checked,
          profissao: fProfissao.value,
          rendaFamiliar: fRendaFamiliar.value,
          numPessoasDomicilio: fNumPessoasDomicilio.value,
          motivo: fMotivo.value,
          apresentaDoenca: fApresentaDoenca.value,
          antecedentesFamiliares: fAntecedentesFamiliares.value,
          medicamentosContinuos: fMedicamentosContinuos.value,
          suplementosComplementos: fSuplementosComplementos.value,
          frequenciaEvacuacao: fFrequenciaEvacuacao.value,
          consistenciaEvacuacao: fConsistenciaEvacuacao.value,
          praticaAtvFisica: fPraticaAtvFisica.checked,
          atvFisica: fAtvFisica.value
        })
      })
        .then(response => {
          if (!response.ok) {
            forbidden = true;
            return Promise.reject();
          }
          goodWarning.textContent = "Anamnese cadastrada com sucesso!";
          resetForm(formAddAnamnese);
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
    }
  })
}

async function showTab(n) {
  tabs[n].style.display = "flex";
  tabs[n].style.flexDirection = "column";
  tabs[n].style.gap = "10px";

  if (n == 0) {
    prevBtn.style.display = "none";
    divStepButtons.style.flexDirection = "row-reverse"
  } else if (n == (tabs.length - 1)) {
    nextBtn.textContent = "Enviar";
    prevBtn.style.display = "inline";
  } else {
    divStepButtons.style.flexDirection = "row"
    prevBtn.style.display = "inline";
  }

  fixStepIndicator(n)
}

async function nextTab() {
  if (currentTab >= tabs.length - 1) {
    try {
      await cadastrarAnamnese();
      window.location.href = "formularios.html";
    }
    catch (error) {
      verificarAutenticacao();
    }
  } else {
    tabs[currentTab].style.display = "none";
    currentTab += 1;
    showTab(currentTab);
  }
}

function prevTab() {
  tabs[currentTab].style.display = "none";
  currentTab -= 1;
  showTab(currentTab);
}

function fixStepIndicator(n) {
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";
}

verificarAutenticacao();
listarPacientesSelect();
showTab(currentTab);
