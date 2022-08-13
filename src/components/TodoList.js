import TodoListItem from "./TodoListItem";



const TodoList = ({todos}) =>{
  // console.log(todos)
  
  return (
    <>
      {todos.map(todo=>(
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </>
  )
}

export default TodoList;