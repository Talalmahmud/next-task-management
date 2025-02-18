import React from "react";

type Props = {};

const page = (props: Props) => {
  const tickets: any = [];
  return (
    <div className="max-w-4xl mx-auto py-8">
      <form className="bg-gray-100 p-4 rounded-lg mb-6 shadow">
        <h2 className="text-xl font-semibold mb-2">Create a New Ticket</h2>
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="w-full p-2 border rounded-lg mb-2"
          required
        />
        <textarea
          name="description"
          placeholder="Describe your issue..."
          className="w-full p-2 border rounded-lg mb-2"
          required
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Submit Ticket
        </button>
      </form>

      {tickets.length === 0 ? (
        <p>No tickets created yet.</p>
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

              <h3 className="font-semibold mt-3">Replies:</h3>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
