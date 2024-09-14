"use client";
import { useGetCalls } from "@/hooks/use-get-calls";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

const UpcomingMeetingBadge = () => {
  const { upcomingCalls, isLoading } = useGetCalls();
  const [closestMeeting, setClosestMeeting] = useState<string | undefined>(
    undefined
  );
  const now = new Date();

  useEffect(() => {
    if (isLoading || !upcomingCalls) return;
    if (upcomingCalls.length === 0) {
      setClosestMeeting("No upcoming meetings");
      return;
    }
    const closestDate = upcomingCalls.reduce((closest: any, meeting: any) => {
      const meetingDate = new Date(meeting.state?.startsAt);

      if (meetingDate > now) {
        if (!closest || meetingDate < new Date(closest.state?.startsAt)) {
          return meeting;
        }
      }

      return closest;
    }, null);

    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(closestDate.state?.startsAt);
    setClosestMeeting(`Upcoming meeting at ${formattedDate}`);
  }, [isLoading]);

  return (
    <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-xs font-normal">
      {isLoading ? <Loader height={20} width={20} /> : <>{closestMeeting}</>}
    </h2>
  );
};

export default UpcomingMeetingBadge;
