import NavBarCMP from "@/components/NavBarCMP";
import { Button } from "@/components/ui/button";
import React from "react";

const Homepage = () => {
  return (
    <div className="w-full h-screen bg-black/85">
      <NavBarCMP></NavBarCMP>
      <Button size={"default"} variant={"ghost"}>
        Hello
      </Button>
    </div>
  );
};

export default Homepage;
