const HttpError = require('../models/http-error');
const Post = require('../models/post');
const Category = require('../models/category');
const DefaultFilter = require('../models/defaultFilter');

const getPostById = async (req, res, next) => {
    const postId = req.params.id;

    let post;
    try {
        post = await Post.findById(postId)
    }
    catch (err){
        const error = new HttpError('Something went wrong.', 500);    
        return next(error);
    }

    if (!post){
        const error = new HttpError('Not found.', 404);
        return next(error);
    }
   
    res.json({post: post.toObject({ getters: true })});
}

const getPostByCategoryId = async (req, res, next) => {
    const categoryId = req.params.cid;

    let posts;
    try {
        posts = await Post.find({ category: categoryId })
    }
    catch (err){
        const error = new HttpError('Something went wrong.', 500);    
        return next(error);
    }

    if (!posts || posts.length === 0){
        const error = new HttpError('Not found.', 404);
        return next(error);
    }
   
    res.json({posts: posts.map(post => post.toObject({ getters: true }))});
}

const getAllPosts = async (req, res, next) => {

    let     defaultFilter;
    try {
        defaultFilter = await DefaultFilter.find()
    }
    catch (err){
        const error = new HttpError('Something went wrong 1.', 500);    
        return next(error);
    }

    if (defaultFilter.length == 0){
        let posts;
        try {
            posts = await Post.find()
        }
        catch (err){
            const error = new HttpError('Something went wrong.', 500);    
            return next(error);
        }

        if (!posts || posts.length === 0){
            const error = new HttpError('Not found.', 404);
            return next(error);
        }
   
        res.json({posts: posts.map(post => post.toObject({ getters: true })), pageLimit: null});
    }
    else{
        try {
            if (defaultFilter[0].date != null && defaultFilter[0].category != '1'){
                posts = await Post.find( { date: { $gte: defaultFilter[0].date }, 'category.id': defaultFilter[0].category })
            }
            else if (defaultFilter[0].date != null){
                posts = await Post.find( { date: { $gte: defaultFilter[0].date } })
            }
            else if (defaultFilter[0].category != '1' && defaultFilter[0].category != '2'){
                posts = await Post.find( { 'category.id': defaultFilter[0].category })
            }
            else{
                posts = await Post.find();
            }
        }
        catch (err){
            const error = new HttpError('Something went wrong.', 500);    
            return next(error);
        }
    
        if (!posts || posts.length === 0){
            const error = new HttpError('Not found.', 404);
            return next(error);
        }
       
        res.json({posts: posts.map(post => post.toObject({ getters: true })), pageLimit: defaultFilter[0].pageLimit });
    }
    
}

const getAllCategories = async (req, res, next) => {
    let categories;
    try {
        categories = await Category.find()
    }
    catch (err){
        const error = new HttpError('Something went wrong.', 500);    
        return next(error);
    }

    if (!categories || categories.length === 0){
        const error = new HttpError('Not found.', 404);
        return next(error);
    }

    res.json({categories: categories.map(category => category.toObject({ getters: true }))});
}

const filterPosts = async (req, res, next) => {
    const { pageLimit, date, category } = req.body;
    console.log(category);
    let posts;
    try {
        if(date != undefined && category != '1' && category != '2'){
            posts = await Post.find( { date: { $gte: date }, 'category.id': category })
        }
        else if(date != undefined){
            posts = await Post.find( { date: { $gte: date } })
        }
        else if (category != '1' && category != '2'){
            posts = await Post.find( { 'category.id': category })
        }
        else {
            posts = await Post.find()
        }
    }
    catch (err){
        const error = new HttpError('Something went wrong.', 500);    
        return next(error);
    }

    if (!posts || posts.length === 0){
        const error = new HttpError('Not found.', 404);
        return next(error);
    }
   
    res.json({posts: posts.map(post => post.toObject({ getters: true })), pageLimit: pageLimit });
}

const createPost = async (req, res, next) => {
    const { title, description, date, category } = req.body;

    const createdPost = new Post({
        title,
        description,
        date,
        category
    });

    try{
        await createdPost.save();
    }
    catch (err){
        const error = new HttpError('Creating post failed', 500);
        return next(error);
    }

    res.status(200).json(createdPost);
}

const updatePost = async (req, res, next) => {
    const postId = req.params.id;
    const { title, description } = req.body;

    let post;
    try {
        post = await Post.findById(postId)
    }
    catch (err){
        const error = new HttpError('Something went wrong.', 500);    
        return next(error);
    }

    if (!post){
        const error = new HttpError('Not found.', 404);
        return next(error);
    }

    post.title = title;
    post.description = description;

    try{
        await post.save();
    }
    catch (err){
        const error = new HttpError('Something went wrong.', 500);    
        return next(error);
    }
   
    res.json({post: post.toObject({ getters: true })});
}

const deletePost = async (req, res, next) => {
    const postId = req.params.id;

    let post;
    try {
        post = await Post.findById(postId)
    }
    catch (err){
        const error = new HttpError('Something went wrong.', 500);    
        return next(error);
    }

    if (!post){
        const error = new HttpError('Not found.', 404);
        return next(error);
    }
    
    try{
        await post.remove();
    }
    catch (err){
        const error = new HttpError('Something went wrong.', 500);    
        return next(error);
    }

    res.status(200).json({ message: 'Deleted post.'});
}

const createCategory = async (req, res, next) => {
    const { title } = req.body;

    const createdCategory = new Category({
        title
    });

    try{
        await createdCategory.save();
    }
    catch (err){
        const error = new HttpError('Creating category failed', 500);
        return next(error);
    }

    res.status(200).json(createdCategory);
}

exports.getPostById = getPostById;
exports.getPostByCategoryId = getPostByCategoryId;
exports.getAllPosts = getAllPosts;
exports.filterPosts = filterPosts;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.createCategory = createCategory;
exports.getAllCategories = getAllCategories;