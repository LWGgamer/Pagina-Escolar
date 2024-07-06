const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();

mongoose.connect('mongodb+srv://lucaswggames:Zh6RvQHUGwR8c8cQ@teste.s9ecoec.mongodb.net/?retryWrites=true&w=majority&appName=Teste', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch(err => {
    console.error('Erro ao conectar ao MongoDB', err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Simulando um banco de dados de usuários
const users = {
    'admin': { password: 'admin123', role: 'professor' }
};

// Middleware de autenticação
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

const isAuthorized = (req, res, next) => {
    if (req.session.user && (req.session.role === 'professor' || req.session.role === 'coordenador')) {
        next();
    } else {
        res.status(403).send('Acesso negado.');
    }
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        req.session.user = username;
        req.session.role = users[username].role;
        res.redirect('/dashboard.html');
    } else {
        res.status(401).send('Login falhou');
    }
});

app.get('/dashboard.html', isAuthenticated, isAuthorized, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.use('/api', isAuthenticated);

const gradesRouter = require('./routes/grades');
const calendarRouter = require('./routes/calendar');
const activitiesRouter = require('./routes/activities');

app.use('/api/grades', gradesRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/activities', activitiesRouter);

// Modelo e rota do Fórum
const forumSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String
});

const Forum = mongoose.model('Forum', forumSchema);

app.post('/api/forum', isAuthenticated, isAuthorized, (req, res) => {
    const { title, content } = req.body;
    const newPost = new Forum({
        title,
        content,
        author: req.session.user
    });
    newPost.save()
        .then(post => res.status(201).json(post))
        .catch(err => res.status(500).json(err));
});

app.get('/api/forum', (req, res) => {
    Forum.find().exec()
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(500).json(err));
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
