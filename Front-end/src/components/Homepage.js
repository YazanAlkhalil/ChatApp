import React, { useState } from 'react'
import {useEffect,useContext} from 'react'
import { TokenContext } from './TokenProvider';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './Homepage.css'

function Homepage() {
    const navigate = useNavigate()
    const [loading,setLoading]= useState(true)
    const [chats,setChats] = useState([])
    const {token} = useContext(TokenContext)
    const [users,setUsers] = useState([])
    const [selectedOption] = useState("")

  async function getUsers(){
    const res = await fetch("http://localhost:3000/api/users")
    if(res.ok){
      let data = await res.json()
      data = data.map(item =>{return { value: item, label: item }} )
      setUsers(data)
    }
  }


  
    useEffect(()=>{
        async function getMessages(){
            const res = await fetch("http://localhost:3000/api/messages",{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            if(res.ok){
                const data = await res.json()
                setLoading(false)
                setChats(data)
            }
        }
        getMessages()
        getUsers()
    },[])
  return (
    <div className='homepage'>
      <Select 
      defaultValue={selectedOption}
      onChange={(option)=>navigate(`/chat/${option.value}`)}
      options={users}
      />
      {loading ? "loading....": chats.map(
        chat => <div className='chat' key={chat} onClick={()=> navigate(`/chat/${chat}`)}>{chat}</div>
      )}
    </div>
  )
}








export default Homepage
