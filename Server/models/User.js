import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    customUserId: {
        type: Number,
        unique: true,
    },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    notificationSound: { type: Boolean, default: false },
    password: { type: String },
    isActive: { type: Boolean, default: true },
    photoURL: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
    {
        timestamps: true,
        toJSON: { virtuals: true, getters: true },
        toObject: { virtuals: true, getters: true },
    });

// Custom pre-save middleware to auto-increment 'customUserId'
userSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            // Find the maximum 'customUserId' in the collection
            const highestCustomUserId = await this.constructor.findOne()
                .sort({ customUserId: -1 })
                .select('customUserId')
                .lean()
                .exec();

            // Increment 'customUserId' for the new document
            this.customUserId = (highestCustomUserId ? highestCustomUserId.customUserId : 0) + 1;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Virtual field for full name
userSchema.virtual('displayName').get(function () {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

const User = mongoose.model('User', userSchema);

export default User;
