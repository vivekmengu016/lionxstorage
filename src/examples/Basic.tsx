import React from "react";
import LionXStorage from "../lib";

// interface AppProps {}

// const App: React.FC<AppProps> = () => {
//   const lion = new LionXStorage("localStorage");

//   lion.set("abc", { name: "testing" });
//   let a = lion.get("abc");
//   console.log('a here', a)

//   return <div>Hello Basic {a.name}</div>;
// };

// export default App;

const Abc = () => {
  const lionx = new LionXStorage("sessionStorage");
  lionx.set('abc', { name: "hello world" });

  const indexed = new LionXStorage('indexedDB', "UserDatabase", 1);
  indexed.init(["user"]);
  indexed.set('user', { id: 1, name: "test" })
  indexed.set('user', { id: 2, name: "joh" })

  async function abc() {
    let data = await indexed.get("user");
    console.log("the data", data);
  }

  abc();

  return (
    <div>
      hello {lionx.get('abc').name}
    </div>
  )
}

export default Abc;