// @ts-nocheck
"use client";
import { useGetCalls } from "@/hooks/use-get-calls";
import {
  Call,
  CallRecording,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import pLimit from "p-limit";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { useToast } from "./ui/use-toast";
import { deleteCall } from "@/actions/stream.actions";

const limit = pLimit(3);

const CallList = ({ type }: { type: "ended" | "upcoming" | "recordings" }) => {
  const { endedCalls, callRecordings, upcomingCalls, isLoading, refetch } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[] | undefined>(
    undefined
  );
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const client = useStreamVideoClient();
  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "upcoming":
        return upcomingCalls;
      case "recordings":
        return callRecordings;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No previous Calls";
      case "upcoming":
        return "No upcoming Calls";
      case "recordings":
        return "No Recordings";
      default:
        return "";
    }
  };

  const handleDeleteCall = async (callId: string) => {
    try {
      await deleteCall(callId);
      setDeleteSuccess(true);
    } catch (error) {
      toast({ title: "Try again later" });
    }
  };

  useEffect(() => {
    console.log(`type: ${type} isLoading: ${isLoading}`);
  }, [isLoading]);

  useEffect(() => {
    if (!deleteSuccess) return;
    refetch();
    setDeleteSuccess(false);
  }, [deleteSuccess, refetch]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings?.map(
            (meeting) => limit(() => meeting.queryRecordings()) // Wrap the request in a limiter
          )
        );
        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);
        console.log({ recordings });
        setRecordings(recordings || []);
      } catch (error) {
        fetchRecordings();
        console.error(error);
        // toast({ title: "Try again later" });
      }
    };

    if (type === "recordings" && callRecordings) fetchRecordings();
  }, [type, callRecordings]);
  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();
  if (
    (type !== "recordings" && isLoading) ||
    (type === "recordings" && recordings === undefined)
  ) {
    return <Loader />;
  }
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {(type !== "recordings" && calls?.length > 0) ||
      recordings?.length > 0 ? (
        (type === "recordings" ? recordings : calls).map(
          (meeting: Call | CallRecording) => (
            <MeetingCard
              key={(meeting as Call).id || (meeting as CallRecording).filename}
              icon={
                type === "ended"
                  ? "/icons/previous.svg"
                  : type === "upcoming"
                  ? "/icons/upcoming.svg"
                  : "/icons/recordings.svg"
              }
              title={
                (meeting as Call).state?.custom?.description?.substring(
                  0,
                  26
                ) ||
                meeting?.filename?.substring(0, 20) ||
                "Personal Meeting"
              }
              date={
                meeting.state?.startsAt.toLocaleString() ||
                meeting.start_time.toLocaleString()
              }
              isPreviousMeeting={type === "ended"}
              buttonIcon1={
                type === "recordings" ? "/icons/play.svg" : undefined
              }
              buttonText={type === "recordings" ? "Play" : "Start"}
              handleClick={() =>
                router.push(
                  type === "recordings"
                    ? `${meeting.url}`
                    : `/meeting/${meeting.id}`
                )
              }
              handleDeleteClick={async () => {
                await handleDeleteCall(meeting.id);
              }}
              link={
                type === "recordings"
                  ? (meeting as CallRecording).url
                  : `process.env.NEXT_PUBLIC_BASE_URL/meeting/${meeting.id}`
              }
            />
          )
        )
      ) : (
        <h1>{recordings?.length && noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
