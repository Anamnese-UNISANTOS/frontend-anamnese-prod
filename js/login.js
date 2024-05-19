const formLogin = document.getElementById("formLogin");
const fMatricula = document.getElementById("matricula");
const fSenha = document.getElementById("senha");

function fazerLogin() {
    let forbidden = false;
    fetch(urlApi + endpointAuth, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ login: fMatricula.value, password: fSenha.value })
    })
        .then(response => {
            if (!response.ok) {
                forbidden = true;
                return Promise.reject();
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("usuarioId", data.usuarioId);
            localStorage.setItem("usuarioNome", data.usuarioNome);
            localStorage.setItem("jwtToken", data.token);
            window.location.href = "pacientes.html";
        })
        .catch(() => {
            if (forbidden) {
                badWarning.textContent = "Matrícula ou senha incorretos.";
            } else {
                badWarning.textContent = "Erro na comunicação com a API.";
            }
        })
}


formLogin.addEventListener('submit', event => {
    event.preventDefault();
    fazerLogin();
})
