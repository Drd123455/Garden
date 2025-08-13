"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Database imports temporarily disabled
// import { 
//   createExampleAction, 
//   getAllExamplesAction, 
//   getExampleByIdAction, 
//   updateExampleAction, 
//   deleteExampleAction 
// } from "@/actions/example-actions";
// import { InsertExample } from "@/db/schema/example-schema";

export default function TestBackendPage() {
  const [formData, setFormData] = useState<any>({
    name: "",
    age: 0,
    email: ""
  });
  const [examples, setExamples] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: field === 'age' ? Number(value) : value
    }));
  };

  const handleCreateExample = async () => {
    setLoading(true);
    try {
      // Database actions temporarily disabled
      setMessage("Database integration coming soon!");
      setFormData({ name: "", age: 0, email: "" });
    } catch (error) {
      setMessage("Error creating example");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllExamples = async () => {
    setLoading(true);
    try {
      // Database actions temporarily disabled
      setMessage("Database integration coming soon!");
      setExamples([]);
    } catch (error) {
      setMessage("Error getting examples");
    } finally {
      setLoading(false);
    }
  };

  const handleGetExampleById = async (id: string) => {
    setLoading(true);
    try {
      // Database actions temporarily disabled
      setMessage("Database integration coming soon!");
    } catch (error) {
      setMessage("Error getting example by ID");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExample = async (id: string, data: any) => {
    setLoading(true);
    try {
      // Database actions temporarily disabled
      setMessage("Database integration coming soon!");
    } catch (error) {
      setMessage("Error updating example");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExample = async (id: string) => {
    setLoading(true);
    try {
      // Database actions temporarily disabled
      setMessage("Database integration coming soon!");
    } catch (error) {
      setMessage("Error deleting example");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Backend Test Page</h1>
      
      {/* Create Example Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Example</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Age"
            value={formData.age || ""}
            onChange={(e) => handleInputChange("age", e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>
        <Button 
          onClick={handleCreateExample} 
          disabled={loading || !formData.name || !formData.email}
          className="w-full"
        >
          {loading ? "Creating..." : "Create Example"}
        </Button>
      </div>

      {/* Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={handleGetAllExamples} 
            disabled={loading}
            variant="outline"
          >
            {loading ? "Loading..." : "Get All Examples"}
          </Button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}

      {/* Examples List */}
      {examples.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Examples ({examples.length})</h2>
          <div className="space-y-4">
            {examples.map((example) => (
              <div key={example.id} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{example.name}</h3>
                    <p className="text-sm text-gray-600">Age: {example.age}</p>
                    <p className="text-sm text-gray-600">Email: {example.email}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(example.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGetExampleById(example.id)}
                      disabled={loading}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateExample(example.id, { age: example.age + 1 })}
                      disabled={loading}
                    >
                      Age +1
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteExample(example.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Fill out the form above to create a new example</li>
          <li>Click "Get All Examples" to fetch existing examples from the database</li>
          <li>Use the action buttons on each example to test CRUD operations</li>
          <li>Make sure you have set up your DATABASE_URL in .env.local</li>
          <li>Run the database migrations before testing</li>
        </ul>
      </div>
    </div>
  );
}
