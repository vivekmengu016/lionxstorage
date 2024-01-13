import React, { useEffect, useState } from "react";
import lionxStorage from "../lib";

const SessionStorage = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storeData = new lionxStorage('sessionStorage');

    // setting data
    storeData.set('user', { name: "john" });

    // getting data
    const retriveData = storeData.get("user");

    // store in local state
    setUser(retriveData);

  }, []);
  

  return (
    <div>
      <h2>sessionStorage Data:</h2>
      <pre>
        {JSON.stringify(user)}
      </pre>
    </div>
  )
}

export default SessionStorage