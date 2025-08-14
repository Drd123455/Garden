"use client"

import { useState, useEffect } from 'react'
import supabase from '../../utils/supabase'
import NewTodo from '../../components/NewTodo'

export default function TodosPage() {
  const [todos, setTodos] = useState([])

  const fetchTodos = async () => {
    const { data } = await supabase.from('todos').select('*')
    setTodos(data)
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>
      <NewTodo reload={fetchTodos} />
      <div className="mt-8">
        {todos.map((todo) => (
          <p key={todo.id} className="p-3 bg-gray-100 rounded mb-2">
            {todo.title}
          </p>
        ))}
      </div>
    </div>
  )
}
