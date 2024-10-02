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
import { Button } from "@/components/ui/button";
import axios from "axios";

// Fetch chats with pagination
const fetchChats = async (limit: number) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/chat`, {
      params: { limit },
    });
    return {
      chats: response.data.chats || [],
      hasMore: response.data.chats.length === limit, // Check if there are more chats
    };
  } catch (error) {
    console.error("Error fetching chats:", error);
    return { chats: [], hasMore: false };
  }
};

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]); // Store chat IDs and first messages
  const [limit, setLimit] = useState(10); // Default fetch limit
  const [hasMore, setHasMore] = useState(true); // Track if there are more chats to load
  const { user } = useUser();

  useEffect(() => {
    const loadChats = async () => {
      const { chats: fetchedChats, hasMore: moreChats } = await fetchChats(
        limit
      );
      setChats(fetchedChats);
      setHasMore(moreChats); // Update the state for more chats
    };

    if (user?.id) {
      loadChats();
    }
  }, [limit, user?.id]);

  const createChat = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/chat", {});
      if (response.status === 200) {
        const chatId = response.data.createChat.chatId;
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
      setLimit((prevLimit) => prevLimit + 10); // Increase limit by 10
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
          <div
            className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
            onScroll={handleScroll}
          >
            {open ? <FullLogo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
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

              {/* Display Recent Chats with first message */}
              {chats.map((chat: { chatId: string; firstMessage: string }) => (
                <SidebarLink
                  key={chat.chatId}
                  link={{
                    label: chat.firstMessage
                      ? chat.firstMessage.split(" ").slice(0, 5).join(" ")
                      : "No Title", // Display first message or 'No Title' if empty
                    href: `/chat/${chat.chatId}/c`,
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
