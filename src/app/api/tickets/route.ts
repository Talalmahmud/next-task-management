import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

// Get All Tickets
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10); // Default to page 1 if not provided
    const limit = parseInt(url.searchParams.get("limit") || "10", 10); // Default to 10 tickets per page
    const subject = url.searchParams.get("subject") || ""; // Filter by subject
    const description = url.searchParams.get("description") || ""; // Filter by description
    const status = url.searchParams.get("status"); // Filter by status (OPEN, RESOLVED, CLOSED)
    const customerId = url.searchParams.get("customerId"); // Filter by customerId
    const createdAtFrom = url.searchParams.get("createdAtFrom"); // Filter by createdAt from date
    const createdAtTo = url.searchParams.get("createdAtTo"); // Filter by createdAt to date
    const updatedAtFrom = url.searchParams.get("updatedAtFrom"); // Filter by updatedAt from date
    const updatedAtTo = url.searchParams.get("updatedAtTo"); // Filter by updatedAt to date

    // Calculate offset based on page and limit
    const skip = (page - 1) * limit;

    // Build where condition dynamically
    let whereCondition: any = {};
    if (customerId) {
      whereCondition.customerId = session.user.id;
    }

    if (subject) {
      whereCondition.subject = {
        contains: subject, // Partial match
        mode: "insensitive", // Case insensitive search
      };
    }

    if (description) {
      whereCondition.description = {
        contains: description, // Partial match
        mode: "insensitive", // Case insensitive search
      };
    }

    if (status) {
      whereCondition.status = status.toUpperCase(); // Filter by status (make sure to handle case)
    }

    if (customerId) {
      whereCondition.customerId = customerId; // Filter by customerId
    }

    // Filter by createdAt date range if both dates are provided
    if (createdAtFrom || createdAtTo) {
      whereCondition.createdAt = {};
      if (createdAtFrom) {
        whereCondition.createdAt.gte = new Date(createdAtFrom);
      }
      if (createdAtTo) {
        whereCondition.createdAt.lte = new Date(createdAtTo);
      }
    }

    // Filter by updatedAt date range if both dates are provided
    if (updatedAtFrom || updatedAtTo) {
      whereCondition.updatedAt = {};
      if (updatedAtFrom) {
        whereCondition.updatedAt.gte = new Date(updatedAtFrom);
      }
      if (updatedAtTo) {
        whereCondition.updatedAt.lte = new Date(updatedAtTo);
      }
    }

    // Fetch tickets based on the dynamic whereCondition (or all tickets if no filter is provided)
    const tickets = await prisma.ticket.findMany({
      where: whereCondition, // Will return all tickets if no filters are applied
      include: {
        customer: true, // Fetch the associated customer (user) for each ticket
        responses: {
          include: {
            admin: true, // Fetch the associated admin for each response
          },
          orderBy: {
            createdAt: "desc", // Sort responses by creation date in descending order (newest first)
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Sort tickets by creation date in descending order (newest first)
      },
      skip, // Skip the first 'skip' tickets
      take: limit, // Take 'limit' number of tickets
    });

    // Get the total count of tickets for pagination (using the same whereCondition)
    const totalTickets = await prisma.ticket.count({
      where: whereCondition, // Ensure count is done with the same filter
    });

    return NextResponse.json({
      tickets,
      totalTickets,
      totalPages: Math.ceil(totalTickets / limit), // Calculate total pages
      currentPage: page, // Include the current page in the response
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

// Add New Ticket
export async function POST(req: NextRequest) {
  const session = await getSession();

  // Check if the user is authenticated
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { subject, description, status } = body;

    // Use the user ID from the session as the customer ID
    const customerId = session.user.id;

    const newTicket = await prisma.ticket.create({
      data: {
        subject,
        description,
        status,
        customer: {
          connect: { id: customerId },
        },
      },
    });

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}

// Update Ticket
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, subject, description, status } = body;

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        subject,
        description,
        status,
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 }
    );
  }
}

// Delete Ticket
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await prisma.ticket.delete({
      where: { id: id ?? undefined },
    });

    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}
