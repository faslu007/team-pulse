import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const roomSchema = new Schema({
    roomName: {
        type: String,
        required: true,
        trim: true,
        unique: true
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
        required: true
    },
    roomExpiresAt: {
        type: Date,
        required: true
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
    timestamps: true
});

const Room = model('Room', roomSchema);

export default Room;
