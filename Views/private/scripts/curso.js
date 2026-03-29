
const urlBackend = "http://localhost:5000";

function obterProfessores(){

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

function buscarCursos(){
    fetch(urlBackend + "/cursos", {
        method: "GET"
    })
    .then((resposta) => {
        if(resposta.ok){
            return resposta.json();
        }
    })
    .then((conteudoJSON) => {
        if(conteudoJSON.status){
            if(conteudoJSON.cursos.length == 0){
                mostrarMensagem("Warning", "Desculpe, Nenhum Curso foi Encontrado!");
            }
            else{
                const exibeCurso = document.getElementById("exibeCurso");
                exibeCurso.innerHTML = "";
                const tabela = document.createElement("table");
                tabela.className = "table table-striped";

                const cabecalhoTabela = document.createElement("thead");
                cabecalhoTabela.innerHTML = `
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nome do Curso</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Carga Horária</th>
                        <th scope="col">Professor</th>
                    </tr>`;

                    tabela.appendChild(cabecalhoTabela);
                    const corpoTabela = document.createElement("tbody");
                    for(const curso of conteudoJSON.cursos){
                        const linha = document.createElement("tr");
                        linha.innerHTML = `
                            <td>${curso.id}</td>
                            <td>${curso.nome}</td>
                            <td>${curso.descricao}</td>
                            <td>${curso.cargaHoraria}</td>
                            <td>${curso.professor.nome}</td>
                            <td><button class="btn btn-warning" onclick="selecionarCurso(${curso.id}, 
                                                                                        '${curso.nome}', 
                                                                                        '${curso.descricao}', 
                                                                                        ${curso.cargaHoraria}, 
                                                                                        ${curso.professor.id})">Selecionar</button></td>

                        `;
                        
                        corpoTabela.appendChild(linha);
                    }

                    tabela.appendChild(corpoTabela);
                    exibeCurso.appendChild(tabela);
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

function cadastrarCurso(){
    const formCurso = document.getElementById("formCurso");
    if(formCurso.checkValidity()){
            const curso = {
            nome: document.getElementById("nomeCurso").value,
            descricao: document.getElementById("descricao").value,
            cargaHoraria: Number(document.getElementById("cargaHoraria").value),
            professor:{
                id: document.getElementById("professor").value
            }
        }
        fetch(urlBackend + "/cursos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(curso)
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
                buscarCursos();
            }
            else{
                mostrarMensagem("danger", conteudoJSON.mensagem)
            }
        })        
        .catch((erro) => {
            mostrarMensagem("danger", "Erro ao obter lista de cidade!" + erro);
        });
    }
    else{
        formCurso.classList.add("was-validated");
    }
}
    
function excluirCurso(id){
    fetch(urlBackend + "/cursos/" + id, {
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
            resetarBotoes();

            buscarCursos();
        }
        else{
            mostrarMensagem("danger", conteudoJSON.mensagem);
        }
    })
    .catch((erro) => {
        mostrarMensagem("danger", "Erro ao excluir o cliente!" + erro);
    });
}

function selecionarCurso(id, nome, descricao, cargaHoraria, professor){
    document.getElementById("id").value = id;
    document.getElementById("nomeCurso").value = nome;
    document.getElementById("descricao").value = descricao;
    document.getElementById("cargaHoraria").value = cargaHoraria;
    document.getElementById("professor").value = professor;

    document.getElementById("cadastrar").disabled = true;
    document.getElementById("atualizar").disabled = false;
    document.getElementById("excluir").disabled = false;

}

function limparFormulario(){
    const formCurso = document.getElementById("formCurso");
    formCurso.classList.remove("was-validated");
    formCurso.reset();
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

obterProfessores();
buscarCursos();

const btnCadastrar = document.getElementById("cadastrar");
btnCadastrar.onclick = cadastrarCurso;

const btnExcluir = document.getElementById("excluir");
btnExcluir.onclick = function () {
    if (confirm("Tem certeza que deseja excluir o Curso?")) {
        const id = document.getElementById("id").value;
        if(id){
            excluirCurso(id);
            limparFormulario();
        } else {
            mostrarMensagem("warning", "Selecione um primeiro um Curso!");
        }
    }
}