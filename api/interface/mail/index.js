const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const controller = require('./mail.controller');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/:templateNumber', controller.send);

module.exports = router;
