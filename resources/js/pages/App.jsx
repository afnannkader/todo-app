import React, { useEffect, useState } from "react";
import axios from "axios";
import TodoAdd from "../components/TodoAdd";
import TodoList from "../components/TodoList";

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('/get-todo')
      .then(response => {
        setTasks(response.data.reverse());
        console.log('response data', response.data);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Todo List</h1>
      <TodoAdd tasks={tasks} setTasks={setTasks} />
      <TodoList tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default App;
