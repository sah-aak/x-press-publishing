const express=require('express');
const bodyParser=require('body-parser');
const morgan=require('morgan');
const cors=require('cors');
const errorhandler=require('errorhandler');

const apiRouter=require('./api/api');

const app=express();

const PORT=process.env.PORT||4001;

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api',apiRouter);

app.use(errorhandler());

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});

module.exports=app;
