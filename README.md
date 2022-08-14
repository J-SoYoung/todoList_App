# 리액트를 다루는 기술<br> 
### - 10장 일정관리어플리케이션 만들기 실습<br>
<br>

## 1. 프로젝트 준비<br>
### 프로젝트 생성 및 라이브러리 설치<br>
```
yarn start react-app todo
yarn add sass classnames react-icons
```
- 프로젝트를 생성하였고, Sass를 사용하였다. 
- classnames : 조건부로 classNames를 함께 사용하기 위해 설치함( 간단한 javaScript 유틸리티 )
- react-icons : 아이콘 사용을 위한 라이브러리다.
<br>

### Prettire설정
Prettire는 코드스타일 자동정리도구이다. 프로젝트의 최상위 디렉터리(root)에 파일을 생성하면 된다.<br>
```
{
  "singleQuote" : true,
  "semi" : true,
  "useTabs" : false,
  "useWidth" : 2,
  "trailingComma" : "all",
  "printWidth" : 80
}
```
<br>

## 2. UI 구성하기<br>
### 컴포넌트의 용도<br>
- TodoTemplate : 화면 메인, 일정관리 내용을 보여준다<br>
- TodoInsert : input을 통해 새로운 항목을 입출력 하는 역할의 컴포넌트, state를 통해 input의 상태를 관리한다<br>
- TodoList : state로 관리되는 input값을 props로 받아와 배열 내장함수 map을 통해 각각의 항목으로 만든 후 TodoListItem컴포넌트로 보낸다<br>
- TodoListItem : 각 할일 항목에 대한 정보를 보여주는 컴포넌트, todo객체를 받아와서 각각의 상태에 따른 style을 보여준다<br>
<br>

### jsconfig.json<br>
**리액트에서 파일 위치를 import 할 때, 절대경로로 설정하기 위한 파일이다.**<br>
이 프로젝트에서는 간단한 import만 사용할 거라 절대경로를 사용하지는 않았고, 탭이 열려있지 않은 상태에서도 import자동완성이 될 수 있도록 만 설정해주었다. **프로젝트 최상위 디렉터리에 jsconfig.json파일을 생성하였다.**<br>
```
{
  "compilerOptions": {
    "target": "es2020"
  }
}
```
<br>

**jsconfig.json 란?**(블로그 추가설명)<br>
> 디렉토리 에 jsconfig.json파일이 있으면 해당 디렉토리가 JavaScript 프로젝트의 루트임을 나타낸다.<br>
> 프로젝트에 속한 파일, 프로젝트에서 제외할 파일 및 컴파일러 옵션을 나열할 수 있다.<br>
> - baseUrl: 프로젝트 기본 디렉토리(절대 경로 기준 디렉토리)<br>
> - paths: baseUrl 기준으로 계산될 경로, baseUrl 옵션 설정이 선행되어야 한다!<br>
<br>

### Scss스타일링<br>
내가 생각한 Scss의 가장 큰 특징은 CSS규칙을 중첩하여 사용할 수 있다는 점이다.<br>
부모 선택자를 반복하여 작성하지않게 해준다. 하지만 3Depth이상 중첩을 사용하는 것은 좋지 않다.<br>
```
.TodoInsert {
  background: #495057;
  input{
    background: none;
    outline: none;
    border: none;
  }
  button {
    background: #868e96;
    color: white;
    padding: 1rem;
    &:hover {
      background: #adb5db;
    }
  }
}
```
<br>

## 3. 기능 구현하기<br>
image.png
<br>

### 메인에 Todo탭 보여주기<br>
**App에서 todos 상태 관리**<br>
```
function App() {
  const [todos, setTodos] = useState([
    {
      id:1,
      text: '리액트 기초 공부',
      checked : true
    },
  ])

 return (
    <>
    <TodoTemplate>
      <TodoInsert/>
      <TodoList todos={todos} />
    </TodoTemplate>
    </>
  );
}
```
useState로 관리하는 todos를 TodoList에 props로 전달해주었다.<br>

**TodoList**
```
const TodoList = ({todos}) =>{
  console.log(todos)
  return (
    <div className="TodoList">
      {todos.map(todo=>(
        <TodoListItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}
```
- App에서 props로 받은 todos를 map을 돌려서 하나씩 출력해 TodoListItem에 todo props로 보낸다. 
- map을 돌릴 때에는 key값을 넣어줘야 하기 때문에, 각 항목의 고유값인 id를 넣어준다.
<br>

**TodoListItem**
```
const TodoListItem = ({ todo }) =>{
  //구조분해할당으로 객체의 값을 해체하여 그 값을 개별 변수에 담을 수 있게 했다.
  const { id, text, checked } = todo;

  return (
    <>
      <div className="TodoListItem">
        <div className={cn("checkbox", { checked })} onClick={()=>onToggle(id)}>
          {checked? <MdCheckBox/> : <MdCheckBoxOutlineBlank/>}
          <div className="text">{text}</div>
        </div>
        <div className="remove">
          <MdRemoveCircleOutline/>
        </div>
      </div>
    </>
  )}
```
<br>

