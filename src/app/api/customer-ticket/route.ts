import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10); // Default to page 1 if not provided
  const limit = parseInt(url.searchParams.get("limit") || "10", 10); // Default to 10 tickets per page
  const skip = (page - 1) * limit;
  const tickets = await prisma.ticket.findMany({
    where: { customerId: session.user.id },
    include: {
      customer: true, // Include the user who created the ticket
      responses: {
        // Include all responses related to the ticket
        include: {
          admin: true, // Include the admin who replied
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Sort tickets by creation date in descending order (newest first)
    },
    skip,
    take: limit,
  });
  return NextResponse.json({ tickets: tickets }, { status: 200 });
}
