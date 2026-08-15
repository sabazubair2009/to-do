import React, { useEffect, useState } from 'react';
import './App.css';

import Header from './components/Header';
import Task from './components/Task';
import Footer from './components/Footer';

import { myDatabase } from './supabaseclient';

function App() {
    const [todo, setTodo] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all tasks
    async function showTodos() {
        setLoading(true);

        const { data, error } = await myDatabase
            .from('to-do-list')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching tasks:', error);
            alert(`Could not load tasks: ${error.message}`);
            setLoading(false);
            return;
        }

        setTodo(data || []);
        setLoading(false);
    }

    // Load tasks when page opens
    useEffect(() => {
        showTodos();
    }, []);

    // Delete task
    async function deleteTask(id) {
        const confirmDelete = window.confirm(
            'Are you sure you want to remove this task?'
        );

        if (!confirmDelete) {
            return;
        }

        const { error } = await myDatabase
            .from('to-do-list')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete error:', error);
            alert(`Could not delete task: ${error.message}`);
            return;
        }

        // Remove it immediately from the screen
        setTodo((previousTodos) =>
            previousTodos.filter((task) => task.id !== id)
        );
    }

    // Edit task
    async function updateTask(id, oldTitle) {
        const newTask = window.prompt(
            'Update your task:',
            oldTitle
        );

        // User pressed Cancel
        if (newTask === null) {
            return;
        }

        const cleanText = newTask.trim();

        // Empty task check
        if (cleanText === '') {
            alert('Task cannot be empty!');
            return;
        }

        // Update task in Supabase
        const { data, error } = await myDatabase
            .from('to-do-list')
            .update({
                title: cleanText
            })
            .eq('id', id)
            .select();

        if (error) {
            console.error('Update error:', error);
            alert(`Could not update task: ${error.message}`);
            return;
        }

        console.log('Updated task:', data);

        // Update the task immediately on screen
        setTodo((previousTodos) =>
            previousTodos.map((task) =>
                task.id === id
                    ? { ...task, title: cleanText }
                    : task
            )
        );
    }

    return (
        <>
            <Header />

            <main className="container">
                <Task refresh={showTodos} />

                {loading ? (
                    <p className="message">Loading tasks...</p>
                ) : todo.length === 0 ? (
                    <p className="message">
                        No tasks yet. Add your first task!
                    </p>
                ) : (
                    <ul className="task-list">
                        {todo.map((item) => (
                            <li
                                className="single-task"
                                key={item.id}
                            >
                                <span className="task-title">
                                    {item.title}
                                </span>

                                <div className="task-buttons">
                                    <button
                                        className="update-button"
                                        onClick={() =>
                                            updateTask(
                                                item.id,
                                                item.title
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            deleteTask(item.id)
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>

            <Footer />
        </>
    );
}

export default App;