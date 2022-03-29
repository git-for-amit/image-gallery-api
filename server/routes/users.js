import express from 'express'
import User from '../models/user'
import bcrypt from 'bcrypt'

var router = express.Router();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll()
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: "User load user list!", err: err });
  }
});

router.post('/sign-up', async (req, res, next) => {
  try {
    const user = await User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });
    res.status(200).send({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: "User registration failed!", err: err });
  }
});

router.post('/sign-in', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found!" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    return res.status(200).send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
  } catch (err) {
    res.status(500).send({ message: "User sign In failed!", err: err });
  }
});


export default router;
