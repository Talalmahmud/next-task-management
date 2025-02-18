import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
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
