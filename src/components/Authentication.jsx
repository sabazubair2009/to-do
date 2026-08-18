// import React, { useState } from "react";
// import { myDatabase } from "../supabaseclient";

// function Authentication() {
//     const [isLogin, setIsLogin] = useState(true);

//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");

//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState("");

//     async function handleSubmit(event) {
//         event.preventDefault();

//         setMessage("");

//         const cleanName = name.trim();
//         const cleanEmail = email.trim();

//         // -------------------------
//         // VALIDATION
//         // -------------------------

//         if (!isLogin && cleanName === "") {
//             setMessage("Please enter your name.");
//             return;
//         }

//         if (cleanEmail === "" || password === "") {
//             setMessage("Please enter your email and password.");
//             return;
//         }

//         // Check password confirmation
//         if (!isLogin && password !== confirmPassword) {
//             setMessage("Passwords do not match.");
//             return;
//         }

//         setLoading(true);

//         // -------------------------
//         // LOGIN
//         // -------------------------

//         if (isLogin) {
//             const { error } =
//                 await myDatabase.auth.signInWithPassword({
//                     email: cleanEmail,
//                     password: password,
//                 });

//             if (error) {
//                 console.error("Login error:", error);
//                 setMessage(error.message);
//             }
//         }

//         // -------------------------
//         // SIGN UP
//         // -------------------------

//         else {
//             const { data, error } =
//                 await myDatabase.auth.signUp({
//                     email: cleanEmail,
//                     password: password,

//                     options: {
//                         data: {
//                             full_name: cleanName,
//                         },
//                     },
//                 });

//             if (error) {
//                 console.error("Signup error:", error);
//                 setMessage(error.message);
//             } else if (data.user && !data.session) {
//                 setMessage(
//                     "Account created! Please check your email to confirm your account."
//                 );
//             } else {
//                 setMessage("Account created successfully!");
//             }
//         }

//         setLoading(false);
//     }

//     // -------------------------
//     // SWITCH LOGIN / SIGNUP
//     // -------------------------

//     function switchMode() {
//         setIsLogin((previous) => !previous);

//         setMessage("");

//         setName("");
//         setEmail("");
//         setPassword("");
//         setConfirmPassword("");

//         setShowPassword(false);
//         setShowConfirmPassword(false);
//     }

//     // -------------------------
//     // PASSWORD MATCH WARNING
//     // -------------------------

//     const passwordMismatch =
//         !isLogin &&
//         confirmPassword.length > 0 &&
//         password !== confirmPassword;

//     return (
//         <div className="auth-page">

//             <div className="auth-card">

//                 {/* LOGO */}
//                 <div className="auth-logo">
//                     SZ.
//                 </div>

//                 {/* HEADING */}
//                 <h1>
//                     {isLogin
//                         ? "Welcome Back!"
//                         : "Create Account"}
//                 </h1>

//                 <p className="auth-subtitle">
//                     {isLogin
//                         ? "Login to continue to your tasks."
//                         : "Create your account to start managing tasks."}
//                 </p>

//                 <form onSubmit={handleSubmit}>

//                     {/* NAME - SIGN UP ONLY */}
//                     {!isLogin && (
//                         <>
//                             <label>Name</label>

//                             <input
//                                 type="text"
//                                 placeholder="Enter your name"
//                                 value={name}
//                                 onChange={(event) =>
//                                     setName(event.target.value)
//                                 }
//                             />
//                         </>
//                     )}

//                     {/* EMAIL */}
//                     <label>Email</label>

//                     <input
//                         type="email"
//                         placeholder="Enter your email"
//                         value={email}
//                         onChange={(event) =>
//                             setEmail(event.target.value)
//                         }
//                     />

//                     {/* CREATE PASSWORD */}
//                     <label>Password</label>

//                     <div className="password-wrapper">

//                         <input
//                             type={
//                                 showPassword
//                                     ? "text"
//                                     : "password"
//                             }
//                             placeholder={
//                                 isLogin
//                                     ? "Enter your password"
//                                     : "Create a password"
//                             }
//                             value={password}
//                             onChange={(event) =>
//                                 setPassword(event.target.value)
//                             }
//                         />

//                         <button
//                             type="button"
//                             className="password-toggle"
//                             onClick={() =>
//                                 setShowPassword(
//                                     (previous) => !previous
//                                 )
//                             }
//                         >
//                           {showPassword ? "🤩" : "🔒"}
//                         </button>

//                     </div>

//                     {/* CONFIRM PASSWORD - SIGN UP ONLY */}
//                     {!isLogin && (
//                         <>
//                             <label>Confirm Password</label>

//                             <div
//                                 className={`password-wrapper ${
//                                     passwordMismatch
//                                         ? "password-error"
//                                         : ""
//                                 }`}
//                             >

