import mongoose from 'mongoose'
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
        type: String,
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

const scoreSchema = new Schema({
    participant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        default: 0
    }
});

const gameSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    slides: [slideSchema],
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'  // User reference
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'  // Team reference
        }
    }],
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'  // Team reference
    }],
    scores: [scoreSchema],
    buzzer: buzzerSchema,
    buzzerInteractions: [buzzerInteractionSchema]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Game = model('Game', gameSchema);

export { Game };