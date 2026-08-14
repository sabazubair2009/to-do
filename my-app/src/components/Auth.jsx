import React,{useEffect,useState} from 'react';
import { myDatabase } from '../supabaseclient';
 
function Auth(){
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[isSignUp,setIsSignUp]=useState(false);

}

export default Auth;