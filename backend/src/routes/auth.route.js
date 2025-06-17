const express = require('express');
const router = express.Router();
const { register, login, validateToken } = require('../controllers/auth.controller');

router.post("/register", register);
router.post("/login", login);
router.get("/validate", validateToken);

module.exports = router;