const express = require('express');
const User = require('../models/user');
const { formatFilterSortPag } = require('../helpers/qsFilterSortPag');

const router = express.Router();

router.get('/users', async (req, res) => {
    
    const fsp = formatFilterSortPag(req.query);
    if(fsp.error) return res.status(500).send({error: fsp.error});

    const {filter, sort, limit, skip } = fsp;

    try {
        const users = await User.find(filter)
            .sort(sort)
            .limit(limit)
            .skip(skip);
        res.send({users});
    } catch (error) {
        res.status(500).send({error});
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