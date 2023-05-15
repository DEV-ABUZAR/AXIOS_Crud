import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState([])
  const [error, setError] = useState("")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [postId, setPostId] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
        setData(response.data)
      } catch (error) {
        setError(error)
      }
    }
    fetchData()
  }, [])

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  const handleBodyChange = (e) => {
    setBody(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isUpdating) {
        await axios.put(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
          title: title,
          body: body,
          userId: 1
        })
        setIsUpdating(false)
        setPostId(null)
        setData(data.map(post => post.id === postId ? { ...post, title: title, body: body } : post))
      } else {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
          title: title,
          body: body,
          userId: 1
        })
        setData([...data, response.data])
      }
      setTitle("")
      setBody("")
    } catch (error) {
      setError(error)
    }
  }

  const handleUpdate = (id) => {
    const postToUpdate = data.find(post => post.id === id)
    setTitle(postToUpdate.title)
    setBody(postToUpdate.body)
    setPostId(id)
    setIsUpdating(true)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      setData(data.filter((post) => post.id !== id));
    } catch (error) {
      setError(error);
    }
  };
  

  return (
    <div className="App">
      <h1>Axios Methods</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' className='text' value={title} placeholder='title' onChange={handleTitleChange} />
        <input value={body} className='text' placeholder='body' onChange={handleBodyChange}></input>
        <button type='submit' className='btn'>{isUpdating ? "Update" : "Submit"}</button>
      </form>
      {error ? (
        <p>{error.message}</p>
      ) : (
        <div className="card-container">
          {data.map((item, index) => (
            <div
              className="card"
              key={item.id}
              style={{
                width: "45%",
                margin: "10px",
                display: "inline-block",
                verticalAlign: "top"
              }}
            >
              <h2>{item.title}</h2>
              <p>{item.body}</p>
              <button className="btn" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
              <button className="btn" onClick={() => handleUpdate(item.id)}>
                Update
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
