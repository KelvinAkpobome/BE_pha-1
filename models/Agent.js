const mongoose = require('mongoose');
require('../models/Post');

const AgentSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone_no: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    verification_token: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: "Agent"
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 0
    },
    block: {
        type: Boolean,
        default: false
    },
    post_id: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref :"Post"
    }]
})

const Agent = mongoose.model("Agent", AgentSchema);

module.exports = Agent;
