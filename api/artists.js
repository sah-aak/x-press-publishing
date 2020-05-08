const express=require('express');
const artist=express.Router({mergeParams:true});
const sqlite3=require('sqlite3');
const db=new sqlite3.Database(process.env.TEST_DATABASE||'./database.sqlite');




artist.get('/',(req,res,next)=>{
    db.all('SELECT * FROM Artist WHERE is_currently_employed=1;',(err,row)=>{
        if(err)
            next(err);
        else{
            res.status(200).json({artists:row});
        }
    });
});


artist.param('artistId',(req,res,next,artistId)=>{
    db.get('select * from Artist where id=$artistID;',{$artistID:artistId},(err,row)=>{
        if(err)
            next(err);
        else {
            if(row)
            {
                req.artist=row;
                next();
            }
            else{
                res.status(404).send();
            }
        }
    });
});


artist.get('/:artistId',(req,res,next)=>{
        res.status(200).json({artist:req.artist});
});

artist.post('/',(req,res,next)=>{
    const obj=req.body;
    if(!obj.artist.name||!obj.artist.dateOfBirth||!obj.artist.biography)
    {
        res.status(400).send();
    }
    const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
    db.run('insert into Artist (name,date_of_birth,biography,is_currently_employed) values($name,$dateOfBirth,$biography,$iscurrentlyEmployed)',{$name:obj.artist.name,$dateOfBirth:obj.artist.dateOfBirth,$biography:obj.artist.biography,$iscurrentlyEmployed:isCurrentlyEmployed},function(err){
        if(err)
            next(err);
        else{
            db.get('select * from Artist where id=$lastid',{$lastid:this.lastID},(err,row)=>{
                if(err)
                    next(err);
                else{
                    res.status(201).json({artist:row});
                }
            });
        }
    });
});

artist.put('/:artistId',(req,res,next)=>{
    const obj=req.body;
    if(!obj.artist.name||!obj.artist.dateOfBirth||!obj.artist.biography)
    {
        res.status(400).send();
    }
    db.serialize(()=>{
        db.run('update Artist set name=$name,date_of_birth=$dob,biography=$biography,is_currently_employed=$iscurremp where id=$id',
        {$name:obj.artist.name,$dob:obj.artist.dateOfBirth,$biography:obj.artist.biography,$iscurremp:obj.artist.isCurrentlyEmployed,$id:Number(req.params.artistId)},
        function(error){
        if(error)
        {
            next(error);
        }    
    });
    db.get('select * from Artist where id=$id',{$id:this.lastID},(err,row)=>{
            
        res.status(200).json({artist:row});
    });
    });
    
});

artist.delete('/:artistId',(req,res,next)=>{
    db.run('update Artist set is_currently_employed = 0 where id=$id',{$id:req.params.artistId},function(err){
        if(error)
        {
            next(error);
        }
        else{
            db.get('select * from Artist where id=$id',{$id:this.lastID},(err,row)=>{
            
                    res.status(200).json({artist:row});
                
            });
        }

    });


});


module.exports=artist;