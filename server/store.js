const express=require('express')
const app = express()
const cors=require('cors')
const mongoose=require('mongoose')
app.use(express.json());
app.use(cors())
//db connection
mongoose.connect('mongodb://localhost:27017/todo').then(()=>{
    console.log('db is connected !')
})
.catch((err)=>{
    console.log('db is connection error',err.message)
})
//model
const TaskSchema=mongoose.Schema({
    task:String
})
const TaskModel=mongoose.model('Task',TaskSchema)
app.post('/post',async(req,res)=>{
const {task}=req.body;
if (!task){
    return res.json({message:"Please the Task"})
}
try{

    const taskinsert=await TaskModel({
        task
    })
    await taskinsert.save()
    res.status(201).json({message:"Task Created Successfully!"})
}
catch(err){
res.status(500).json({message:"Internal Server Error"})
}
}
)
app.get('/post',async(req,res)=>{
    try{
const fetchTask=await TaskModel.find({})
if(fetchTask.length===0){
    return res.json({message:"Empty Tasks"})
}
res.json({message:"Task Fetched Successfully!",fetchTask})

    }
    catch(err){
res.json({message:"Internal Server Error"})
    }

})
app.delete('/delete/:id',async(req,res)=>{
    const DeleteTasks=await TaskModel.findByIdAndDelete(req.params.id)
    try{
        if(DeleteTasks.length===0){
            return res.status(404).json({message:"Task Empty!"})
        }
        res.status(201).json({message:"Task Deleted Successfully!"})
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
})
app.put('/edit/:id',async(req,res)=>{

    const value=req.body.value;
    

    const EditTasks=await TaskModel.findByIdAndUpdate(req.params.id,{task:value})  
    try{
        if(EditTasks.length===0){
            return res.status(404).json({message:"Task Empty!"})
        }
        res.status(201).json({message:"Task Edited Successfully!",EditTasks})
    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
})

app.listen(4000,()=>{
    console.log("server is started!")
})