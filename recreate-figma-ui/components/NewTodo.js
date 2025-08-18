import { useState } from 'react'
import { createTaskAction } from '../app/actions/garden-actions'

export default ({ reload, currentUser, onTaskCreated }) => {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const addTask = async (e) => {
    e.preventDefault()
    if (!title.trim() || !currentUser) return
    
    setLoading(true)
    try {
      // Create a new task using the garden actions
      const result = await createTaskAction({
        userId: currentUser.id,
        name: title.trim(),
        progress: 0,
        target: 1, // Default target
        emoji: "📝", // Default emoji
        color: "text-blue-500", // Default color
        reward: 10, // Default reward
        completed: false
      })
      
      if (result.status === "success") {
        reload()
        setTitle('')
        
        // Notify parent component that a task was created
        if (onTaskCreated) {
          onTaskCreated()
        }
      } else {
        throw new Error(result.message || 'Failed to create task')
      }
    } catch (err) {
      console.error('Error adding task:', err)
      alert('Failed to add task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={addTask} className="flex gap-2">
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a new task..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading || !currentUser}
      />
      <button 
        type="submit" 
        disabled={loading || !title.trim() || !currentUser}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  )
}
