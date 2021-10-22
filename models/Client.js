const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: "Client"
    }
})

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