### 항목 추가기능<br>
- input에 입력하는 값을 관리할 수 있도록 useState의 value값의 상태를 정의한다<br>
- input에 onChange함수를 작성하는데, 함수를 만들고 재사용 할 수 있도록 useCallback(Hook)을 사용한다.<br>

**TodiInsert**
```
  const [ value, setValue ] = useState('')
  const handleOnchange = useCallback((e) =>{
    setValue(e.target.value)
  }, []);

  const onSubmit = useCallback((e)=>{
    console.log('클릭버튼')
    onInsert(value)     // 버튼을 클릭하면 App에 value를 인수로 onInsert함수실행
    setValue('')        // input에 값을 입력하고 나면 "" 텍스트가 남아있지않게 
    e.preventDefault(); // 자동으로 새로고침 되지 않도록
  }, 
    [onInsert, value]   // onInsert, value값이 리렌더링 될 때만 함수생성
  )

  return (
    <>
      <form className='TodoInsert'>
        <input value={value} onChange = { handleOnchange }/>
        <button type='submit' onClick={ onSubmit }>
          <MdPlaylistAdd/>
        </button>
      </form>
    </>
  )}
```
<br>

**App => onInsert함수**
> - todos 배열에 새 객체를 추가해야 한다.<br>
> - 새로운 객체가 생성될 때마다 id의 값은 1씩 증가해야 한다 -> useRef를 사용<br>
>  ( useRef의 current속성을 사용해 id값을 만들어놓음 -> 렌더링 되어도 current속성값은 변하지 않음 )<br>
> - state를 관리하고 있는 App에 onInsert함수를 만들었지만 실행해야 하는 컴포넌트는 TodoInsert이므로 props로 값을 넘겨준다<br>
```
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

```
<br>

**TodoInsert에서 onSubmit 이벤트 실행하기**<br>
> input에 값을 넣고 button을 클릭하면 이벤트를 실행해야 한다<br>
> 실행하는 이벤트에는 props로 받아온 onInset 함수를 넣어준다<br>
> **Click이벤트를 사용해도 되었는데, form-submit을 사용한 이유는?**<br>
> onClick은 onKeyPress이벤트를 사용해 Enter를 감지하는 로직을 따로 만들어줘야 하지만<br>
> onSubmit의 경우 input에서 Enter를 눌렀을 때도 이벤트가 발생하기 때문이다. <br>
<br>

### 항목 삭제기능<br>
**App=> onRemove함수**<br>
> App에서 onRemove함수를 만들고<br>
> TodoList -> TodolistItem로 props를 넘겨주어 TodoListItem에서 사용할 수 있게 한다<br> 
> TodoListItem은 (-)아이콘에 onClick이벤트를 걸어 onRemove가 실행되게 한다<br>
```
  // App
  const onRemove = useCallback((id) => {
    setTodos(todos.filter(todo=> todo.id !== id))
    },
    [todos]
  )

  // TodoListItem
  <div className="remove" onClick={()=>onRemove(id)}>
    <MdRemoveCircleOutline/>
  </div>
```
<br>


### 항목 체크기능<br>
**App=> onToggle함수**<br>
> toggle함수 내용: 배열 내장함수 map을 사용하여 특정 id를 가지고 있으면 checked항목이 반대로 바뀌며 <br>
> 해당 항목의 스타일이 글자색이 옅어지고, 중앙에 취소선이 생기게 한다. <br>
> 다시 클릭하면 반대의 반대의 스타일로 돌아간다<br>
```
  const onToggle = useCallback((id)=>{
    setTodos(todos.map(todo=> 
      todo.id === id? {...todo, checked: !todo.checked } : todo))
  },[todos])
```
<br>

**만들고 난 후**<br>
처음 리액트를 공부할 때보다 훨씬 이해가 잘돼서 재미있었다. 그리고 드문드문 알고 있었던 지식이 순서대로 정리가 되는 느낌이었다. 책으로 코드를 이해하고, 이해가 잘 되지 않는 부분은 직접 검색해서 찾아보기도 하면서 prettire, jsconfig.json, Scss문법, style코드 등을 검색해서 정리해 볼 수 있는 좋은 시간이었다. 깃허브에는 더 정리하지 못한 부분은 블로그에 하나씩 떼어서 정리해볼 생각이다. <br>
더욱이 그냥 따라치던 코드에서 '왜 이렇게 되는거지?'라는 의문이 생기는 몇 부분도 있었고, 컴포넌트 사이에 props를 내려주는 부분(?)에서 굳이.. 이 컴포넌트에서는 사용할 필요 없는 props를 줄줄이 내려줘야 한다는 생각이 들었고 redux가 필요한 상황은 이런 상황이라는 것을 체험?하게 되었다. 아주 간단한 프로젝트지만 많은 것을 공부할 수 있게 해준 프로젝트였다.