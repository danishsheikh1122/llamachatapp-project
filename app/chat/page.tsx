"use client";
// import { Button } from "@/components/ui/button";
// import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
// import axios from "axios";
// import React from "react";
// // import { Button } from "@/components/ui/button";
// // import axios from "axios";

// const Chatspage = () => {
//   const createChat = async () => {
//     //api route to create a chat with new id
//     const response = await axios.post("http://localhost:3000/api/chat", {
//       userId: "user_2kt1mnR3HwXtlcP2cKzktTm8Ome",
//       // clerk user id comes here useUser hook from clerk
//     });

//     if (response.status === 200) {
//       const chatId = response.data?.createChat?.chatId;
//       window.history.pushState(null, "", `/chat/${chatId}`);
//       console.log(chatId);
//     } else {
//       console.log("Unexpected some error on the server:", response.status);
//     }
//   };
//   return (
//     <div>
//       {/* <Sidebar> */}
//       <Button
//         size={"default"}
//         variant={"outline"}
//         className="bg-green-300"
//         onClick={createChat}
//       >
//         Create a chat
//       </Button>
//       {/* </Sidebar> */}

//     </div>
//   );
// };

// export default Chatspage;

// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { IconMessages, IconPlus } from "@tabler/icons-react";
// import Image from "next/image";
// import Link from "next/link";
// import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
// import { motion } from "framer-motion";
// import { cn } from "@/lib/utils";
// import Logo from "@/components/images/llama50.png";
// import { SignInButton, SignUpButton, useUser, UserButton } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button"; // Import Button from ShadCN
// import axios from "axios";

// // Fetching data for recent chats dynamically based on the user ID
// const fetchChats = async (offset = 0, limit = 10) => {
//   try {
//     const response = await axios.get(`http://localhost:3000/api/chat`, {
//       params: { offset, limit },
//     });
//     // Accessing the recentMessages array from the response data
//     return response.data.recentMessages || [];
//   } catch (error) {
//     console.error("Error fetching chats:", error);
//     return [];
//   }
// };

// export default function SidebarDemo() {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([]); // State to hold messages
//   const [loading, setLoading] = useState(false); // Loading state for fetch
//   const { user } = useUser(); // Get the current user
//   const [offset, setOffset] = useState(0); // Offset for pagination
//   const [currentCount, setCurrentCount] = useState(0); // Count of messages fetched

//   useEffect(() => {
//     const loadChats = async () => {
//       if (loading) return; // Prevent multiple fetches
//       setLoading(true);
//       const fetchedMessages = await fetchChats(offset);
//       setMessages((prev) => [...prev, ...fetchedMessages]); // Update messages state
//       setCurrentCount((prev) => prev + fetchedMessages.length); // Update count of fetched messages
//       setLoading(false);
//       setOffset((prev) => prev + 10); // Increment offset by the limit (10)
//     };

//     loadChats();
//   }, [user?.id, offset]); // Load chats when user changes or offset updates

//   const createChat = async () => {
//     try {
//       const response = await axios.post("http://localhost:3000/api/chat", {});
//       if (response.status === 200) {
//         const chatId = response.data.createChat.id; // Adjust according to your response structure
//         window.history.pushState(null, "", `/chat/${chatId}`);
//       } else {
//         console.error("Failed to create chat:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error creating chat:", error);
//     }
//   };

//   // Handle scroll event to fetch more chats
//   const handleScroll = useCallback((e) => {
//     const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
//     if (bottom && currentCount === offset) {
//       // Load more messages when scrolled to the bottom and currentCount matches offset
//       setOffset((prev) => prev + 10); // Increment offset for next fetch
//     }
//   }, [currentCount, offset]);

//   return (
//     <div
//       className={cn(
//         "h-screen rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden"
//       )}
//     >
//       <Sidebar open={open} setOpen={setOpen} onScroll={handleScroll}>
//         <SidebarBody className="justify-between gap-10" onScroll={handleScroll}>
//           <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden" onScroll={handleScroll}>
//             {/* Logo */}
//             {open ? <FullLogo /> : <LogoIcon />}
//             <div className="mt-8 flex flex-col gap-2">
//               {/* New Chat Icon */}
//               <SidebarLink
//                 link={{
//                   label: "New Chat",
//                   href: "#",
//                   icon: (
//                     <IconPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//                   ),
//                 }}
//               />
//               <Button
//                 size={"default"}
//                 variant={"outline"}
//                 className="bg-green-300"
//                 onClick={createChat}
//               >
//                 Create a chat
//               </Button>

