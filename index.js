const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const jwt_secret = "123";
const {z }= require("zod");
const {userModal , todoModal} = require("./db");
const { default: mongoose } = require("mongoose");
mongoose.connect("mongodb+srv://admin:2cLY6Ay7nNDHw4Qd@cluster0.zz2sm.mongodb.net/todo_database")

app.use(express.json());

app.post("/signup", async function(req,res){
  const requirebody = z.object({
    name : z.string().min(3).max(100),
    email : z.string().min(3).max(100).email(),
    password : z.string().min(5).max(100)
  })

  const parsedata = requirebody.safeParse(req.body);
  if(!parsedata.success){
    res.json({
      message : "incorrect format",
      error : parsedata.error
    })
  }
const name = req.body.name;
const email = req.body.email;
const password = req.body.password;

const hashedpassword = await bcrypt.hash(password, 5);

 await userModal.create({
       name : name,
       email : email,
       password : hashedpassword,
 })

    res.json({
        message : "you are signup sucessfully"
    })
})

app.post("/login", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModal.findOne({
      email: email,
    })

    const passwordmatch = await bcrypt.compare(password , user.password);

    if(passwordmatch){

      const token = jwt.sign({
        id : user._id
      }, jwt_secret)

      res.json({
        token : token
      })
      
    }
else{
  res.json({
    message: "password not matched"
  })
}
    

})

function auth(req,res,next){
  const token = req.headers.token;
  const decordedData = jwt.verify(token,jwt_secret);
  if(decordedData){
    req.userId = decordedData._id;
    next();
    }
    else{
      res.status(403).json({
        message : "incorrect cridentials"
      })
    }
}

app.post("/todo",auth, function(req,res){
    const userId = req.userID
    const titel = req.body.titel;
    const done = req.body.done;

    todoModal.create({
      userId : userId,
      titel : titel,
      done : done
    })

    res.json({
      message: "todo is created"
    })
})

app.get("/todos",auth, async function(req,res){
  const userId = req.userID;
  const todos =  await todoModal.find({
    userId : userId
  })
  res.json({
    todos : todos
  })
})

app.listen(3000);