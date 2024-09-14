import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: React.ReactNode;
  handleClick: () => void;
  buttonText?: string;
  buttonIcon?: string;
}

const DeleteModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  buttonIcon,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogTrigger>Open</DialogTrigger> */}
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="text-neutral-300">
            This action cannot be undone. This will permanently delete the
            meeting from our servers.
          </DialogDescription>
          {children}
          <Button
            className="bg-warning focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image src={buttonIcon} width={13} height={13} alt="" />
            )}{" "}
            &nbsp; Delete Meeting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
