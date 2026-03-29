const urlBackend = "http://localhost:5000";

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
                const exibirCursos = document.getElementById("exibirCursos");
                exibirCursos.innerHTML = "";
                const tabela = document.createElement("table");
                tabela.className = "table table-striped table hover table-bordered";

                const cabecalhoTabela = document.createElement("thead");
                cabecalhoTabela.innerHTML = `
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nome do Curso</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Carga Horária</th>
                    </tr>`;

                    tabela.appendChild(cabecalhoTabela);
                    const corpoTabela = document.createElement("tbody");
                    for(const curso of conteudoJSON.cursos){
                        const linha = document.createElement("tr");
                        linha.innerHTML = `
                            <td>${curso.id}</td>
                            <td>${curso.nome}</td>
                            <td>${curso.descricao}</td>
                            <td>${curso.cargaHoraria}</td>`;
                        
                        corpoTabela.appendChild(linha);
                    }

                    tabela.appendChild(corpoTabela);
                    exibirCursos.appendChild(tabela);
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

buscarCursos();

setInterval(() => {
    buscarCursos();
}, 3000);