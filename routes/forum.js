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
    const newPost = new Forum({
        title,
        content,
        author: req.session.user._id
    });

    try {
        await newPost.save();
        res.status(201).send('Post adicionado com sucesso');
    } catch (error) {
        res.status(500).send('Erro ao adicionar post');
    }
});

module.exports = router;