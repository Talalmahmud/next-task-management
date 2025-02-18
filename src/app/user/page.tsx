"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

type Ticket = {
  id: number;
  subject: string;
  description: string;
  status: string;
  responses: {
    message: string;
    admin?: {
      name: string;
    };
  }[];
};

const Page = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  async function fetchTickets() {
    // Replace with actual fetch request
    const fetchedTickets = await fetch("/api/customer-ticket");
    const ticketsData = await fetchedTickets.json();
    setTickets(ticketsData?.tickets);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!subject || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const newTicket = {
      subject,
      description,
      userId: "123", // Assuming the user ID is retrieved from session or authentication
    };

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
      });

      if (!res.ok) {
        throw new Error("Failed to create ticket");
      }

      const createdTicket = await res.json();
      setTickets([createdTicket, ...tickets]); // Add the new ticket to the list
      setSubject("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("There was an error submitting the ticket.");
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Navbar />

      {/* Ticket Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-4 rounded-lg mb-6 shadow"
      >
        <h2 className="text-xl font-semibold mb-2">Create a New Ticket</h2>
        <input
          type="text"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full p-2 border rounded-lg mb-2"
          required
        />
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

      {/* Ticket List */}
      {tickets.length === 0 ? (
        <p>No tickets created yet.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
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
                  ticket.responses.map((resp, index: number) => (
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

export default Page;
