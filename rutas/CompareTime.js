const express = require('express');
const router = express.Router();

router.post('/compare-time', (req, res) => {
    try {
        const clientTime = new Date(req.body.clientTime);
        const serverTime = new Date();

        // Comparar solo la fecha y la hora sin los segundos
        const isSameTime = (
            clientTime.getFullYear() === serverTime.getFullYear() &&
            clientTime.getMonth() === serverTime.getMonth() &&
            clientTime.getDate() === serverTime.getDate() &&
            clientTime.getHours() === serverTime.getHours() &&
            clientTime.getMinutes() === serverTime.getMinutes()
        );

        res.json({
            serverTime: serverTime.toISOString(),
            isSameTime
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;