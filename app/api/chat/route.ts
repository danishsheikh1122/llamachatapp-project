import prisma from "@/prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// if didnt work use above
export async function POST() {
  // Check if the user is authenticated
  const { userId } = auth();
  const user = await currentUser(); // Await the currentUser call to get the user data

  if (!userId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }

  // Check if the user exists in the database
  let isUser = await prisma.user.findFirst({
    where: { userId },
  });

  // Create a new user if it does not exist
  // console.log(user?.emailAddresses[0].emailAddress)
  if (!isUser) {
    isUser = await prisma.user.create({
      data: {
        userId,
        email: user?.emailAddresses[0].emailAddress || "", // Provide a default value if email is not present
        name: user?.firstName || "", // Provide a default value if name is not present
      },
    });

    if (!isUser) {
      return NextResponse.json(
        { message: "User not created" },
        { status: 400 }
      );
    }
  }

  // Create a new chat associated with the user
  const createChat = await prisma.chat.create({
    data: {
      userId,
    },
  });

  if (!createChat) {
    return NextResponse.json({ message: "Chat not created" }, { status: 400 });
  }

  return NextResponse.json({ createChat }, { status: 200 });
}

// export async function GET(req: NextRequest) {
//   // Fetch the current authenticated user
//   const user = await currentUser();

//   if (!user) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     // Fetch the most recent 10 chats associated with the current user's ID and include their messages
//     const recentChats = await prisma.chat.findMany({
//       where: {
//         userId: user.id,
//       },
//       orderBy: {
//         createdAt: 'desc', // Order by creation date descending
//       },
//       take: 10, // Limit to the most recent 10 chats
//       include: {
//         messages: { // Include messages for each chat
//           orderBy: {
//             createdAt: 'asc', // Order messages by creation date ascending
//           },
//         },
//       },
//     });
//     console.log(recentChats)

//     return NextResponse.json({ recentChats }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching chats and messages:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function GET(req: Request) {
//   const user = await currentUser();
//   if (!user) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   const url = new URL(req.url);
//   const limit = parseInt(url.searchParams.get("limit") || "20");

//   try {
//     const recentChats = await prisma.chat.findMany({
//       where: { userId: user.id },
//       include: {
//         messages: {
//           orderBy: { createdAt: "desc" },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     const allMessages = recentChats.flatMap((chat) =>
//       chat.messages.map((message) => ({
//         id: message.messageId,
//         text: message.message,
//         chatId: chat.chatId,
//         createdAt: message.createdAt,
//       }))
//     );

//     const recentMessages = allMessages
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//       .slice(0, limit);

//     return NextResponse.json({ recentMessages }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching chats:", error);
//     return NextResponse.json(
//       { message: "Error fetching chats" },
//       { status: 500 }
//     );
//   }
// }

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const offset = parseInt(url.searchParams.get("offset") || "0");

  // const user = await currentUser();
  // if (!user) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  try {
    // Fetch recent chats with pagination
    const recentChats = await prisma.chat.findMany({
      where: { userId: 'user_2mcbyltT9lF1Ujx3n0ArO0HG4SW' },
      include: {
        messages: {
          orderBy: { createdAt: "desc" }, // Fetch messages in ascending order to get the first message easily
        },
      },
      orderBy: { createdAt: "asc" },
      skip: offset, // Apply pagination for chats
      take: limit,
    });

    // Extract chatId and the first message text from each chat
    const chatData = recentChats.map((chat) => ({
      chatId: chat.chatId,
      firstMessage: chat.messages.length > 0 ? chat.messages[0].message : null,
    }));

    return NextResponse.json({ chats: chatData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { message: "Error fetching chats" },
      { status: 500 }
    );
  }
}
