import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TokenContext } from './TokenProvider';
import { useState,useContext } from 'react';
import './ChatPage.css'

function ChatPage() {
    const [chat,setChat]= useState()
    const [input,setInput]= useState("")
    const [loading,setLoading]= useState(true)
    const {user} = useParams()
    const {token} = useContext(TokenContext)
    async function getChat(){
        const res= await fetch(`http://localhost:3000/api/messages/${user}`,{
        headers:{
            'Authorization':`Bearer ${token}`
        }
        }
    )
    if(res.ok){
        const data = await res.json()
        setLoading(false)
        setChat(data)
        console.log(data);
    }
    }
    useEffect(()=>{
        getChat()
    },[])

    async function sendMessage(){
        const res= await fetch(`http://localhost:3000/api/messages/${user}`,{
            method: "POST",
            headers:{
                "Content-Type":"application/json",
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify(
                {"message":input}
            )
            })
            if(res.ok){
                console.log("message sent");
                getChat()
                setInput("")
            }

    }
  return (
    <div className='chatpage'>
        {loading ? "loading....": chat.map(
        message => <div key={message} className={message.to == user? "from": "to"}  >
            <div className='content'>{message.message}</div>
            <div className='date'>{message.date}</div>
        </div>
      )}
      <div className='input'>
      <input type='text' value={input} onChange={e=>setInput(e.target.value)}/>
      <button onClick={sendMessage}>send</button>
      </div>
    </div>
  )
}

export default ChatPage
