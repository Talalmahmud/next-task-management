import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
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
  });
  return NextResponse.json({ tickets: tickets }, { status: 200 });
}
