import React, { useState } from 'react';
 import { myDatabase } from '../supabaseclient';
function Task({refresh}){
const [userText,setUserText]=useState('')
 async function addtodo(){
   const cleanText=userText.trim()
   if(userText == ''){
      alert("please enter a value before saving")
      return;
   }


    await myDatabase.from('to-do-list').insert([{title:userText}])
    setUserText('')
    refresh();
 }




 return(
    <div className='task-holder'>
        <input onChange={(event)=> setUserText(event.target.value)}     value={userText} type="text" placeholder='Add Your Task' className='task' />
        <button onClick={addtodo} className='add-btn'>Add Task</button>
    </div>
 )
}

export default Task;