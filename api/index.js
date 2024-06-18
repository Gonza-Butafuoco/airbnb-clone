const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('./models/users');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'Lorem ipsum dolor sit amet consectetur adipisicing elit' 

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/test', (req, res) => {
    res.json("test ok");
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Encriptar la contraseña
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);

    try {
        // Crear un nuevo usuario
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // Devolver el usuario creado como respuesta
        res.json(user);
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(422).json(e);
        res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
});

app.post('/login' ,  async (req, res) => {
  const {email , password} =  req.body;
  const user = await userModel.findOne({email})
  if (user) {
    const passOk = bcrypt.compareSync(password, user.password)
    if (passOk){
        jwt.sign({email:user.email , id:user._id} ,jwtSecret , {} , (err, token) => {
          if(err) throw err;
          res.cookie('token' , token ).json(user)
        });
    }else{
        res.json('pass not ok')
    }
  }else {
    res.json('not found')
  }
});

app.get('/profile' ,(req,res) => {
    res.json('user info')
} )

app.listen(4000, () => {
    console.log('Server running on port 4000');
});
