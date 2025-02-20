"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";

type Props = {};

const Page = (props: Props) => {
  // Use state to store tickets and users
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [subject, setSubject] = useState("");
  const [createdAtFrom, setCreatedAtFrom] = useState("");
  const [createdAtTo, setCreatedAtTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();
    setSubject(search);
  };

  // Fetch tickets with filters
  async function fetchTickets() {
    setIsLoading(true);
    const queryParams = new URLSearchParams({
      status,
      subject,
      createdAtFrom,
      createdAtTo,
    });

    // Replace with actual fetch request
    const fetchedTickets = await fetch(
      `/api/tickets?${queryParams.toString()}`
    );
    const ticketsData = await fetchedTickets.json();

    setTickets(ticketsData?.tickets);
    setIsLoading(false);
  }

  // Fetch users (replace with actual API call)
  async function fetchUsers() {
    // Replace with actual fetch request
    const fetchedUsers = await fetch("/api/users");
    const usersData = await fetchedUsers.json();
    console.log(usersData);
    setUsers(usersData);
  }

  const statusUpdate = async (id: any, status: string) => {
    await fetch(`/api/ticket-status`, {
      method: "PUT",
      body: JSON.stringify({ id, status }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Optionally, re-fetch the tickets to update UI after the reply
    await fetchTickets();
  };

  const deleteTicket = async (id: any) => {
    const res = await fetch("/api/tickets/?id=" + id, {
      method: "DELETE",
    });
    await fetchTickets();
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, [status, subject, createdAtFrom, createdAtTo]);

  const handleReplySubmit = async (e: React.FormEvent, ticketId: number) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const message = form.get("reply") as string;

    // Make API request to submit the reply (replace with actual API call)
    await fetch(`/api/tickets/reply`, {
      method: "POST",
      body: JSON.stringify({ ticketId, message }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Optionally, re-fetch the tickets to update UI after the reply
    await fetchTickets();
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Navbar />
      <div className=" flex gap-4">
        <div className="bg-gray-100 p-4 min-w-[300px] rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Filter Tickets</h2>

          {/* Search Bar */}
          <input
            type="text"
            value={subject}
            onChange={handleSearch}
            placeholder="Search tickets by subject or customer email..."
            className="w-full p-2 border rounded-lg mb-4"
          />

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4"
          >
            <option value="">Filter by Status</option>
            <option value="OPEN">Open</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Date Range Filters */}

          <div className="w-full">
            <label className="text-sm text-gray-500">From</label>

            <input
              type="date"
              value={createdAtFrom}
              onChange={(e) => setCreatedAtFrom(e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
            />
          </div>
          <div className="w-full">
            <label className="text-sm text-gray-500">To</label>

            <input
              type="date"
              value={createdAtTo}
              onChange={(e) => setCreatedAtTo(e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
            />
          </div>

          {/* Apply Filters Button */}
          <button
            onClick={() => fetchTickets()}
            className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Apply Filters
          </button>
        </div>

        {/* Ticket Section */}
        {tickets.length === 0 ? (
          <p>No tickets available.</p>
        ) : (
          <div className="space-y-4 w-full">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              tickets.map((ticket: any) => (
                <div
                  key={ticket.id}
                  className="border p-4 rounded-lg shadow-md bg-white"
                >
                  <div className="flex justify-between">
                    <h2 className="text-xl font-semibold">{ticket?.subject}</h2>
                    <button
                      onClick={() => deleteTicket(ticket?.id)}
                      className="text-white bg-red-500 rounded-md px-2 py-1"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-600">{ticket.description}</p>
                  <p className="text-sm text-gray-500">
                    Status: {ticket.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Customer: {ticket.customer.email}
                  </p>

                  <h3 className="font-semibold mt-3">Responses:</h3>
                  <ul className="text-sm py-2">
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
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value);
                      statusUpdate(ticket.id, e.target.value);
                    }}
                    name="status"
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Change Status (Optional)</option>
                    <option value="OPEN">Open</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <form
                    className="mt-4 space-y-2"
                    onSubmit={(e) => handleReplySubmit(e, ticket.id)}
                  >
                    <input type="hidden" name="ticketId" value={ticket.id} />
                    <textarea
                      name="reply"
                      placeholder="Write a reply..."
                      className="w-full p-2 border rounded-lg"
                      required
                    ></textarea>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                      Submit Reply
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Filters Section */}

      {/* User Section */}
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

export default Page;
