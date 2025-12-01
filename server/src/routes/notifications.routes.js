import express from "express";
import Notification from "../models/Notification.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

//GET notifications for user
router.get("/", requireAuth, async (req, res) => {
    try {
        const notification = await Notification.find({userId: req.user._id})
        .sort({createdAt: -1}) // most recent notification will appear first
        
        res.json(notification);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
});

//PATCH mark as read 
router.patch("/:id/read", requireAuth, async (req, res) =>{
    try{
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true},
            { new: true}
        );
        res.json(notification);
    }catch(err){
         res.status(500).json({ message: err.message });
    }
});

//DELETE single notification
router.delete("/:id", requireAuth, async (req, res) => {
    try{
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: "Notification deleted" });
    }catch(err){
     res.status(500).json({ message: err.message });
    }
});

//BULK DELETE notifications
router.post("/bulk-delete", requireAuth, async (req, res) => {
    try{
        const {ids} = req.body;
        await Notification.deleteMany({_id: { $in: ids}});
        res.json({ message: "Notifications deleted"});
    }catch(err){
     res.status(500).json({ message: err.message });
    }
});

export default router; 