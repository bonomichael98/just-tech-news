const router = require('express').Router();
const {User} = require('../../models');

//GET /api/users
router.get('/', (req, res) => {
    //access our model and run .findAll() method
    User.findAll({
        attribute: {exclude: ['password']}
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {exclude: ['password']},
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'no user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
    //expects {username: 'bigbono98', email: 'bonomichael98@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//post login
router.post('/login', (req, res) => {
    //query operation
    //expects {email: 'bonomichael98@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email:req.body.email
        }
    }) .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({message: 'no user with that email address'});
            return;
        }
        res.json({user: dbUserData});
        //verify user
        const validPassword = dbUserData.checkPassword(res.body.password);
        if (!validPassword) {
            res.status(400).json({message: 'incorrect password'});
            return;
        }
        res.json({user: dbUserData, message: 'you are now logged in'})
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    //expect {username: 'bigbono98', email: 'bonomichael98@gmail.com', password: 'password1234'}
    //if req.body has exact key/value paits to match the model, you can juse use 'req.body' instead
    //update method combines the parameters for creating data and looking up data
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then (dbUserData => {
        if(!dbUserData[0]) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.paramams.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;