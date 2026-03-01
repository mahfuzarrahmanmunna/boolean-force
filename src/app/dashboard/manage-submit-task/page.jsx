"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

export default function ManageSubmitTaskPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useFormState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch session/user info
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        const currentUser = data.user;
        setUser(currentUser);

        // Check if user is admin or team leader
        if (
          !currentUser ||
          (currentUser.role !== "admin" && currentUser.isTeamLeader !== "true")
        ) {
          router.push("/unauthorized");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!loading && user && (user.role === "admin" || user.isTeamLeader === "true")) {
      fetch("/api/tasks/submissions")
        .then((res) => res.json())
        .then((data) => setSubmissions(data || []));
    }
  }, [loading, user]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Manage Submitted Tasks</h1>

      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions yet</p>
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
