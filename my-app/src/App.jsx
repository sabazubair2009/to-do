// import React, { useEffect, useState } from "react";
// import "./App.css";

// import Header from "./components/Header";
// import Task from "./components/Task";
// import Footer from "./components/Footer";

// import { myDatabase } from "./supabaseclient";

// function App() {
//   const [todo, setTodo] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch tasks from Supabase
//   async function showTodos() {
//     setLoading(true);

//     const { data, error } = await myDatabase
//       .from("to-do-list")
//       .select("*")
//       .order("id", { ascending: true });

//     if (error) {
//       console.error("Error fetching tasks:", error);
//       alert(`Could not load tasks: ${error.message}`);
//       setLoading(false);
//       return;
//     }

//     setTodo(data || []);
//     setLoading(false);
//   }

//   useEffect(() => {
//     showTodos();
//   }, []);

//   // Mark task as completed / pending
//   async function toggleTask(id, currentStatus) {
//     const newStatus = currentStatus === "completed" ? "pending" : "completed";

//     const { error } = await myDatabase
//       .from("to-do-list")
//       .update({
//         status: newStatus,
//       })
//       .eq("id", id);

//     if (error) {
//       console.error("Status update error:", error);
//       alert(`Could not update task: ${error.message}`);
//       return;
//     }

//     setTodo((previousTodos) =>
//       previousTodos.map((task) =>
//         task.id === id ? { ...task, status: newStatus } : task,
//       ),
//     );
//   }

//   // Delete task
//   async function deleteTask(id) {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to remove this task?",
//     );

//     if (!confirmDelete) {
//       return;
//     }

//     const { error } = await myDatabase.from("to-do-list").delete().eq("id", id);

//     if (error) {
//       console.error("Delete error:", error);
//       alert(`Could not delete task: ${error.message}`);
//       return;
//     }

//     setTodo((previousTodos) => previousTodos.filter((task) => task.id !== id));
//   }

//   // Edit task
//   async function updateTask(id, oldTitle) {
//     const newTask = window.prompt("Update your task:", oldTitle);

//     if (newTask === null) {
//       return;
//     }

//     const cleanText = newTask.trim();

//     if (cleanText === "") {
//       alert("Task cannot be empty!");
//       return;
//     }

//     const { error } = await myDatabase
//       .from("to-do-list")
//       .update({
//         title: cleanText,
//       })
//       .eq("id", id);

//     if (error) {
//       console.error("Update error:", error);
//       alert(`Could not update task: ${error.message}`);
//       return;
//     }

//     setTodo((previousTodos) =>
//       previousTodos.map((task) =>
//         task.id === id ? { ...task, title: cleanText } : task,
//       ),
//     );
//   }

//   // Separate tasks
//   const pendingTasks = todo.filter((task) => task.status !== "completed");

//   const completedTasks = todo.filter((task) => task.status === "completed");

//   // Task Card
//   function TaskCard({ item }) {
//     return (
//       <li className="task-card">
//         <div className="task-card-left">
//           <input
//             type="checkbox"
//             checked={item.status === "completed"}
//             onChange={() => toggleTask(item.id, item.status)}
//             className="task-checkbox"
//           />

//           <span
//             className={
//               item.status === "completed"
//                 ? "task-title completed"
//                 : "task-title"
//             }
//           >
//             {item.title}
//           </span>
//         </div>

//         <div className="task-buttons">
//           <button
//             className="update-button"
//             onClick={() => updateTask(item.id, item.title)}
//           >
//             Edit
//           </button>

//           <button className="delete-button" onClick={() => deleteTask(item.id)}>
//             Delete
//           </button>
//         </div>
//       </li>
//     );
//   }

//   return (
//     <>
//       <Header />

//       <main className="container">
//         <Task refresh={showTodos} />

//         {loading ? (
//           <p className="message">Loading tasks...</p>
//         ) : (
//           <>
//             {/* Pending Tasks */}
//             <section className="task-section">
//               <div className="section-heading">
//                 <h2>Pending Tasks</h2>
//                 <span className="task-count">{pendingTasks.length}</span>
//               </div>

//               {pendingTasks.length === 0 ? (
//                 <p className="empty-message">No pending tasks 🎉</p>
//               ) : (
//                 <ul className="task-list">
//                   {pendingTasks.map((item) => (
//                     <TaskCard key={item.id} item={item} />
//                   ))}
//                 </ul>
//               )}
//             </section>

//             {/* Completed Tasks */}
//             <section className="task-section">
//               <div className="section-heading">
//                 <h2>Completed Tasks</h2>
//                 <span className="task-count completed-count">
//                   {completedTasks.length}
//                 </span>
//               </div>

//               {completedTasks.length === 0 ? (
//                 <p className="empty-message">No completed tasks yet.</p>
//               ) : (
//                 <ul className="task-list">
//                   {completedTasks.map((item) => (
//                     <TaskCard key={item.id} item={item} />
//                   ))}
//                 </ul>
//               )}
//             </section>
//           </>
//         )}
//       </main>

//       <Footer />
//     </>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Task from "./components/Task";
import Footer from "./components/Footer";
import Authentication from "./components/Authentication";

