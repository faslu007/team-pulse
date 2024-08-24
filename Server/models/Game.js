import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const slideSchema = new Schema({
    order: {
        type: Number,
        required: true
    },
    contentType: {
        type: String,
        enum: ['audio', 'video', 'richText', 'image'],
        required: true
    },
    richTextContent: {
        type: String,
        trim: true
    },
    mediaUri: {
        type: String,
    }
});

const teamSchema = new Schema({
    teamName: {
        type: String,
        required: true,
        trim: true
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

const gameSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    slides: [slideSchema],
    teams: [teamSchema],
    members: [memberSchema],
    memberScores: [scoreSchema],
    buzzer: buzzerSchema,
    buzzerInteractions: [buzzerInteractionSchema]
}, {
    timestamps: true
});

const Game = model('Game', gameSchema);

export default Game;