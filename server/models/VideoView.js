const mongoose = require('mongoose');

const videoViewSchema = mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    viewer: { // Puede ser el ID del usuario o la IP
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Expira en 24 horas (86400 segundos)
    }
});

const VideoView = mongoose.model('VideoView', videoViewSchema);
module.exports = { VideoView };
