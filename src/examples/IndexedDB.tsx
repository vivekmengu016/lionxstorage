import React, { useEffect, useState } from "react";
import lionxStorage from "../lib";

const IndexedDBStorage = () => {
  const [user, setUser] = useState({});
  const [fruits, setFruits] = useState({});
  

  useEffect(() => {
    getIndexedDBData();
  }, []);

  const getIndexedDBData = async () => {
    try {
      const indexedDBSDK = new lionxStorage("indexedDB", "userData", 1);

      indexedDBSDK.init(["user", "fruits"]); // here we can pass multiple stores names to create all at once
    
      // setting data
      indexedDBSDK.set("user", { id: 1, name: "John" });

      // getting data
      const retriveUsersData = await indexedDBSDK.get("user");

      // storing in local state
      setUser(retriveUsersData);

      // setting data
      indexedDBSDK.set("fruits", { id: 123, name: "Apple", price: 200 });
      indexedDBSDK.set("fruits", { id: 124, name: "Banana", price: 100 });
      indexedDBSDK.set("fruits", { id: 125, name: "Cherry", price: 150 });

      // getting data 
      const retriveFruitsData = await indexedDBSDK.get("fruits");
      setFruits(retriveFruitsData);

    } catch (error) {
      console.log("IndexedDB caught error : ", error);
    }
  }
  

  return (
    <div>
      <h2>indexedDB Data:</h2>
      <h3>Users:</h3>
      <pre>
        {JSON.stringify(user)}
      </pre>
      <h3>Fruits:</h3>
      <pre>
        {JSON.stringify(fruits)}
      </pre>
    </div>
  )
}

export default IndexedDBStorage