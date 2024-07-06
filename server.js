const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/seu-banco-de-dados', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch(err => {
    console.error('Erro ao conectar ao MongoDB', err);
});

// Middleware de parse de JSON e URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de sessão
app.use(session({
    secret: 'sua-chave-secreta',
    resave: false,
    saveUninitialized: true
}));

// Modelo de Usuário (exemplo básico)
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String // 'professor' ou 'coordenador'
});

const User = mongoose.model('User', userSchema);

// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

// Middleware de autorização
const isAuthorized = (req, res, next) => {
    if (req.session.user && (req.session.role === 'professor' || req.session.role === 'coordenador')) {
        next();
    } else {
        res.status(403).send('Acesso negado.');
    }
};

// Rota de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password }).exec();
        if (user) {
            req.session.user = user.username;
            req.session.role = user.role;
            res.redirect('/dashboard.html');
        } else {
            res.status(401).send('Login falhou');
        }
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).send('Erro ao realizar login');
    }
});

// Rota para dashboard
app.get('/dashboard.html', isAuthenticated, isAuthorized, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Modelo e rota do Fórum
const forumSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String
});

const Forum = mongoose.model('Forum', forumSchema);

// Rota para adicionar uma nova postagem
app.post('/api/forum', isAuthenticated, isAuthorized, async (req, res) => {
    const { title, content } = req.body;
    const newPost = new Forum({
        title,
        content,
        author: req.session.user
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Erro ao adicionar postagem:', error);
        res.status(500).json({ error: 'Erro ao adicionar postagem' });
    }
});


app.get('/api/forum', async (req, res) => {
    try {
        const posts = await Forum.find().exec();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Erro ao buscar postagens:', error);
        res.status(500).json({ error: 'Erro ao buscar postagens do fórum' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
