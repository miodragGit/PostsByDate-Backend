const HttpError = require('../models/http-error');
const DefaultFilter = require('../models/defaultFilter');

const createOrUpdateDefaultFilter = async (req, res, next) => {
    let { pageLimit, date, category } = req.body;

    if(date == undefined)
        date = null;

    let defaultFilter;
    try {
        defaultFilter = await DefaultFilter.find()
    }
    catch (err){
        const error = new HttpError('Something went wrong 1.', 500);    
        return next(error);
    }
    
    if (defaultFilter.length == 0){
        const createdDefaultFilter = new DefaultFilter({
            pageLimit,
            date,
            category
        });

        try{
            await createdDefaultFilter.save();

            res.json({createdDefaultFilter: createdDefaultFilter.toObject({ getters: true })});
        }
        catch (err){
            const error = new HttpError('Creating default filter failed', 500);
            return next(error);
        }
    }
    else{
        defaultFilter[0].pageLimit = pageLimit;
        defaultFilter[0].date = date;
        defaultFilter[0].category = category;

        try{
            await defaultFilter[0].save();

            res.json({defaultFilter: defaultFilter[0].toObject({ getters: true })});
        }
        catch (err){
            const error = new HttpError('Something went wrong. 2', 500);    
            return next(error);
        }
    }
}

const getDefaultFilter = async (req, res, next) => {
    let defaultFilter;
    try {
        defaultFilter = await DefaultFilter.find()
    }
    catch (err){
        const error = new HttpError('Something went wrong.', 500);    
        return next(error);
    }

    if (!defaultFilter || defaultFilter.length === 0){
        const error = new HttpError('Not found.', 404);
        return next(error);
    }

    res.json({defaultFilter: defaultFilter.map(filter => filter.toObject({ getters: true }))});
}

const deleteDefaultFilter = async (req, res, next) => {
    let defaultFilter;
    try {
        defaultFilter = await DefaultFilter.find();
    }
    catch (err){
        const error = new HttpError('Something went wrong.', 500);    
        return next(error);
    }

    if (defaultFilter.length == 0){
        const error = new HttpError('Not found.', 404);
        return next(error);
    }
    else{
        try{
            await defaultFilter[0].remove();
        }
        catch (err){
            const error = new HttpError('Something went wrong.', 500);    
            return next(error);
        }
    }
    
    res.status(200).json({ message: 'Deleted default filter.'});
}

exports.createOrUpdateDefaultFilter = createOrUpdateDefaultFilter;
exports.deleteDefaultFilter = deleteDefaultFilter;
exports.getDefaultFilter = getDefaultFilter;