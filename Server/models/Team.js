import mongoose from 'mongoose'
const { Schema, model } = mongoose;

const teamSchema = new Schema({
    teamName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Team = model('Team', teamSchema);

export { Team };