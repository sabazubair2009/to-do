// import React, { useState } from 'react';
// import { myDatabase } from '../supabaseclient';

// function Task({ refresh }) {
//     const [userText, setUserText] = useState('');
//     const [loading, setLoading] = useState(false);

//     async function addTodo() {
//         const cleanText = userText.trim();

//         if (cleanText === '') {
//             alert('Please enter a task before adding!');
//             return;
//         }

//         setLoading(true);

//         const { error } = await myDatabase
//             .from('to-do-list')
//             .insert([
//                 {
//                     title: cleanText,
//                     status: 'pending'
//                 }
//             ]);

//         setLoading(false);

//         if (error) {
//             console.error('Supabase insert error:', error);
//             alert(`Could not add task: ${error.message}`);
//             return;
//         }

//         setUserText('');
//         await refresh();
//     }

//     function handleKeyDown(event) {
//         if (event.key === 'Enter') {
//             addTodo();
//         }
//     }

//     return (
//         <div className="task-holder">
//             <input
//                 type="text"
//                 placeholder="Add a new task..."
//                 className="task"
//                 value={userText}
//                 onChange={(event) => setUserText(event.target.value)}
//                 onKeyDown={handleKeyDown}
//             />

//             <button
//                 onClick={addTodo}
//                 className="add-button"
//                 disabled={loading}
//             >
//                 {loading ? 'Adding...' : 'Add Task'}
//             </button>
//         </div>
//     );
// }

// export default Task;

import React, { useState } from "react";
import { myDatabase } from "../supabaseclient";

function Task({ refresh, user }) {
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);

  async function addTodo() {
    const cleanText = userText.trim();

    if (cleanText === "") {
      alert("Please enter a task before adding!");

      return;
    }

    if (!user) {
      alert("Please login first.");

      return;
    }

    setLoading(true);

    const { error } = await myDatabase.from("to-do-list").insert([
      {
        title: cleanText,
        status: "pending",

        // Connect task to logged-in user
        user_id: user.id,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Supabase insert error:", error);

      alert(`Could not add task: ${error.message}`);

      return;
    }

    setUserText("");

    await refresh();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      addTodo();
    }
  }

  return (
    <div className="task-holder">
      <input
        type="text"
        placeholder="Add a new task..."
        className="task"
        value={userText}
        onChange={(event) => setUserText(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={addTodo} className="add-button" disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>
    </div>
  );
}

export default Task;
