import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export const useGetCalls = () => {
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [calls, setCalls] = useState<Call[]>();
  const [isLoading, setIsLoading] = useState(false);

  const loadCalls = useCallback(async () => {
    if (!client || !user?.id) return;

    setIsLoading(true);

    try {
      // Fetch calls using client.queryCalls
      const { calls } = await client.queryCalls({
        sort: [{ field: "starts_at", direction: -1 }],
        filter_conditions: {
          starts_at: { $exists: true },
          $or: [
            { created_by_user_id: user.id },
            { members: { $in: [user.id] } },
          ],
        },
      });
      console.log({ calls });
      setCalls(calls);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [client, user?.id]);

  // Load calls on initial render and when dependencies change
  useEffect(() => {
    loadCalls();
  }, [loadCalls]);

  const refetch = () => {
    loadCalls(); // Call the same function to refetch the data
  };

  const now = new Date();

  const endedCalls = calls?.filter(({ state: { startsAt, endedAt } }: Call) => {
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });

  const upcomingCalls = calls?.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > now;
  });

  return {
    endedCalls,
    upcomingCalls,
    callRecordings: calls,
    isLoading,
    refetch,
  };
};
