import React from 'react'
import { TokenContext } from './TokenProvider';
import { Outlet, Navigate } from 'react-router-dom'
import {useContext} from 'react'

function ProtectedRoute() {
const {token} = useContext(TokenContext)    
    return token ? <Outlet /> : <Navigate to='/login' />
  
}

export default ProtectedRoute
