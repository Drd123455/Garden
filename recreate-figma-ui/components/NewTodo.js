import { useState } from 'react'
import getSupabaseClient from '../utils/supabase'

export default ({ reload }) => {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const addTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    
    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      
      // Create a new task with default values matching your schema
      // Note: You'll need to get the actual userId from authentication
      const { error } = await supabase.from('tasks').insert({ 
        name: title.trim(),
        progress: 0,
        target: 1, // Default target
        color: '#3B82F6', // Default blue color
        reward: 10, // Default reward
        completed: false,
        userId: '00000000-0000-0000-0000-000000000000' // Placeholder - replace with actual user ID
      })
      
      if (error) {
        throw error
      }
      
      reload()
      setTitle('')
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
        disabled={loading}
      />
      <button 
        type="submit" 
        disabled={loading || !title.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  )
}
