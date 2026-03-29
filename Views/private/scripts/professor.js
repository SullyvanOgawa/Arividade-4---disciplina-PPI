const urlBackend = "http://localhost:5000";

function obterProfessores(){
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
            if(conteudoJSON.professores.length == 0){
                mostrarMensagem("Warning", "Desculpe, Nenhum Professor foi Encontrado!");
            }
            else{
                const exibeProfessor = document.getElementById("exibeProfessor");
                exibeProfessor.innerHTML = "";
                const tabela = document.createElement("table");
                tabela.className = "table table-striped table hover table-bordered";

                const cabecalhoTabela = document.createElement("thead");
                cabecalhoTabela.innerHTML = `
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nome do Professor</th>
                        <th scope="col">Especialidade</th>
                    </tr>`;

                tabela.appendChild(cabecalhoTabela);
                const corpoTabela = document.createElement("tbody");
                for(const professor of conteudoJSON.professores){
                    const linhaTabela = document.createElement("tr");
                    linhaTabela.innerHTML = `
                        <td>${professor.id}</td>
                        <td>${professor.nome}</td>
                        <td>${professor.especialidade}</td>
                        <td><button type="button" class="btn btn-warning" 
                        onclick="selecionarProfessores(${professor.id}, 
                                                    '${professor.nome}', 
                                                    '${professor.especialidade}')">
                                                    Selecionar</button></td>`;

                    corpoTabela.appendChild(linhaTabela);
                }
                tabela.appendChild(corpoTabela);
                exibeProfessor.appendChild(tabela);
                
            }
        }
        else{
            mostrarMensagem("danger", conteudoJSON.mensagem)
        }
    })
    .catch((erro) => {
        mostrarMensagem("danger", "Erro ao obter lista de professores!" + erro);
    })
}

function cadastrarProfessor(){
    const formProfessor = document.getElementById("formProfessores");
    if(formProfessor.checkValidity()){
        const professor = {
            nome: document.getElementById("nomeProf").value,
            especialidade: document.getElementById("especialidade").value
        }
        fetch(urlBackend + "/professores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(professor)
        })
        .then((resposta) => {
            if(resposta.ok){
                return resposta.json();
            }
        })
        .then((conteudoJSON) => {
            if(conteudoJSON.status){
                mostrarMensagem("success", conteudoJSON.mensagem);
                limparFormulario();
                obterProfessores();
            }
            else{
                mostrarMensagem("danger", conteudoJSON.mensagem);
            }
        })
        .catch((erro) => {
            mostrarMensagem("danger", "Erro ao cadastrar o professor!" + erro);
        })                  
    }}


function atualizarProfessor(){
    const formProfessor = document.getElementById("formProfessores");
    if(formProfessor.checkValidity()){
        const professor = {
            id: document.getElementById("id").value,
            nome: document.getElementById("nomeProf").value,
            especialidade: document.getElementById("especialidade").value
        }
        fetch(urlBackend + "/professores/" + professor.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(professor)
        })
        .then((resposta) => {
            if(resposta.ok){
                return resposta.json();
            }
        })
        .then((conteudoJSON) => {
            if(conteudoJSON.status){
                mostrarMensagem("success", conteudoJSON.mensagem);
                limparFormulario();
                obterProfessores();
            }
            else{
                mostrarMensagem("danger", conteudoJSON.mensagem);
            }
        })
        .catch((erro) => {
            mostrarMensagem("danger", "Erro ao atualizar o professor!" + erro);
        })
    }
}

function excluirProfessor(id){
    fetch(urlBackend + "/professores/" + id, {
        method: "DELETE"
    })
    .then((resposta) => {
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((conteudoJSON) => {
        if(conteudoJSON.status){
            mostrarMensagem("success", conteudoJSON.mensagem);
            limparFormulario();
            obterProfessores();
        }
        else{
            mostrarMensagem("danger", conteudoJSON.mensagem);
        }
    })
    .catch((erro) => {
        mostrarMensagem("danger", "Erro ao excluir o professor!" + erro);
    })
}
    

function selecionarProfessores(id, nome, especialidade){

    document.getElementById("id").value = id;
    document.getElementById("nomeProf").value = nome;
    document.getElementById("especialidade").value = especialidade;
    

    document.getElementById("cadastrar").disabled = true;
    document.getElementById("atualizar").disabled = false;
    document.getElementById("excluir").disabled = false;
}

function resetarBotoes(){
    document.getElementById("cadastrar").disabled = false;
    document.getElementById("atualizar").disabled = true;
    document.getElementById("excluir").disabled = true;
      
}

function mostrarMensagem(tipo ="success", mensagem = "Mensagem Padrão") {
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

function limparFormulario(){
    const formCurso = document.getElementById("formProfessores");
    formCurso.classList.remove("was-validated");
    formCurso.reset();
}

obterProfessores();

const btnCadastrar = document.getElementById("cadastrar");
btnCadastrar.onclick = cadastrarProfessor;

const btnAtualizar = document.getElementById("atualizar");
btnAtualizar.onclick = atualizarProfessor;

const btnExcluir = document.getElementById("excluir");
btnExcluir.onclick = function () {
    if (confirm("Tem certeza que deseja excluir o Professor?")) {
        const id = document.getElementById("id").value;
        if(id){
            excluirProfessor(id);
            limparFormulario();
        } else {
            mostrarMensagem("warning", "Selecione um primeiro um Professor!");
        }
    }
}