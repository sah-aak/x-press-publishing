const express=require('express');
const seriesRouter=express.Router({mergeParams:true});
const sqlite3=require('sqlite3');
const db=new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const issueRouter=require('./issues');


seriesRouter.param('seriesId',(req,res,next,id)=>{
    db.get('SELECT * FROM Series WHERE id=$id',{$id:Number(seriesId)},(err,row)=>{
        if(err)
            next(err);    
        
        else {
            if(row)
            {
                req.series=row;
                next();
            }
            else{
                res.status(404).send();
            }
            
        }
    })
});

seriesRouter.use('/:seriesId/issues',issueRouter);

seriesRouter.get('/',(req,res,next)=>{
    db.all('SELECT * FROM Series',(err,rows)=>{
        if(err)
        {
            next(err);
        }
        else{
            res.status(200).json({series:rows});
        }
    });
});


seriesRouter.get('/:seriesId',(req,res,next)=>{
    res.status(200).send({series:req.series});
});


seriesRouter.post('/',(req,res,next)=>{
    const obj=req.body;
    if(!obj.series.name||!obj.series.description)
    {
        res.status(400).send();
    }
    db.serialize(()=>{
        db.run('INSERT INTO Series (name,description) VALUES($name,$description);',{$name:obj.series.name,$description:obj.series.description},function(err){
            if(err)
                next(err);
        });
         db.get('SELECT * FROM Artist WHERE id=$lastid',{$lastid:this.lastID},(err,row)=>{
            if(err)
                    next(err);
            else{
                    res.status(201).json({series:row});
                }
        });
    });
   
});

seriesRouter.put('/:seriesId',(req,res,next)=>{
    const obj=req.series;
    if(!obj.name||!obj.description)
    {
        res.status(400).send();
    }
    db.run('UPDATE Series SET name=$name,description=$description WHERE id=$id',{$name:req.body.series.name,$description:req.body.series.description,$id:req.params.seriesId},function(error){
        if(error)
        {
            next(error);
        }

        else{
            db.get('SELECT * FROM Series WHERE id=$id',{$id:this.lastID},(err,row)=>{
                if(err)
                    next(err);
                else{
                    res.status(200).json({series:row});
                }
            });
        }
    });
});

issueRouter.get('/',(req,res,next)=>{
    db.all('SELECT * FROM Issues WHERE series_id=$id',{$id:req.params.seriesId},(err,row)=>{
        if(err)
        {
            next(err);
        }
        else{
            res.status(200).json({issues:row});
        }
    });
});

issueRouter.post('/',(req,res,next)=>{
    let obj=req.body.issues;
    if(!obj.name||!obj.issueNumber||!obj.publicationDate||!obj.artistId)
    {
        res.status(400).send();
    }
    db.get('SELECT * FROM Artist WHERE id=$id',{$id:obj.artistId},(err,row)=>{
        if(err)
            next(err);
        else if(row){
            db.run('INSERT INTO Issue (name,issueNumber,publicationDate,artistId,seriesId) VALUES($name,$issueNumber,$publicationDate,$artistId,$seriesId);',{$name:obj.name,$issueNumber:obj.issueNumber,$publicationDate:obj.publicationDate,$artistId:obj.artistId,$seriesId:req.params.seriesId},
            function(err){
                if(err)
                    next(err);
                else{
                    db.get('SELECT * FROM Issue WHERE id=$id',{$id:this.lastID},(err,row)=>{
                        if(err)
                            next(err);
                        else
                            res.status(201).json(row);
                    });
                }
            });
        }
        else{
            res.status(400).send();
        }
    });
});

issueRouter.param('issueId',(req,res,next,id)=>{
    db.get('SELECT * FROM Issue WHERE id=$id',{$id:req.params.issueId},(err,row)=>{
        if(err)
            next(err);
        else if(row){
            next();
        }
        else{
            res.status(404).send();
        }
    });
});

issueRouter.put('/:issueId',(req,res,next)=>{
    let obj=req.body.issues;
    if(!obj.name||!obj.issueNumber||!obj.publicationDate||!obj.artistId)
    {
        res.status(400).send();
    }
    db.get('SELECT * FROM Issues WHERE id=$id',{$id:req.params.issueId},(err,row)=>{
        if(err){
            next(err);
        }
        else if(row){
            db.run('UPDATE Issues SET name=$name,issueNumber=$issueNumber,publicationDate=$publicationDate,artistId=$artistId,seriesId=$seriesId WHERE id=$issueId;',
            {$name:obj.name,$issueNumber:obj.issueNumber,$publicationDate:obj.publicationDate,$artistId:obj.artistId,$seriesId},
            function(err){
                if(err)
                    next(err);
                else{
                    db.get('SELECT * FROM Issues WHERE id=$id',{$id:this.lastID},(err,row)=>{
                        if(err)
                            next(err);
                        else{
                            res.status(200).send(row);
                        }
                    });
                }
            });
        }
        else{
            res.status(400).send();
        }

    });    
});

issueRouter.delete('/:issueId',(req,res,next)=>{
    db.get('SELECT * FROM Issue WHERE id=$id',{$id:req.params.issueId},(err,row)=>{
        if(err)
            next(err);
        else{
            if(row){
                db.run('DELETE FROM Issue WHERE id=$id',{$id:req.params.issueId},function(err){
                    if(err)
                        next(err);
                    else 
                        res.status(204).send();
                });
            }
            else{
                res.status(404).send();
            }
        }
    }); 
});

seriesRouter.delete('/:seriesId',(req,res,next)=>{
    db.get('SELECT * FROM Issues WHERE seriesId=$seriesid',{$seriesid:req.params.seriesId},(err,row)=>{
        if(err)
            next(err);
        else{
            if(row)
            {
                res.status(400).send();
            }
            else{
                res.status(204).send();
            }
        }
    });
});


module.exports=seriesRouter;
