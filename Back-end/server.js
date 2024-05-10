const express = require("express");
const app = express()
const cors = require('cors')
const {readFile,writeFile} = require("fs")
app.use(express.json())
app.use(cors())





let userFile;

readFile('./public/users.json', 'utf8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    userFile = JSON.parse(data);
  }
});




// get all chats
app.get('/api/messages/:userName', (req, res) => {

  if (!userFile) {
    return res.status(500).send('Error reading users file');
  }
  const {userName} = req.params;

  const user = userFile.find(u => u.username === userName);

  if (!user) {
    return res.status(400).send('Incorrect user ID');
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
app.post('/api/messages/:from/:to',(req,res)=>{
  if (!userFile) {
    return res.status(500).send('Error reading users file');
  }
  const {from,to} = req.params
  const fromUserIndex = userFile.findIndex(user => user.username== from)
  const toUser = userFile.find(user => user.username== to)
  if(fromUserIndex=== -1 || !toUser){
    return res.status(400).send("Incorrect usernames")
  }
  const {message} = req.body;
  if(!message)
    return req.status(400).send("Please provide a message");
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






app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


