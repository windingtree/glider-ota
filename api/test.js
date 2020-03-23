
const controller = (req, res) => {
    console.debug("/api/test request");
    res.status(500).json({ret:"OK"});
}

module.exports = controller;
