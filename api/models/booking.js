const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId , required : true  },
    accommodation : {type: mongoose.Schema.Types.ObjectId , required : true, ref:'place'},
    checkIn: {type: Date , required: true},
    checkOut: {type: Date , required: true},
    name: {type:String , required: true},
    mobile: {type: String , required:true},
    price : Number,
});

const BookingModel = mongoose.model('Booking' , bookingSchema);

module.exports = BookingModel