import React from "react";

type Props = {};

const page = (props: Props) => {
  const tickets: any = [];
  const users: any = [];
  return (
    <div className="max-w-4xl mx-auto py-8">
      {tickets.length === 0 ? (
        <p>No tickets available.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket: any) => (
            <div
              key={ticket.id}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold">{ticket.subject}</h2>
              <p className="text-gray-600">{ticket.description}</p>
              <p className="text-sm text-gray-500">Status: {ticket.status}</p>
              <p className="text-sm text-gray-500">
                Customer: {ticket.customer.email}
              </p>

              <h3 className="font-semibold mt-3">Responses:</h3>
              <ul className="text-sm">
                {ticket.responses.length === 0 ? (
                  <li className="text-gray-500">No replies yet.</li>
                ) : (
                  ticket.responses.map((resp: any, index: number) => (
                    <li key={index} className="border-l-4 pl-2 mt-1">
                      {resp.message} -{" "}
                      <span className="text-gray-500">
                        {resp.admin ? resp.admin.name : "System"}
                      </span>
                    </li>
                  ))
                )}
              </ul>

              {/* Reply Form */}
              <form className="mt-4 space-y-2">
                <input type="hidden" name="ticketId" value={ticket.id} />
                <textarea
                  name="reply"
                  placeholder="Write a reply..."
                  className="w-full p-2 border rounded-lg"
                  required
                ></textarea>
                <select name="status" className="w-full p-2 border rounded-lg">
                  <option value="">Change Status (Optional)</option>
                  <option value="OPEN">Open</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  Submit Reply
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-3">All Users</h2>
        <ul className="space-y-2">
          {users.map((user: any) => (
            <li key={user.id} className="border-b pb-2">
              <span className="font-semibold">{user.name}</span> - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default page;
