

import React from "react";

function Header({ user, logout }) {
  return (
    <header className="app-header">
      <h1>Welcome To Your Task Manager </h1>

      <div className="header-right">
        <span className="user-email">{user?.email}</span>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
