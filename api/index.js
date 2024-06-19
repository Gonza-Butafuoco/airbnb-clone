const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('./models/users');
const cookieParser = require('cookie-parser')
const imageDownloader = require('image-downloader')
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'Lorem ipsum dolor sit amet consectetur adipisicing elit'

app.use(express.json());
app.use(cookieParser());
app.use('/uploads' , express.static(__dirname + '/uploads'))
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

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        const passOk = bcrypt.compareSync(password, user.password);
        if (passOk) {
            jwt.sign({ email: user.email, id: user._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token).json(user);
            });
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            const { name, email, _id } = await userModel.findById(userData.id)
            res.json({ name, email, _id })
        });
    } else {
        res.json(null);
    }
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
});

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;

    if (!link) {
        return res.status(400).json({ error: 'No link provided' });
    }

    const newName = 'photo' + Date.now() + '.jpg';
    
    try {
        await imageDownloader.image({
            url: link,
            dest: __dirname + '/uploads/' + newName,
        });
        res.json(newName);
    } catch (error) {
        console.error('Error downloading image:', error);
        res.status(500).json({ error: 'Error downloading image' });
    }
});

const photosMiddleware= multer({dest:'uploads'})

app.post('/upload', photosMiddleware.array('photos' , 100),(req,res) => {
    const uploadedFiles= [];
    for (let i = 0; i < files.length; i++){
        const {path ,originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path , newPath);
        uploadedFiles.push(newPath.replace('uploads/' , ''));
       }
    res.json(uploadedFiles);
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});