"use client"

import { useState, useEffect } from 'react'
import supabase from '../../utils/supabase'
import NewTodo from '../../components/NewTodo'

interface Task {
  id: string
  name: string
  progress: number
  target: number
  color: string
  reward: number
  completed: boolean
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      const { data, error: supabaseError } = await supabase.from('tasks').select('*')
      
      if (supabaseError) {
        throw supabaseError
      }
      
      setTasks(data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch tasks')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Task List</h1>
        <div className="p-4 bg-gray-100 text-gray-600 rounded">
          Loading tasks...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Task List</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Task List</h1>
      <NewTodo reload={fetchTasks} />
      <div className="mt-8">
        {tasks.length === 0 ? (
          <p className="p-4 bg-gray-100 text-gray-600 rounded">
            No tasks yet. Add one above!
          </p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="p-3 bg-gray-100 rounded mb-2 flex items-center justify-between">
              <span className="flex-1">{task.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {task.progress}/{task.target}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${task.completed ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                  {task.completed ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
