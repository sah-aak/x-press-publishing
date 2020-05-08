const sqlite3=require('sqlite3');
const db=new sqlite3.Database('./database.sqlite');

db.run('CREATE TABLE IF NOT EXISTS Artist (id INTEGER PRIMARY KEY NOT NULL,name TEXT NOT NULL,date_of_birth TEXT NOT NULL,biography TEXT NOT NULL,is_currently_employed INTEGER DEFAULT 1);',function(err){
    if(err)
     throw err;
});

db.run('CREATE TABLE IF NOT EXISTS Series (id INTEGER PRIMARY KEY NOT NULL,name TEXT NOT NULL,description TEXT NOT NULL);',(err)=>{
    if(err)
        throw err;
    
});
db.run('CREATE TABLE IF NOT EXISTS Issue (id INTEGER PRIMARY KEY NOT NULL,name TEXT NOT NULL,issue_number INTEGER NOT NULL,publication_date TEXT NOT NULL,artist_id INTEGER UNIQUE NOT NULL,series_id INTEGER UNIQUE NOT NULL);',function(err){
   if(err)
   {
       throw err;
   } 
});