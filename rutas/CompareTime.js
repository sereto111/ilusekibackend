const express = require('express');
const router = express.Router();

router.post('/compare-time', (req, res) => {
    try {
        const clientTime = new Date(req.body.clientTime);
        const serverTime = new Date();

        //Permite una diferencia de 1 minuto
        const isSameTime = Math.abs(serverTime - clientTime) < 60000;

        res.json({
            serverTime: serverTime.toISOString(),
            clientTime: clientTime.toISOString(),
            isSameTime,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;