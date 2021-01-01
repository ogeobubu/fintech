import React from "react";
import axios from "axios";

const SignOut = () => {
  return (
    <button
      style={{
        width: "150px",
        borderRadius: "3px",
        letterSpacing: "1.5px",
        marginTop: "1rem",
      }}
      onClick={async () => {
        try {
          await axios.get("/api/users/logout");
          localStorage.removeItem("firstLogin");
          window.location.href = "/login";
        } catch (error) {
          window.location.href = "/login";
        }
      }}
      className="btn btn-large waves-effect waves-light hoverable blue accent-3"
    >
      Logout
    </button>
  );
};

export default SignOut;
