import React, { useEffect, useState } from "react";
import lionxStorage from "../lib";

const LocalStorage = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storeData = new lionxStorage('localStorage');

    // setting data
    storeData.set('user', { name: "john" });

    // getting data
    const retriveData = storeData.get("user");

    // store in local state
    setUser(retriveData);

  }, []);

  return (
    <div>
      <h2>localStorage Data:</h2>
      <pre>
        {JSON.stringify(user)}
      </pre>
    </div>
  )
}

export default LocalStorage