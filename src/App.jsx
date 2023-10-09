import { useState } from "react"
import { BarLoader } from "react-spinners"
function App() {
  const [title,setTitle] = useState('')
  const [wait,setWait] = useState(true)
  const [data,setDatas] = useState([])
  const [loading,setLoading] = useState(null)
  const [error,setError] = useState(false) 
  function check(){
    if(title === ''){
      setError(true)
      setWait(true)
      setLoading(true)
      setTimeout(()=>{
        setLoading(false)
        setError(true)
      },600)
    }else{
        setError(false)
        setLoading(true)
        fetch(`https://openlibrary.org/search.json?q=${title}`)
        .then(res=>res.json())
        .then((resp)=>{
          setDatas(resp.docs)
            setTimeout(()=>{
              setLoading(false)
              setWait(false)
            },1000)
        }).catch((err)=>
          {
            console.log(err)
            setError(false)
            setLoading(false)
          }
          )
    }
  }
    
  return (
    <>
    <div className="flex flex-col justify-center items-center text-center gap-5 p-10 sm:p-20 min-h-screen h-auto bg-slate-700">
        <h1 className="text-5xl text-white">Open Library Search API</h1>
        <input type="text" autoComplete='true' className="p-1 px-5 w-full max-w-[400px] outline-none" onChange={(e)=>setTitle(e.target.value)} placeholder="Search book title"/>
        <button className="border-[1px] w-full max-w-[400px] text-white rounded hover:bg-white hover:text-black duration-200 active:scale-95" onClick={()=>check()}>Search</button>
      <div className="rounded-lg">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {error?'':
            wait?'':data.map((title,index)=>(
            <div className="border-[1px] w-full bg-emerald-600 rounded p-2">
              <li className="text-blue-300" key={index+1}>Author: {title.author_name}</li>
              <li className="text-slate-600" key={index}>Title: {title.title}</li>
              <span className="text-green-300">Want to read count: {title.want_to_read_count===undefined||null||''?0:title.want_to_read_count}</span>
            </div>
            ))
          }
        </ul>
        {loading?
        <BarLoader color="green"/>:
          error?<span className="border-2 border-red-800 px-4 py-3 rounded-md bg-red-300 text-red-800">This field can not be empty</span>
          :''
        }
      </div>
    </div>
    </>
  )
}

export default App
