const urlBackendProf = "http://localhost:5000";

console.log(urlBackend);
function buscarProfessores(){
    fetch(urlBackendProf + "/professores", {
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
                const exibirProfessores = document.getElementById("exibirProfessores");
                exibirProfessores.innerHTML = "";
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
                `;

                    corpoTabela.appendChild(linhaTabela);
                }
                tabela.appendChild(corpoTabela);
                exibirProfessores.appendChild(tabela);
                
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

buscarProfessores();

setInterval(() => {
    buscarProfessores();
}, 3000);