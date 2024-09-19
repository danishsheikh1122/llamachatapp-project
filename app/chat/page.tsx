"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React from "react";
// import { Button } from "@/components/ui/button";
// import axios from "axios";

const Chatspage = () => {
  const createChat = async () => {
    //api route to create a chat with new id
    const response = await axios.post("http://localhost:3000/api/chat", {
      userId: "user_2kt1mnR3HwXtlcP2cKzktTm8Ome",
      // clerk user id comes here useUser hook from clerk 
    });

    if (response.status === 200) {
      const chatId = response.data?.createChat?.chatId;
      window.history.pushState(null, "", `/chat/${chatId}`);
      console.log(chatId);
    } else {
      console.log("Unexpected some error on the server:", response.status);
    }
  };
  return (
    <div>
      <Button
        size={"default"}
        variant={"outline"}
        className="bg-green-300"
        onClick={createChat}
      >
        Create a chat
      </Button>
    </div>
  );
};

export default Chatspage;
