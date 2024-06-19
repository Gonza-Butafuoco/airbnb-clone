const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId , ref:'userModel'},
    title : String,
    address: String,
    photos: [String],
    description : String,
    perks: [String],
    extraInfo: String,
    checkin: Number,
    checkout: Number,
    maxGuests: Number,
});

const placeMolde = mongoose.model('place' , placeSchema);

module.exports = placeMolde;