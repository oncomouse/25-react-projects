import React, { createContext, useContext, useState } from 'react';
import { Global, css } from '@emotion/core';
import styled from '@emotion/styled';
import { append, equals, reject } from 'ramda';
import { searchList } from '../project1';

const DeleteContext = createContext(() => false);

const INITIAL_TASKS = ["Finish Redux Tutorials", "Learn more about Relay", "Build 5 more React apps", "Review React Component Lifecycle", "Obtain Data Visualization Certificate", "Review Algorithms", "Tweet Progress", "Get a coffee!", "Browse Google Fonts", "Learn more about React Native"];
const GLOBAL_STYLE = css`
@import url('https://fonts.googleapis.com/css?family=Prompt');
body {
  background: #404146;
  text-align: center;
  height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  font-family: 'Prompt', sans-serif;
}

button {
  font-size: 18px;
  border-radius: 3px;
  border: none;
}

input {
  padding: 7px;
  text-align: center;
  background: #1F2124;
  border: none;
  border-radius: 2px;
  color: #03E1A4;
}

::-webkit-input-placeholder {
  color: #b4b4b4;
}
`;

const Container = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  background: #ff4e50;
  min-width: 600px;
  box-shadow: 10px 10px 5px #0f0f0f;
  border-radius: 5px;

  & .titles {
    background: #f9d423;
    height: 150px;
  }

  & .title {
    font-size: 50px;
    padding-top: 15px;
    margin-bottom: -15px;
  }

  & .subtitle {
    margin-bottom: 15px;
  }

  & .newTask {
    font-size: 20px;
    margin-top: 15px;
  }

  & .enter {
    margin-top: 10px;
    margin-bottom: 10px;
    background: #1ec0ff;
    font-size: 25px;
    padding: 8px;
  }
`;

const Clear = styled.button`
  margin-top: 15px;
  margin-right: 8px;
  font-size: 25px;
  padding: 10px;
  background: #f9d423;
  margin-bottom: 20px;
`;

const Reset = styled.button`
  margin-top: 15px;
  margin-left: 8px;
  font-size: 25px;
  padding: 10px;
  background: #f9d423;
  margin-bottom: 20px;
`;

const Project4 = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filterText, setFilterText] = useState('');
  const [newTask, setNewTask] = useState('');

  const addTask = task => setTasks(append(task));
  const deleteTask = task => setTasks(reject(equals(task)));
  const clearTasks = () => setTasks([]);
  const resetTasks = () => setTasks(INITIAL_TASKS);

  const addEvent = (ev) => {
    ev.preventDefault();
    addTask(newTask);
    setNewTask('');
  };
  const newTaskChangeEvent = ev => setNewTask(ev.target.value);

  const filterChangeEvent = ev => setFilterText(ev.target.value);

  const filtered = searchList(filterText);

  return (
    <Container>
      <Global styles={GLOBAL_STYLE}/>
      <div className="titles">
        <h1 className="title">React To-Do App</h1>
        <h2 className="subtitle">Enhance Your Productivity</h2>
      </div>
      <div>
        <form onSubmit={addEvent}>
          <input
            className="newTask"
            type="text"
            placeholder="create new work item"
            onChange={newTaskChangeEvent}
            value={newTask}
          />
          <br />
          <button className="enter" type="submit">Enter New Item</button>
        </form>
        <form>
          <input
            style={{fontSize: '20px'}}
            type="text"
            placeholder="filter list"
            value={filterText}
            onChange={filterChangeEvent}
          />
        </form>
        <DeleteContext.Provider value={deleteTask}>
          <TaskList tasks={filtered(tasks)} />
        </DeleteContext.Provider>
        <Clear onClick={clearTasks}>Clear Tasks</Clear>
        <Reset onClick={resetTasks}>Rest Tasks</Reset>
      </div>
    </Container>
  );
}

const TaskListContainer = styled.table`
  border-collapse: separate;
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;

  & tr,
  & td {
    border:none;
  }

  & td {
    font-size: 20px;
  }

  & th {
    font-size: 25px;
  }

  & .taskNumber {
    text-align: right;
  }

  & .taskItem {
    text-align: left;
    padding-left: 25px;
  }
`;

const TaskList = (props) => {
  const {
    tasks
  } = props;

  return (
    <TaskListContainer>
      <thead>
        <tr>
          <th className='taskNumber'>#</th>
          <th className='taskItem'>Task</th>
          <th>(X)</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, i) => (
          <Task key={i} task={task} number={i+1} />
        ))}
      </tbody>
    </TaskListContainer>
  )
}

const TaskContainer = styled.tr`
  & .taskNumber {
    text-align: right;
  }

  & .taskItem {
    text-align: left;
    padding-left: 25px;
  }

  & .remove {
    background: #f9d423;
  }
`;

const Task = (props) => {
  const {
    number,
    task
  } = props;
  const deleteTask = useContext(DeleteContext);

  return (
    <TaskContainer>
      <td className='taskNumber'>Task {number}:</td>
      <td className="taskItem">{task}</td>
      <td>
        <button onClick={() => deleteTask(task)} className="remove">X</button>
      </td>
    </TaskContainer>
  );
}

export default Project4;