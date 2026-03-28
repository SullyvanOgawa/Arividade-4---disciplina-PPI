
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
                            <td><button class="btn btn-warning" onclick="selecionarCurso">Selecionar</button></td>

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

consultarCurso();
buscarCursos();