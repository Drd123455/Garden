"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import NewTodo from '../../components/NewTodo'

interface Todo {
  id: number
  title: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTodos = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        setError('Supabase configuration is missing')
        setLoading(false)
        return
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data, error: supabaseError } = await supabase.from('todos').select('*')
      
      if (supabaseError) {
        throw supabaseError
      }
      
      setTodos(data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch todos')
      console.error('Error fetching todos:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Todo List</h1>
        <div className="p-4 bg-gray-100 text-gray-600 rounded">
          Loading todos...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Todo List</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>
      <NewTodo reload={fetchTodos} />
      <div className="mt-8">
        {todos.length === 0 ? (
          <p className="p-4 bg-gray-100 text-gray-600 rounded">
            No todos yet. Add one above!
          </p>
        ) : (
          todos.map((todo) => (
            <p key={todo.id} className="p-3 bg-gray-100 rounded mb-2">
              {todo.title}
            </p>
          ))
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
