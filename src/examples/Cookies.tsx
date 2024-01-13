import React, { useEffect, useState } from "react";
import lionxStorage from "../lib";

const CookieStorage = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const storeData = new lionxStorage('cookies');

    // setting data
    const expireData = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Set to expire in 30 days
    storeData.set('user', { name: "john" }, { expires: expireData, path: '/'});

    // getting data
    const retrieveData = storeData.get("user");

    // store in local state
    setUser(retrieveData);

  }, []);

  return (
    <div>
      <h2>cookie Data:</h2>
      <pre>
        {JSON.stringify(user)}
      </pre>
    </div>
  )
}

export default CookieStorage