import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const { message, sender } = await req.json();

  // check if user is authenticated

  // then
  if (!message || !sender)
    return NextResponse.json({
      status: 400,
      message: "Invalid message or sender",
    });
  if (!params.chatId)
    return NextResponse.json({
      status: 400,
      message: "missing chat id",
    });

  const isChatIdExist = await prisma.chat.findFirst({
    where: { chatId: params.chatId },
  });

  if (!isChatIdExist)
    return NextResponse.json({
      status: 404,
      message: "chat not found,invalid chat id",
    });

  const createMessage = await prisma.message.create({
    data: {
      chatId: params.chatId,
      sender, //this should be AI or USER
      message,
    },
  });

  if (!createMessage)
    return NextResponse.json({ status: 400, message: "Message not created" });

  return NextResponse.json({ status: 200, createMessage: createMessage });

  // save message to database with userId
}

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  // check if user is authenticated
  if (!params.chatId)
    return NextResponse.json({ status: 400, message: "Invalid chatId" });

  // check if user is authenticated

  // then

  const isChatIdExist = await prisma.chat.findFirst({
    where: { chatId: params.chatId },
  });

  if (!isChatIdExist)
    return NextResponse.json({
      status: 404,
      message: "chat not found,invalid chat id",
    });

  const messages = await prisma.message.findMany({
    where: { chatId: params.chatId },
    orderBy: { updatedAt: "asc" },
  });

  if (!messages)
    return NextResponse.json({ status: 404, message: "Message not found" });

  return NextResponse.json({
    status: 200,
    createMessage: messages,
  });
}

export async function PATCH(req: NextRequest) {
  const { message, messageId } = await req.json();

  // check if user is authenticated

  // then

  if (!messageId || !message)
    return NextResponse.json({
      status: 400,
      message: "Invalid messageId or message is not present",
    });

    const isMessageIdExist = await prisma.message.findFirst({
    where: { messageId },
  });
  if (!isMessageIdExist)
    return NextResponse.json({
      status: 404,
      message: "Invalid messageId,Message with this id is not found",
    });


  //to update a messaage we need to find message id so the key of message in front end will be message id
  const updateChat = await prisma.message.update({
    where: { messageId }, // `id` is a unique identifier for each message
    data: {
      message, // The new message content
    },
  });
  
  if (!updateChat)
    return NextResponse.json({ status: 404, message: "Chat not found" });
  
  const deleteMessages = await prisma.message.deleteMany({
    where: {
      messageId: {
        gt: isMessageIdExist.messageId, // Delete messages with a messageId greater than the specified one
      },
      // gt --> greater than the specified messageId 
      //pass messageId in jason without quotes
    },
  });
  
  if (!deleteMessages)
    return NextResponse.json({ status: 404, message: "Messages could't deleted" });
  
  

  return NextResponse.json({ status: 200, updateChat: updateChat });

  // update chat status to closed with userId
}

// PATCH REQ CALL EXAMPLE


// {
//   "message":"danish sheikh ans sayema qureshi loves each other",
//   "messageId":10
// }
// {
//   "status": 200,
//   "updateChat": {
//       "messageId": 10,
//       "chatId": "58c46358-f683-498b-b0c1-d73faaf70275",
//       "sender": "USER",
//       "message": "danish sheikh loves sayema qureshi ",
//       "createdAt": "2024-09-19T19:31:59.097Z",
//       "updatedAt": "2024-09-19T19:33:34.274Z"
//   }
// }