"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GardenTestPage() {
  const [message, setMessage] = useState("Database integration temporarily disabled");
  const [loading, setLoading] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🌱 Garden Game Database Test</h1>
      
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
        <strong>Database Integration Status:</strong> Temporarily disabled for development
      </div>

      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
        <strong>What's Ready:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>✅ Database schema designed</li>
          <li>✅ Database queries implemented</li>
          <li>✅ Server actions created</li>
          <li>✅ Database seeded with initial data</li>
          <li>✅ Main garden game working</li>
        </ul>
      </div>

      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        <strong>Next Steps:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>🔧 Integrate database actions into main game</li>
          <li>🔧 Replace hardcoded state with database calls</li>
          <li>🔧 Add user authentication persistence</li>
          <li>🔧 Enable real-time data saving</li>
        </ul>
      </div>

      <div className="text-center">
        <Button 
          onClick={() => setMessage("Database integration coming soon!")}
          className="bg-green-600 hover:bg-green-700"
        >
          Test Button
        </Button>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}
