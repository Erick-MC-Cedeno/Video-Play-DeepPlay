const mongoose = require('mongoose');

const videoViewSchema = mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    },
    viewer: { 
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 
    }
});

const VideoView = mongoose.model('VideoView', videoViewSchema);
module.exports = { VideoView };
