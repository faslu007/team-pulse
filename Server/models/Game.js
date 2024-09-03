import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const slideSchema = new Schema({
    order: {
        type: Number,
        required: true
    },
    activeContentType: {
        type: String,
        enum: ['richText', 'mediaContent'],
        required: true
    },
    mediaContentType: {
        type: String,
        enum: ['audio', 'video', 'image'],
    },
    contentTypeExtension: {
        type: String,
    },
    mediaContentUri: {
        type: String,
    },
    richTextContent: {
        type: Object,
    },
});

const buzzerSchema = new Schema({
    status: {
        type: String,
        enum: ['freeze', 'on'],
        default: 'freeze'
    },
    buzzerTime: {
        type: Date,
        default: Date.now
    }
});

const buzzerInteractionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userTimeStamp: {
        type: Date,
        default: Date.now
    }
});


const teamSchema = new Schema({
    teamName: {
        type: String,
        required: true,
        trim: true
    }
});


const scoreSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        default: 0
    }
});

const memberSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teamId: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});


const gameSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    slides: [slideSchema],
    participants: [memberSchema],
    teams: [teamSchema],
    memberScores: [scoreSchema],
    buzzer: buzzerSchema,
    buzzerInteractions: [buzzerInteractionSchema]
}, {
    timestamps: true
});

const Game = model('Game', gameSchema);

export default Game;