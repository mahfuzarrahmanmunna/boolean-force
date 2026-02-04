"use client";

import { useEffect, useState } from "react";

export default function ManageSubmitTaskPage() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetch("/api/tasks/submissions")
      .then((res) => res.json())
      .then((data) => setSubmissions(data || []));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Manage Submitted Tasks
      </h1>

      {submissions.length === 0 ? (
        <p className="text-gray-500">
          No submissions yet
        </p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Task</th>
              <th className="p-2 border">Worker</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((item) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.taskTitle}</td>
                <td className="p-2 border">{item.workerName}</td>
                <td className="p-2 border">{item.status}</td>
                <td className="p-2 border space-x-2">
                  <button className="px-2 py-1 bg-green-600 text-white rounded">
                    Approve
                  </button>
                  <button className="px-2 py-1 bg-red-600 text-white rounded">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
