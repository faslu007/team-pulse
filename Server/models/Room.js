import mongoose from 'mongoose';
import moment from "moment-timezone"

const { Schema, model } = mongoose;


const roomSchema = new Schema({
    roomName: {
        type: String,
        required: true,
        trim: true,
    },
    roomType: {
        type: String,
        enum: ['vote', 'game'],
        required: true
    },
    roomStatus: {
        type: String,
        enum: ['draft', 'publish', 'archived'],
        default: 'draft'
    },
    roomStartsAt: {
        type: Date,
        required: true,
        set: (value) => moment.parseZone(value).toDate(), // Convert to Date object
        get: (value) => moment(value).format('ddd MMM DD YYYY HH:mm:ss [GMT]Z (z)') // Format for output
    },
    roomExpiresAt: {
        type: Date,
        required: true,
        set: (value) => moment.parseZone(value).toDate(), // Convert to Date object
        get: (value) => moment(value).format('ddd MMM DD YYYY HH:mm:ss [GMT]Z (z)') // Format for output
    },
    adminUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
});

const Room = model('Room', roomSchema);

export default Room;


// Query Example Usage for date
// const YourModel = mongoose.model('YourModel', yourSchema);

// // Convert local time range to UTC
// const localStartTime = 'Sun Aug 25 2024 10:00:00 GMT+0530';
// const localEndTime = 'Sun Aug 25 2024 12:00:00 GMT+0530';

// const utcStartTime = moment.parseZone(localStartTime).utc().toDate();
// const utcEndTime = moment.parseZone(localEndTime).utc().toDate();

// // Query MongoDB for documents within the time range
// YourModel.find({
//     roomStartsAt: { $gte: utcStartTime },
//     roomExpiresAt: { $lte: utcEndTime }
// })
//     .then(docs => {
//         console.log('Documents found:', docs);
//     })
//     .catch(err => {
//         console.error('Error:', err);
//     });

