import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  //check if user is auth or not

  // then
  const createChat = await prisma.chat.create({
    data: {
      userId,
    },
  });
  
  if(!createChat)
  {
    return NextResponse.json({ message: "Chat not created" }, { status: 400 });
  }

  return NextResponse.json({createChat}, { status: 200 });
}
//after every prompt or response just make an api call to create chat 

