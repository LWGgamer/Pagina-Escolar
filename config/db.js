const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://lucaswggames:Zh6RvQHUGwR8c8cQ@teste.s9ecoec.mongodb.net/?retryWrites=true&w=majority&appName=Teste', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB conectado...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
