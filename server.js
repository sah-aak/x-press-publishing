const express=require('express');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const cors=require('cors');
const errorhandler=require('errorhandler');

const apiRouter=require('./api/api');
const artist=require('./api/artists');
const seriesRouter=require('./api/series');

const app=express();

const PORT=process.env.PORT||4001;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(errorhandler());

app.use('/api',apiRouter);
apiRouter.use('/artists',artist);


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});

module.exports=app;
