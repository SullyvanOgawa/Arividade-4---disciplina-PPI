import express from 'express';
import autenticador from './Security/autenticator.js';
import session from 'express-session';


const host = '0.0.0.0';
const port = 4000; 
const app = express();

app.use(session({
    secret: '123456', 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        secure: false, 
        httpOnly: true, 
        maxAge: 1000 * 60 * 60
    }
}));


app.use(express.urlencoded({extended: true}));
app.use(express.static('Views/public'));

app.post("/login", (requisicao, resposta) => {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;

    if(usuario === 'admin' && senha === '123'){
        requisicao.session.usuarioLogado = true;
        resposta.redirect('/menu.html');
    }
    else{
        resposta.redirect('/login.html');
    }
});

// redireciona sempre para tela de login quando usuario não está logado, mesmo que ele digite outro caminho na URL. 
app.get("/login", (requisicao, resposta) => {
    resposta.redirect('public/login.html');
});

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect('/login.html');
});

// A função autenticador vai liberar a conexão (quando correta) ao usuário. 
app.use(autenticador, express.static('Views/private'));

app.listen(port, host, () => {
    console.log(`Conectou http://${host}:${port}`);
});