//               {/* Recent Messages */}
//               {messages.map((message) => (
//                 <SidebarLink
//                   key={message.id}
//                   link={{
//                     label:
//                       message.text.split(" ").slice(0, 5).join(" ") ||
//                       "No Title",
//                     href: `/chat/${message.chatId}`, // Use the chat ID for the link
//                     icon: (
//                       <IconMessages className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
//                     ),
//                   }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Bottom Section - User Profile and Logout */}
//           <div className="flex flex-col items-start gap-3 mb-5 group">
//             {user ? (
//               <div className="flex items-center justify-center gap-2 font-mono">
//                 <UserButton />
//                 <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
//                   {user.username}
//                 </span>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <SignInButton mode="modal">
//                   <Button variant="outline" size="sm" className="font-mono">
//                     Login
//                   </Button>
//                 </SignInButton>
//                 <SignUpButton mode="modal">
//                   <Button size="sm" className="group font-mono">
//                     <span className="flex items-center gap-2">Get started</span>
//                   </Button>
//                 </SignUpButton>
//               </div>
//             )}
//           </div>
//         </SidebarBody>
//       </Sidebar>
//     </div>
//   );
// }

// export const FullLogo = () => (
//   <Link
//     href="#"
//     className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
//   >
//     <Image src={Logo} width={40} height={40} alt="Llama Logo" />
//     <motion.span
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="font-medium text-black dark:text-white whitespace-pre bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
//     >
//       FUTURiSTic Llama
//     </motion.span>
//   </Link>
// );

// export const LogoIcon = () => (
//   <Link href="#" className="font-normal flex items-center py-1 relative z-20">
//     <Image src={Logo} width={40} height={40} alt="Llama Icon" />
//   </Link>
// );


"use client";
import React, { useState, useEffect } from "react";
import { IconMessages, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "@/components/images/llama50.png";
import { SignInButton, SignUpButton, useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"; // Import Button from ShadCN
import axios from "axios";

const fetchChats = async (limit: number) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/chat`, {
      params: { limit },
    });
    return {
      messages: response.data.recentMessages || [],
      hasMore: response.data.hasMore || false, // Check if there are more messages
    };
  } catch (error) {
    console.error("Error fetching chats:", error);
    return { messages: [], hasMore: false }; // Default return
  }
};

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); 
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true); // New state to track if there are more messages
  const { user } = useUser(); 

  useEffect(() => {
    const loadChats = async () => {
      const { messages: fetchedMessages, hasMore: moreMessages } = await fetchChats(limit);
      setMessages(fetchedMessages);
      setHasMore(moreMessages); // Update the state for more messages
    };
    loadChats();
  }, [limit, user?.id]);

  const createChat = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/chat", {});
      if (response.status === 200) {
        const chatId = response.data.createChat.id; // Adjust based on your response structure
        window.history.pushState(null, "", `/chat/${chatId}`);
      } else {
        console.error("Failed to create chat:", response.data.message);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore) {
      setLimit((prevLimit) => prevLimit + 10); // Increment limit
    }
  };

  return (
    <div
      className={cn(
        "h-screen rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden" onScroll={handleScroll}>
            {/* Logo */}
            {open ? <FullLogo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {/* New Chat Icon */}
              <SidebarLink
                link={{
                  label: "New Chat",
                  href: "#",
                  icon: (
                    <IconPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  ),
                }}
              />
              <Button
                size={"default"}
                variant={"outline"}
                className="bg-green-300"
                onClick={createChat}
              >
                Create a chat
              </Button>

              {/* Recent Messages */}
              {messages.map((message) => (
                <SidebarLink
                  key={message.id}
                  link={{
                    label:
                      message.text.split(" ").slice(0, 5).join(" ") ||
                      "No Title",
                    href: `/chat/${message.chatId}/c`, // Use the chat ID for the link
                    icon: (
                      <IconMessages className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    ),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Section - User Profile and Logout */}
          <div className="flex flex-col items-start gap-3 mb-5 group">
            {user ? (
              <div className="flex items-center justify-center gap-2 font-mono">
                <UserButton />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  {user.username}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm" className="font-mono">
                    Login
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="group font-mono">
                    <span className="flex items-center gap-2">Get started</span>
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

export const FullLogo = () => (
  <Link
    href="#"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <Image src={Logo} width={40} height={40} alt="Llama Logo" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-black dark:text-white whitespace-pre bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
    >
      FUTURiSTic Llama
    </motion.span>
  </Link>
);

export const LogoIcon = () => (
  <Link href="#" className="font-normal flex items-center py-1 relative z-20">
    <Image src={Logo} width={40} height={40} alt="Llama Icon" />
  </Link>
);
