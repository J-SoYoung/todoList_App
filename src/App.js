import { useCallback, useRef, useState } from 'react';
import './App.css';
import TodoInsert from './components/TodoInsert';
import TodoList from './components/TodoList';
import TodoTemplate from './components/TodoTemplate';

function App() {
  const [todos, setTodos] = useState([
    {
      id:1,
      text: '리액트 기초 공부',
      checked : true
    },
    {
      id:2,
      text: '컴포넌트 스타일링, SCSS사용해봄',
      checked : true
    },
    {
      id:3,
      text: '일정관리 앱 만들어보기',
      checked : false
    },
  ])  

  const nextId = useRef(4)

  const onInsert = useCallback((text) => {
    const todo = {
      id:nextId.current,
      text,
      checked:false,
    };
    setTodos(todos.concat(todo));
    nextId.current += 1
  }, [todos])


  return (
    <>
    <TodoTemplate>
      <TodoInsert onInsert={onInsert}/>
      <TodoList todos={todos}/>
    </TodoTemplate>
    </>
  );
}

export default App;
