const express = require("express");
const app = express()
const cors = require('cors')
const {writeFile, readFileSync} = require("fs")
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken')
require("dotenv").config()

app.use(express.json())
app.use(cors())

let userFile = readFileSync('./public/users.json', 'utf8');
userFile = JSON.parse(userFile);
let users =[];
userFile.forEach(user => users.push(user.username))


function checkUserFile(req,res,next){
  if (!userFile) {
    return res.status(500).send('Error reading users file');
  }
  next()
}
app.use(checkUserFile)
function checkToken(req,res,next){
  try {
    const token= req.headers.authorization
    const decoded = jwt.verify(token.split(" ")[1],process.env.JWT_SECRET)
    req.body.userName = decoded.username
    next()
  } catch (error) {
    return res.status(401).send("bad token")
  }
}
app.use('/api/messages',checkToken)

//Register route
app.post('/api/auth/register',async (req,res)=>{
  const {username,password} = req.body;
  if (!username || !password) 
    return res.status(400).send('please provide a username and a password');
  if(userFile.find(u => u.username === username ))
    return res.status(400).send("user already exists")
  const hashedPassword = await bcryptjs.hash(password,12)
  const user = {
    "_id": userFile.length,
    username,
    "password":hashedPassword,
    "messages":[]
  }
  userFile.push(user);
  let token = jwt.sign({
    "_id": userFile.length,
    username},
    process.env.JWT_SECRET,
    {expiresIn: "30D"}
  )
  res.status(201).json({"message":"user created",token})
  writeFile('./public/users.json', JSON.stringify(userFile, null, 3), (err, data) => {
    if (err) {
      console.log(err);
    } 
  })

})




//login
app.post('/api/auth/login',async (req,res)=>{
  const {username,password}= req.body;
  if(!username || !password)
    return res.status(400).send("please provide a username and a password")
  let user = userFile.find(user => user.username == username)
  if(!user)
    return res.status(400).send("user doesn't exist")
  const passwordMatch = await bcryptjs.compare(password,user.password)
  if(!passwordMatch)
    return res.status(400).send("incorrect credentials")
  let token = jwt.sign({
    "_id": userFile.length,
    username},
    process.env.JWT_SECRET,
    {expiresIn: "30D"}

  )
  return res.status(200).json({
    "message": "logged in successfuly",
    token
  })
})

// get all chats
app.get('/api/messages', (req, res) => {
  const {userName} = req.body;

  const user = userFile.find(u => u.username === userName);

  if (!user) {
    return res.status(400).send('Incorrect user name');
  }
  
  const chats = new Set();
  userFile.forEach(user => {
    if (user.username === userName) {
      user.messages.forEach(message => {
        chats.add(message.to);
      });
    } else {
      const sentMessageToUser = user.messages.find(message => message.to === userName);
      if (sentMessageToUser) {
        chats.add(user.username);
      }
    }
  });

  return res.status(200).json([...chats])
});



// send a message
app.post('/api/messages/:to',(req,res)=>{
  const {to} = req.params
  const from = req.body.userName
  const fromUserIndex = userFile.findIndex(user => user.username== from)
  const toUser = userFile.find(user => user.username== to)
  if(fromUserIndex=== -1 || !toUser){
    return res.status(400).send("Incorrect usernames")
  }
  const {message} = req.body;
  console.log(message);
  if(!message)
    return res.status(400).send("Please provide a message");
  const newMessage = {
    "to": toUser.username, 
    message,
    "date": new Date().toISOString()
  }
  userFile[fromUserIndex].messages.push(newMessage);
  res.status(201).send("Message sent")
  writeFile('./public/users.json', JSON.stringify(userFile, null, 3), (err, data) => {
    if (err) {
      console.log(err);
    } 
  })
})

//get all users
app.get("/api/users",(req,res)=>{
  console.log(users);
  res.status(200).json(users)
})

//get full chat between two users
app.get("/api/messages/:to",(req,res)=>{
  const {to} = req.params
  const from = req.body.userName
  const fromUserIndex = userFile.findIndex(user => user.username== from)
  const toUserIndex = userFile.findIndex(user => user.username== to)
  if(fromUserIndex=== -1 || !toUserIndex== -1){
    return res.status(400).send("Incorrect usernames")
  }
  let chat = []
  userFile[fromUserIndex].messages.forEach(message =>{
    if(message.to == to)
      chat.push(message)
  })
  userFile[toUserIndex].messages.forEach(message =>{
    if(message.to == from)
      chat.push(message)
  })
  chat.sort((a, b) => new Date(b.date) - new Date(a.date));
  res.status(200).json(chat)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


