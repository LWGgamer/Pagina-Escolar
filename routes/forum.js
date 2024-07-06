const express = require('express');
const router = express.Router();
const Forum = require('../models/Forum');
const User = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const posts = await Forum.find().populate('author', 'username').exec();
        res.json(posts);
    } catch (error) {
        res.status(500).send('Erro ao buscar posts do fórum');
    }
});

router.post('/', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).send('Não autorizado');
    }

    const { title, content } = req.body;
    console.log('Dados recebidos do formulário:', req.body); // Verifica se os dados do formulário estão sendo recebidos corretamente

    const newPost = new Forum({
        title,
        content,
        author: req.session.user._id
    });

    try {
        console.log('Novo post a ser salvo:', newPost); // Verifica se o objeto newPost está correto antes de salvar
        await newPost.save();
        res.status(201).send('Post adicionado com sucesso');
    } catch (error) {
        console.error('Erro ao adicionar post:', error); // Verifica se há algum erro ao tentar salvar no banco de dados
        res.status(500).send('Erro ao adicionar post');
    }
});

module.exports = router;
