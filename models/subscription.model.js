import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLegth: 2,
        maxLength: 30
    },
    price: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Pirce must be greater than 0'],
        max: [1000, 'Price must be less than 1000']
    },
    currency: {
        type: String,
        enum: ['USD', "INR", "YEN"],
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['daily','weekly',"monthly", 'yearly']
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'music', 'education', 'tool', 'other'],
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["PENDING", 'ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'start Date can not be in future'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value >= this.startDate;
            },
            message: 'renewal Date can not be in past'
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true
    }
    
}, {timestamps: true});

subscriptionSchema.pre('save', function (next){
    if(!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    if (this.renewalDate < new Date()) {
        this.status = 'EXPIRED';
    }

    next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;