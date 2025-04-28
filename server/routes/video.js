const express = require('express');
const router = express.Router();
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');
const { User } = require("../models/User");
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber"); 
const { auth } = require("../middleware/auth");
const { VideoView } = require("../models/VideoView");
const { v4: uuidv4 } = require('uuid');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('Only MP4 is supported'), false);
        }
        cb(null, true)
    }
})
var upload = multer({ storage: storage }).single("file")



router.post("/uploadfiles", (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })
});



router.post("/thumbnail", (req, res) => {
    let thumbsFilePath = "";
    let fileDuration = "";
    ffmpeg.ffprobe(req.body.filePath, function(err, metadata) {
        fileDuration = metadata.format.duration;
    })
    ffmpeg(req.body.filePath)
        .on("filenames", function(filenames) {
            thumbsFilePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            return res.json({success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
        })
        .screenshots({
            count: 1,
            folder: 'uploads/thumbnails',
            size:"320x240",
            filename: "thumbnail-%b.png"
        });
});



router.post("/uploadVideo", (req, res) => {
    const video = new Video(req.body);
    video.save((err, video) => {
        if (err) {
            return res.status(400).json({success: false, err})
        }
        return res.status(200).json({success: true});
    })
});



router.get("/getVideos", (req, res) => {
    Video.find().populate('writer').exec((err, videos) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.status(200).json({success: true, videos});
    })
});



router.post("/getVideo", (req, res) => { 
    const { videoId } = req.body;
    if (!videoId) return res.status(400).json({ success: false, message: "videoId es requerido" });
    Video.findOne({ "_id": videoId }).populate('writer').exec(async (err, video) => {
        if(err) return res.status(400).send(err);
        if(!video) return res.status(404).json({ success: false, message: "Video no encontrado" });
        let viewerEmail;
        if (req.user) {
            viewerEmail = req.user.email; 
        } else {
            viewerEmail = req.cookies.sessionId || uuidv4(); 
            res.cookie('sessionId', viewerEmail, { 
                maxAge: 365 * 24 * 60 * 60 * 1000, 
                httpOnly: true 
            });
        }
        const ipAddress = req.ip.replace(/[:.]/g, '');
        const existingView = await VideoView.findOne({
            video: video._id,
            $or: [
                { viewer: viewerEmail }, 
                { ipAddress: ipAddress }
            ],
            createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) }
        });
        if (!existingView) {
            const newView = new VideoView({
                video: video._id,
                viewer: viewerEmail, 
                ipAddress: ipAddress,
                userAgent: req.headers['user-agent']
            });
            await newView.save();
            await Video.updateOne({ _id: video._id }, { $inc: { views: 1 } });
        }
        res.status(200).json({ success: true, video });
    });
});



router.post("/getSubscriptionVideos", (req, res) => {
    Subscriber.find({ 'userFrom': req.body.userFrom })
    .exec((err, subscribers)=> {
        if(err) return res.status(400).send(err);
        let subscribedUser = [];
        subscribers.map((subscriber, i)=> {
            subscribedUser.push(subscriber.userTo)
        })
        Video.find({ writer: { $in: subscribedUser }})
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success: true, videos })
            })
    })
});
module.exports = router;
