
const urlBackend = "http://localhost:5000";

function consultarCurso(){

    const elementoSelectProfessor = document.getElementById("professor");

    fetch(urlBackend + "/professores", {
        method: "GET"
    })
    .then((resposta) => {
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((conteudoJSON) => {
        if(conteudoJSON.status){
            for(const professor of conteudoJSON.professores){
                const opcao = document.createElement("option");
                opcao.value = professor.id;
                opcao.textContent = professor.nome;
                elementoSelectProfessor.appendChild(opcao);
            }
        }
        else{
          mostrarMensagem("danger", conteudoJSON.mensagem)
        }
    })
    .catch((erro) => {
        mostrarMensagem("danger", "Erro ao obter lista de cidade!" + erro);
    });

   
}

function mostrarMensagem(tipo ="sucess", mensagem = "Mensagem Padrão") {
    const divMensagem = document.getElementById("mensagem");
    divMensagem.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${mensagem}
        </div>
    `;
    setTimeout(() => {
        divMensagem.innerHTML = "";
    }, 5000);
    
}