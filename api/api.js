const express=require('express');
const apiRouter=express.Router();
const artist=require('./artists');
const issues=require('./issues');
const series=require('./series');

apiRouter.use('/artists',artist);
apiRouter.use('/issues',issues);
apiRouter.use('/series',series);

module.exports=apiRouter;

