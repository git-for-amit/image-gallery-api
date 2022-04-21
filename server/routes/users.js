import express from 'express'
import User from '../models/user'
import bcrypt from 'bcrypt'
import { Secret } from '../config/secret';
import { sign } from 'jsonwebtoken';

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
    let secret = Secret.get();
    console.log("secret value ", secret);
    let payload = {
      email: user.email
    }
    let token = sign(payload, secret, { expiresIn: 1800 })
    console.log('token ', token)
    return res.status(200).send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      approved: user.approved,
      token: token
    });
  } catch (err) {
    res.status(500).send({ message: "User sign In failed!", err: err });
  }
});

router.post('/approve', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.body.id,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not found!" });
    }
    user.approved = req.body.approved
    await user.save();

    return res.status(200).send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      approved: user.approved
    });
  } catch (err) {
    res.status(500).send({ message: "User Approval failed!", err: err });
  }
});

export default router;
