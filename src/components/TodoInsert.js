import { useCallback, useState } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import './TodoInsert.scss'

const TodoInsert = ({ onInsert })=>{

  const [ value, setValue ] = useState('')

  const handleOnchange = useCallback((e) =>{
    // console.log(e.target.value)
    setValue(e.target.value)
  }, []);

  const onSubmit = useCallback((e)=>{
    console.log('클릭버튼')
    onInsert(value)
    setValue('')
    e.preventDefault();
  }, 
    [onInsert, value]
  )

  return (
    <>
      <form className='TodoInsert' onSubmit={onSubmit}>
        <input 
          value={value}
          onChange = { handleOnchange }
          placeholder='할 일을 입력하세요'/>
        <button 
          type='submit'
          onClick={ onSubmit }  
        >
          <MdPlaylistAdd/>
        </button>
      </form>
    </>
  )
}

export default TodoInsert;