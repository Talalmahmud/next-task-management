import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/server";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const adminId = session.user.id;
    // Get the data from the request body
    const { ticketId, message } = await req.json();
    console.log(ticketId, message);

    // Validate the data
    if (!ticketId || !message) {
      return NextResponse.json(
        { error: "Ticket ID, Admin ID, and message are required" },
        { status: 400 }
      );
    }

    // Create a new response in the TicketResponse table
    const newResponse = await prisma.ticketResponse.create({
      data: {
        message,
        ticketId,
        adminId,
      },
    });

    return NextResponse.json(newResponse, { status: 201 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 });
  }
}
