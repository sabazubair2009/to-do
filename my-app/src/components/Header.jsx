//  import React from 'react';

// function Header() {
//     return (
//         <header className="app-header">
//             <h1>TASK APP</h1>
//         </header>
//     );
// }

// export default Header;

import React from "react";

function Header({ user, logout }) {
  return (
    <header className="app-header">
      <h1>TASK APP</h1>

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
