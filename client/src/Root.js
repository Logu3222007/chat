import React, { useEffect, useState } from 'react'
import axios from 'axios'
const Root = () => {
  const [task,settask]=useState()
  const [gtask,setgtask]=useState([])
  
  const TaskPostHandler =(e)=>{
    e.preventDefault();
try{
  axios.post('http://localhost:4000/post',{
   task 
  })
  .then((res)=>{
    if(res.status===201){
      console.log('Task Created Successfully!')
    FetchTasks()
    settask()

    }
  })

}
catch(err)
{
console.log("Failed to create task",err.message)
}
  }
  const FetchTasks=async()=>{
    try{
      const fetchedTask=await axios.get('http://localhost:4000/post')
      setgtask(fetchedTask.data.fetchTask||[])
      
      
    }
    catch(err){
console.log('Tasks fetching Error')
    }
  }
  const DeleteTasks=async(id)=>{
    try{
      const fetchedTasks=await axios.delete('http://localhost:4000/delete/'+id)
      if(fetchedTasks.status===201){
    FetchTasks()
      }
      
    }
    catch(err){
console.log('Tasks fetching Error')
    }
  }
  const EditTasks=async(id,value)=>{
    console.log('value : ',value)
    try{
      const EditTask=await axios.put('http://localhost:4000/edit/'+id,{value})
      if(EditTask.status===201){
    FetchTasks()
      }
      
    }
    catch(err){
console.log('Tasks fetching Error')
    }
  }
  useEffect(()=>{
    FetchTasks()
  },[])
  return (
    <div>
      <center style={{paddingTop:"15%"}}>
      <form onSubmit={TaskPostHandler}>
        <input type='text' placeholder='Add Task' onChange={(e)=>{settask(e.target.value)}}/>&nbsp;
        <input type='submit' />
      </form>
      {
gtask.length>0?gtask.map((item,index)=>
<table>
  <tr key={index}>
    <td onBlur={(e)=>EditTasks(item._id,e.target.innerText)} contentEditable>{item.task}</td>
    <td style={{cursor:"pointer"}} onClick={()=>DeleteTasks(item._id)}>&times;</td>
  </tr>
</table>  
):"No Tasks are there."
      }
      </center>
    </div>
  )
}

export default Root