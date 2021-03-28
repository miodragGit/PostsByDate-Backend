const express = require('express');

const postsController = require('../controllers/posts-controller');
const { route } = require('./cms-routes');

const router = express.Router();

router.get('/categories', postsController.getAllCategories);

router.get('/:id', postsController.getPostById);

router.get('/categories/:cid', postsController.getPostByCategoryId);

router.get('/', postsController.getAllPosts);

router.post('/filterPosts', postsController.filterPosts);

router.post('/', postsController.createPost);

router.patch('/:id', postsController.updatePost);

router.delete('/:id', postsController.deletePost);

router.post('/categories', postsController.createCategory);



module.exports = router;