const express = require('express');

const cmsController = require('../controllers/cms-controller');
const { route } = require('./posts-routes');

const router = express.Router();

router.post('/', cmsController.createOrUpdateDefaultFilter);

router.delete('/:id', cmsController.deleteDefaultFilter);

router.get('/', cmsController.getDefaultFilter);

module.exports = router;