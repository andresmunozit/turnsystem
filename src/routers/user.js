const express = require('express');
const User = require('../models/user');
const { formatQuery } = require('../helpers/formatQuery')

const router = express.Router();

router.get('/users', async (req, res) => {
   
    const { sort, filter, limit, skip, error } = formatQuery(req.query);
    if(error) return res.status(500).send({error});

    try {
        const users = await User
            .find(filter)
            .sort(sort)
            .limit(limit)
            .skip(skip);
        res.send({data: {users}});
    } catch (e) {
        res.status(500).send({error: e.toString()});
    };

});

router.get('/users/:id', (req, res) => {

});

router.post('/users', (req, res) => {

});

router.patch('/users/:id', (req, res) => {

});

router.delete('/users/:id', (req, res) => {

});

module.exports = router;