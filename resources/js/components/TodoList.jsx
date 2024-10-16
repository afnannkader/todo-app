import React from 'react';
import DeleteDialog from './DeleteDialog';
import EditModal from './EditModal';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

const TodoList = ({ tasks, setTasks }) => {

  const handleTaskCompletion = async (task) => {
    const response = await axios.put(`/update/${task.id}`, {
      ...task,
      completed: !task.completed,
    });

    if (response.status === 200) {
      const updatedTasks = tasks.map(t => t.id === response.data.updatedTask.id ? response.data.updatedTask : t);
      setTasks(updatedTasks);
    }
  };

  const handleDeleteTask = async (id) => {
    const response = await axios.delete(`/delete/${id}`);

    if (response.status === 200) {
      const updatedTasks = tasks.filter(t => t.id !== id);
      toast.success(`${response.data.message}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTasks(updatedTasks);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return; // If dropped outside of any column

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    
    // Update task status based on the column it was dropped into
    const newStatus = destination.droppableId;
    movedTask.status = newStatus;
    
    console.log('Moved task:', movedTask);

    // Update task status in the backend
    await axios.put(`/update/${movedTask.id}`, movedTask);

    updatedTasks.splice(destination.index, 0, movedTask);
    setTasks(updatedTasks);
    console.log('Updated tasks:', updatedTasks);
  };

  // Filter tasks by status
  const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-5">

        {/* Pending Tasks */}
        <Droppable droppableId="pending">
          {(provided) => (
            <div className="flex-1" {...provided.droppableProps} ref={provided.innerRef}>
              <h2 className="text-xl font-semibold mb-3">Pending</h2>
              <ul className="flex flex-col gap-5">
                {getTasksByStatus('pending').map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center gap-5 bg-white p-5 rounded-lg ${task.completed ? 'text-gray-400 line-through' : ''}`}
                      >
                        <div>
                          <button onClick={() => handleTaskCompletion(task)} className={`rounded-full w-6 h-6 border ${task.completed ? 'bg-blue-500 text-white' : ''}`}>
                            <svg fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1 break-all">
                          <p className="text-base font-semibold">{task.title}</p>
                          <p className="text-sm">{task.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <EditModal task={task} tasks={tasks} setTasks={setTasks} />
                          <DeleteDialog handleDeleteTask={handleDeleteTask} task={task} />
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
        </Droppable>

        {/* In Progress Tasks */}
        <Droppable droppableId="in-progress">
          {(provided) => (
            <div className="flex-1" {...provided.droppableProps} ref={provided.innerRef}>
              <h2 className="text-xl font-semibold mb-3">In Progress</h2>
              <ul className="flex flex-col gap-5">
                {getTasksByStatus('in-progress').map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center gap-5 bg-white p-5 rounded-lg ${task.completed ? 'text-gray-400 line-through' : ''}`}
                      >
                        <div>
                          <button onClick={() => handleTaskCompletion(task)} className={`rounded-full w-6 h-6 border ${task.completed ? 'bg-blue-500 text-white' : ''}`}>
                            <svg fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1 break-all">
                          <p className="text-base font-semibold">{task.title}</p>
                          <p className="text-sm">{task.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <EditModal task={task} tasks={tasks} setTasks={setTasks} />
                          <DeleteDialog handleDeleteTask={handleDeleteTask} task={task} />
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
        </Droppable>

        {/* Completed Tasks */}
        <Droppable droppableId="completed">
          {(provided) => (
            <div className="flex-1" {...provided.droppableProps} ref={provided.innerRef}>
              <h2 className="text-xl font-semibold mb-3">Completed</h2>
              <ul className="flex flex-col gap-5">
                {getTasksByStatus('completed').map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center gap-5 bg-white p-5 rounded-lg ${task.completed ? 'text-gray-400 line-through' : ''}`}
                      >
                        <div>
                          <button onClick={() => handleTaskCompletion(task)} className={`rounded-full w-6 h-6 border ${task.completed ? 'bg-blue-500 text-white' : ''}`}>
                            <svg fill="none" stroke="currentColor" className="w-4 h-4" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1 break-all">
                          <p className="text-base font-semibold">{task.title}</p>
                          <p className="text-sm">{task.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <EditModal task={task} tasks={tasks} setTasks={setTasks} />
                          <DeleteDialog handleDeleteTask={handleDeleteTask} task={task} />
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            </div>
          )}
        </Droppable>

      </div>
    </DragDropContext>
  );
};

export default TodoList;
