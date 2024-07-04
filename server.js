const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const gradesRoutes = require('./routes/grades');
const calendarRoutes = require('./routes/calendar');
const activitiesRoutes = require('./routes/activities');

const app = express();
const port = process.env.PORT || 3000;

// Conexão com MongoDB Atlas
const dbURI = 'mongodb+srv://lucaswggames:Zh6RvQHUGwR8c8cQ@teste.s9ecoec.mongodb.net/';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado ao MongoDB!');
}).catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
});

app.use(bodyParser.json());

app.use('/api/grades', gradesRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/activities', activitiesRoutes);

// Configuração para servir arquivos estáticos
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
