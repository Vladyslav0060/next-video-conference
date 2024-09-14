import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Metadata } from "next";
import React, { ReactNode } from "react";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  const metadata: Metadata = {
    title: "Zoom Clone",
    description: "Generated by create next app",
    icons: {
      icon: "/icons/logo.svg",
    },
  };
  return (
    <main className="relative">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
          <div className="size-full">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default HomeLayout;