//                                 <input
//                                     type={
//                                         showConfirmPassword
//                                             ? "text"
//                                             : "password"
//                                     }
//                                     placeholder="Confirm your password"
//                                     value={confirmPassword}
//                                     onChange={(event) =>
//                                         setConfirmPassword(
//                                             event.target.value
//                                         )
//                                     }
//                                 />

//                                 <button
//                                     type="button"
//                                     className="password-toggle"
//                                     onClick={() =>
//                                         setShowConfirmPassword(
//                                             (previous) => !previous
//                                         )
//                                     }
//                                 >
//                                     {showPassword ? "🤩" : "🔒"}
//                                 </button>

//                             </div>

//                             {/* PASSWORD WARNING */}
//                             {passwordMismatch && (
//                                 <p className="password-warning">
//                                     Passwords do not match.
//                                 </p>
//                             )}

//                             {/* PASSWORD MATCHED */}
//                             {!passwordMismatch &&
//                                 confirmPassword.length > 0 &&
//                                 password === confirmPassword && (
//                                     <p className="password-success">
//                                         Passwords match.
//                                     </p>
//                                 )}
//                         </>
//                     )}

//                     {/* SUBMIT BUTTON */}
//                     <button
//                         type="submit"
//                         className="auth-button"
//                         disabled={loading}
//                     >
//                         {loading
//                             ? "Please wait..."
//                             : isLogin
//                                 ? "Login"
//                                 : "Create Account"}
//                     </button>

//                 </form>

//                 {/* GENERAL MESSAGE */}
//                 {message && (
//                     <p className="auth-message">
//                         {message}
//                     </p>
//                 )}

//                 {/* SWITCH LOGIN / SIGNUP */}
//                 <div className="auth-switch">

//                     <span>
//                         {isLogin
//                             ? "Don't have an account?"
//                             : "Already have an account?"}
//                     </span>

//                     <button
//                         type="button"
//                         onClick={switchMode}
//                         className="switch-button"
//                     >
//                         {isLogin
//                             ? "Sign Up"
//                             : "Login"}
//                     </button>

//                 </div>

//             </div>

//         </div>
//     );
// }

// export default Authentication;

import React, { useState } from "react";
import { myDatabase } from "../supabaseclient";

function Authentication() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    // -------------------------
    // VALIDATION
    // -------------------------

    if (!isLogin && cleanName === "") {
      setMessage("Please enter your name.");
      return;
    }

    if (cleanEmail === "" || password === "") {
      setMessage("Please enter your email and password.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    // -------------------------
    // LOGIN
    // -------------------------

    if (isLogin) {
      const { error } = await myDatabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        console.error("Login error:", error);

        if (error.message.toLowerCase().includes("email not confirmed")) {
          setMessage(
            "Your email is not confirmed. Please check your email and click the confirmation link.",
          );
        } else {
          setMessage(error.message);
        }
      }
    }

    // -------------------------
    // SIGN UP
    // -------------------------
    else {
      const { data, error } = await myDatabase.auth.signUp({
        email: cleanEmail,
        password: password,

        options: {
          // IMPORTANT:
          // Change this if your Vite app uses another port.
          emailRedirectTo: "http://localhost:5173",

          data: {
            full_name: cleanName,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        setMessage(error.message);
      } else if (data.user && !data.session) {
        setMessage(
          "Account created! Please check your email and confirm your account.",
        );
      } else {
        setMessage("Account created successfully!");
      }
    }

    setLoading(false);
  }

  // -------------------------
  // SWITCH LOGIN / SIGNUP
  // -------------------------

  function switchMode() {
    setIsLogin((previous) => !previous);

    setMessage("");

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  // -------------------------
  // PASSWORD MATCH WARNING
  // -------------------------

  const passwordMismatch =
    !isLogin && confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">SZ.</div>

        <h1>{isLogin ? "Welcome Back!" : "Create Account"}</h1>

        <p className="auth-subtitle">
          {isLogin
            ? "Login to continue to your tasks."
            : "Create your account to start managing tasks."}
        </p>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          {!isLogin && (
            <>
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </>
          )}

          {/* EMAIL */}
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          {/* PASSWORD */}
          <label>Password</label>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={
                isLogin ? "Enter your password" : "Create a password"
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
            >
              {showPassword ? "🤩" : "🔒"}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          {!isLogin && (
            <>
              <label>Confirm Password</label>

              <div
                className={`password-wrapper ${
                  passwordMismatch ? "password-error" : ""
                }`}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                >
                  {showConfirmPassword ? "🤩" : "🔒"}
                </button>
              </div>

              {passwordMismatch && (
                <p className="password-warning">Passwords do not match.</p>
              )}

              {!passwordMismatch &&
                confirmPassword.length > 0 &&
                password === confirmPassword && (
                  <p className="password-success">Passwords match.</p>
                )}
            </>
          )}

          {/* SUBMIT */}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <div className="auth-switch">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>

          <button type="button" onClick={switchMode} className="switch-button">
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Authentication;