import { myDatabase } from "./supabaseclient";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [todo, setTodo] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // CHECK LOGIN STATUS
  // --------------------------------

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await myDatabase.auth.getSession();

      setUser(session?.user ?? null);
      setAuthLoading(false);
    }

    getUser();

    // Listen for login/logout changes

    const {
      data: { subscription },
    } = myDatabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // --------------------------------
  // FETCH USER'S TASKS
  // --------------------------------

  async function showTodos() {
    if (!user) {
      return;
    }

    setLoading(true);

    const { data, error } = await myDatabase
      .from("to-do-list")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching tasks:", error);

      alert(`Could not load tasks: ${error.message}`);

      setLoading(false);

      return;
    }

    setTodo(data || []);

    setLoading(false);
  }

  useEffect(() => {
    if (user) {
      showTodos();
    } else {
      setTodo([]);
    }
  }, [user]);

  // --------------------------------
  // LOGOUT
  // --------------------------------

  async function logout() {
    const { error } = await myDatabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      alert(`Could not logout: ${error.message}`);
    }
  }

  // --------------------------------
  // TOGGLE TASK
  // --------------------------------

  async function toggleTask(id, currentStatus) {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    const { error } = await myDatabase
      .from("to-do-list")
      .update({
        status: newStatus,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Status update error:", error);

      alert(`Could not update task: ${error.message}`);

      return;
    }

    setTodo((previousTodos) =>
      previousTodos.map((task) =>
        task.id === id
          ? {
              ...task,
              status: newStatus,
            }
          : task,
      ),
    );
  }

  // --------------------------------
  // DELETE TASK
  // --------------------------------

  async function deleteTask(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this task?",
    );

    if (!confirmDelete) {
      return;
    }

    const { error } = await myDatabase
      .from("to-do-list")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Delete error:", error);

      alert(`Could not delete task: ${error.message}`);

      return;
    }

    setTodo((previousTodos) => previousTodos.filter((task) => task.id !== id));
  }

  // --------------------------------
  // EDIT TASK
  // --------------------------------

  async function updateTask(id, oldTitle) {
    const newTask = window.prompt("Update your task:", oldTitle);

    if (newTask === null) {
      return;
    }

    const cleanText = newTask.trim();

    if (cleanText === "") {
      alert("Task cannot be empty!");

      return;
    }

    const { error } = await myDatabase
      .from("to-do-list")
      .update({
        title: cleanText,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Update error:", error);

      alert(`Could not update task: ${error.message}`);

      return;
    }

    setTodo((previousTodos) =>
      previousTodos.map((task) =>
        task.id === id
          ? {
              ...task,
              title: cleanText,
            }
          : task,
      ),
    );
  }

  // --------------------------------
  // LOADING AUTH
  // --------------------------------

  if (authLoading) {
    return <p className="message">Checking login...</p>;
  }

  // --------------------------------
  // SHOW LOGIN/SIGNUP
  // --------------------------------

  if (!user) {
    return <Authentication />;
  }

  // --------------------------------
  // SEPARATE TASKS
  // --------------------------------

  const pendingTasks = todo.filter((task) => task.status !== "completed");

  const completedTasks = todo.filter((task) => task.status === "completed");

  // --------------------------------
  // TASK CARD
  // --------------------------------

  function TaskCard({ item }) {
    return (
      <li className="task-card">
        <div className="task-card-left">
          <input
            type="checkbox"
            checked={item.status === "completed"}
            onChange={() => toggleTask(item.id, item.status)}
            className="task-checkbox"
          />

          <span
            className={
              item.status === "completed"
                ? "task-title completed"
                : "task-title"
            }
          >
            {item.title}
          </span>
        </div>

        <div className="task-buttons">
          <button
            className="update-button"
            onClick={() => updateTask(item.id, item.title)}
          >
            Edit
          </button>

          <button className="delete-button" onClick={() => deleteTask(item.id)}>
            Delete
          </button>
        </div>
      </li>
    );
  }

  // --------------------------------
  // MAIN APP
  // --------------------------------

  return (
    <>
      <Header user={user} logout={logout} />

      <main className="container">
        <Task refresh={showTodos} user={user} />

        {loading ? (
          <p className="message">Loading tasks...</p>
        ) : (
          <>
            {/* Pending Tasks */}

            <section className="task-section">
              <div className="section-heading">
                <h2>Pending Tasks</h2>

                <span className="task-count">{pendingTasks.length}</span>
              </div>

              {pendingTasks.length === 0 ? (
                <p className="empty-message">No pending tasks 🎉</p>
              ) : (
                <ul className="task-list">
                  {pendingTasks.map((item) => (
                    <TaskCard key={item.id} item={item} />
                  ))}
                </ul>
              )}
            </section>

            {/* Completed Tasks */}

            <section className="task-section">
              <div className="section-heading">
                <h2>Completed Tasks</h2>

                <span className="task-count completed-count">
                  {completedTasks.length}
                </span>
              </div>

              {completedTasks.length === 0 ? (
                <p className="empty-message">No completed tasks yet.</p>
              ) : (
                <ul className="task-list">
                  {completedTasks.map((item) => (
                    <TaskCard key={item.id} item={item} />
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default App;
