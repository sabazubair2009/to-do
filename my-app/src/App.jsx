// import React,{useState,useEffect} from 'react';
// import './App.css'
// import Header from './components/Header';
// import Task from './components/Task';
// import Footer from './components/Footer';
// import { myDatabase } from './supabaseclient';
// function App(){
//   const [todo,settodo]=useState([]);
//   async function showtodos(){
//     const response =await myDatabase.from('to-do-list').select('*');
//     if (response.data){
//       settodo(response.data)
//     }
//   }
//    useEffect(()=>{
//       showtodos()
//     },[])

//  async function deleteTask(id){
//   const response=await myDatabase.from('to-do-list').delete().eq('id',id);
//   showtodos();
//  };
//  async function updateTask(id){
//   const newtask=prompt('Update your task please!');
//   if(!newtask||newtask.trim()===''){
//     alert('ENTER YOUR TASK!')
//     return;
//   };
//   await myDatabase.from('to-do-list').update({'title':newtask}).eq('id',id);
//   showtodos();
//  }
// //  ...........
//   return(
//     <>
//     <Header/>
//      <main className='container'>
//        <Task refresh={showtodos}/>
//        <ul style={{display:'flex',alignItems:'center',flexDirection:'column',}}>
//         {todo.map((item)=>{
//           return (<li className='single-task' key={item.id}>
//             {item.title} 
//             <button className='update-btn' onClick={()=> updateTask(item.id)}>Update</button>
//             <button className='delete-btn' onClick={()=> deleteTask(item.id)}>Delete</button>
            
//           </li>)
//         })}
//        </ul>
//      </main>
//      <Footer/>
//     </>
//   )
// }
// export default App;









import React, { useState, useEffect } from 'react';
import './App.css';

import Header from './components/Header';
import Task from './components/Task';
import Footer from './components/Footer';

import { myDatabase } from './supabaseclient';

function App() {
    const [todo, setTodo] = useState([]);

    async function showTodos() {
        const { data, error } = await myDatabase
            .from('to-do-list')
            .select('*');

        if (error) {
            console.error('Error fetching tasks:', error);
            return;
        }

        console.log('Tasks from Supabase:', data);
        setTodo(data || []);
    }

    useEffect(() => {
        showTodos();
    }, []);

    async function deleteTask(id) {
        const { error } = await myDatabase
            .from('to-do-list')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            return;
        }

        showTodos();
    }

    async function updateTask(id) {
        const newTask = prompt('Update your task please!');

        if (!newTask || newTask.trim() === '') {
            alert('ENTER YOUR TASK!');
            return;
        }

        const { error } = await myDatabase
            .from('to-do-list')
            .update({
                title: newTask.trim()
            })
            .eq('id', id);

        if (error) {
            console.error('Update error:', error);
            return;
        }

        showTodos();
    }

    return (
        <>
            <Header />

            <main className="container">

                <Task refresh={showTodos} />

                <ul className="task-list">
                    {todo.map((item) => (
                        <li className="single-task" key={item.id}>

                            <span className="task-title">
                                {item.title}
                            </span>

                            <div className="task-buttons">

                                <button
                                    className="update-btn"
                                    onClick={() => updateTask(item.id)}
                                >
                                    Update
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => deleteTask(item.id)}
                                >
                                    Delete
                                </button>

                            </div>

                        </li>
                    ))}
                </ul>

            </main>

            <Footer />
        </>
    );
}

export default App;