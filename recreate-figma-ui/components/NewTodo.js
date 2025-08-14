import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default ({ reload }) => {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const addTodo = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    
    setLoading(true)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration is missing')
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      const { error } = await supabase.from('todos').insert({ title: title.trim() })
      
      if (error) {
        throw error
      }
      
      reload()
      setTitle('')
    } catch (err) {
      console.error('Error adding todo:', err)
      alert('Failed to add todo. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={addTodo} className="flex gap-2">
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a new todo..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <button 
        type="submit" 
        disabled={loading || !title.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Adding...' : 'Add Todo'}
      </button>
    </form>
  )
}
