const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userModel = require('./models/users');
const placeModel = require('./models/places')
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
app.use('/uploads', express.static(__dirname + '/uploads'))
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

const upload = multer({ dest: 'uploads/' });

const photosMiddleware = upload.array('photos', 100);

app.post('/upload', photosMiddleware, (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path: tempPath, originalname } = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = `${tempPath}.${ext}`;
        fs.renameSync(tempPath, newPath);
        uploadedFiles.push(newPath.replace(/\\/g, '/').replace('uploads/', ''));
    }
    res.json(uploadedFiles);
});

app.post('/accommodations', (req, res) => {
    const { token } = req.cookies
    const { title,
        address,
        addedPhotos,
        description,
        selectedPerks,
        extraInfo,
        checkin,
        checkout,
        maxGuests, 
        price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await placeModel.create({
            owner: userData.id,
            title,
            address,
            photos: addedPhotos,
            description,
            perks: selectedPerks,
            extraInfo,
            checkin,
            checkout,
            maxGuests,
            price,
        });
        res.json(placeDoc)
    });
});

app.put('/accommodations', async (req, res) => {
    try {
        const { token } = req.cookies;
        const { id, title, address, addedPhotos, description, selectedPerks, extraInfo, checkin, checkout, maxGuests , price } = req.body;
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }


            const placeDoc = await placeModel.findById(id);


            if (userData.id !== placeDoc.owner.toString()) {
                return res.status(403).json({ error: 'Forbidden' });
            }


            placeDoc.set({
                title,
                address,
                photos: addedPhotos,
                description,
                perks: selectedPerks,
                extraInfo,
                checkin,
                checkout,
                maxGuests,
                price,
            });


            await placeDoc.save();


            res.json(placeDoc);
        });
    } catch (error) {
        console.error('Error en PUT /accommodations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/accommodations', (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        const { id } = userData;
        try {
            const accommodations = await placeModel.find({ owner: id });
            res.json(accommodations);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch accommodations' });
        }
    });
});

app.get('/all-accommodations', async (req, res) => {
    try {
        const accommodations = await placeModel.find({});
        res.json(accommodations);
    } catch (error) {
        console.error('Error fetching all accommodations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/accommodations/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await placeModel.findById(id))
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});
