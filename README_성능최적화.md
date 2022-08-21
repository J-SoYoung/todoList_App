# 리액트를 다루는 기술<br> 
### - 11장 컴포넌트 성능 최적화<br>
<br>

## 1. 많은 데이터 관리<br>
for 반복문을 이용해 데이터를 자동생성 후 크롬 개발자도구를 통해 성능을 모니터링 함<br>
Render duration : 1007.4ms에서 40ms로 최적화 됨<br>
```
function createBulkTodos(){
  const array =[];
  for (let i=1; i<=2000; i++){
    array.push({
      id: i,
      text: `할일 ${i}`,
      checked: false,
    });
  }
  return array;
}
```
<br>

## 2. 느려지는 원인 <br>
1. 자신이 전달받은 props가 변경될때<br>
2. 자신의 state가 바뀔 때<br>
3. 부모 컴포넌트가 리렌더링 될때<br>
4. forceUpdate함수가 실행될 때 (강제업데이트)<br>
<br>

- '할 일 1' 항목을 체크할 경우 App 컴포넌트의 state인 todos가 변경되면서 App컴포넌트가 리렌더링 됨
- App과 연결된 자식컴포넌트 TodoList도 같이 리렌더링 됨
- TodoList안의 item = 할일목록 전체가 리렌더링 됨 
=> '할 일 1'의 항목 리렌더링이 전체 리스트를 리렌더링 시키게 되는 것
<br>

## 3. React.memo를 사용하여 컴포넌트 최적화<br>
해당 항목만 렌더링 될 수 있도록 TodoListItem에 React.memo로 최적화 적용<br>
```
export default React.memo(TodoListItem);
```
<br>

## 4. 함수형 업데이트<br>
- React.memo를 사용해 TodoListItem의 데이터 전체가 리렌더링 되는 부분을 최적화시켰다.<br>
- 하지만 todos의 데이터 하나가 업데이트 되면 TodoList로 넘어가는 onRemove와 onToggle의 함수도 새롭게 리렌더링된다. 위의 함수들은 최신상태의 todos를 참조하기 때문에 todos배열이 바뀌면 새로 함수가 생성된다.   <br>
- 새로운 상태를 setTodos에 넣어주는 것이 아니라, 상태 업데이트를 어떻게 할지 정의해주는 업데이트 함수를 넣을 수 있다. 
- 이를 **함수형 업데이트**라고 부른다<br>
<br>

```
  const onRemove = useCallback((id) => {
    // setTodos에 상태값을 넣는 게아니라, 업데이트 함수를 넣는 것
    // setTodos(todos.filter(todo=> todo.id !== id))
    setTodos(todos=>todos.filter(todo=> todo.id !== id))
    },[])
```
<br>

**useState는 비동기로 작동한다.** <br>
하나의 이벤트 핸들러 함수 내에서 같은 useState가 호출된다면 마지막에 실행한 setState가 실행되어 렌더링된다.<br>
동일한 state를 연속적으로 업데이트하는 경우, 모든 요청에 따라 setState를 각각 동기로 수행한 후 바로 리렌더링 하는 것이 아니라 **변경 사항을 모아서 한번에 일괄처리(batch)를 한다** 전달된 setState를 하나로 병합한 후 최종적으로 한 번의 setState를 하게 되어 **마지막 명령만 수행**하게 된다.<br>
<br>

###useState값이 바뀔 때마다 렌더링 하는 방법은?<br>
1. useEffect의 []빈 배열 안의 요소를 이용해 상태값을 바로 업데이트 하는 것<br>
2. **함수형 업데이트**<br>
함수형 업데이트란?? setState를 줄 때 어떠한 값을 주는 게 아니라 함수를 통해서 전달하는 방식을 이용하는 것<br>
```
// 이전코드
  const onClick =()=>{
    setCount(count + 1)
    console.log(count)

    setCount(count + 1.5)
    console.log(count)
  }

// 함수형 업데이트 코드
  const onClick =()=>{
    setCount((count)=> count + 1)
    console.log(count)

    setCount((count)=> count + 1.5)
    console.log(count)
  }
```
이처럼 state의 변경시마다 렌더링을 하고 싶다면 함수형 업데이트를 반드시 기억할 것!.<br>
<br>

## 5. useReducer사용 <br>
useState의 함수형 업데이트를 사용하는 대신,<br>
useReducer를 사용해도 onToggle와 onRemove함수의 불필요한 리렌더링을 최적화 시킬 수 있다. 
<br>

```
// reducer 함수
function todoReducer(todos, action){
  switch (action.type){
    case "INSERT" :
      return todos.concat(action.todo)
    case "REMOVE" :
      return todos.filter(todo=> todo.id !== action.id)
    case "TOGGLE" :
      return todos.map(todo =>
        todo.id === action.id ? { ...todo, checked: !todo.checked } : todo )
    default:
      return todos;
  }
}

// App컴포넌트에 reducer import
  const [todos, dispatch] = useReducer(todoReducer, undefinded, createBulkTodos)

// reducer를 적용한 onRemove함수
  const onRemove = useCallback((id) => {
    dispatch({type: "REMOVE", id})
    },[])
```
- useReducer의 첫번째 파라미터에는 리듀서함수<br>
- 두번째 파라미터는 초기상태값 <br>
- 세번째 파라미터는 초기화하는 함수가 들어갈 수 있다.<br>
<br>
useReducer는 기존 코드를 많이 고쳐야 하는 단점이 있지만 상태 업데이트 로직을 컴포넌트 바깥으로 둘 수 있다는 장점이 있다.
<br>
<br>


