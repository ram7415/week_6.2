const express=require('express')
const jwt=require('jsonwebtoken')

const JWT_SECRET="ram123"
const app=express();

app.use(express.json())
const users=[];

function logger(req,res,next){
    console.log(req.method+ "request came");
    next()    
}

app.post("/signup",logger,function(req,res){
    const username=req.body.username
    const password=req.body.password
    users.push({
        username,
        password
    })
    res.json({
        message:"You are signed in"
    })
})

app.post("/signin",logger,function(req,res){
    const username=req.body.username
    const password=req.body.password
   
    let foundUser=null;

    for(let i=0; i<users.length;i++){
        if(users[i].username===username && users[i].password===password){
            foundUser=users[i]
        }
    }

    if(!foundUser){
        res.json({
            message:"Credentials incorrect"
        })
    }
    else{
        const token=jwt.sign({
            username
        },JWT_SECRET)

        res.json({
            token:token
        })
    }
})

function auth(req,res,next){
    const token=req.headers.token;
    const decodedData=jwt.verify(token,JWT_SECRET);
    if(decodedData.username){
        req.username=decodedData.username
        next()
    }
    else{
        res.json({
            message:"you are not logged in"
        })
    }
}

app.get("/me",logger,auth,function(req,res){

        let foundUser=null;

        for(let i=0; i<users.length;i++){
            if(users[i].username===req.username ){
                foundUser=users[i]
            }
        }
         
        res.json({
            username:foundUser.username,
            password:foundUser.password
        })
    }

)

app.listen(3000)