import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllChats,
  fetchChatMessages,
  createNewChat,
  sendMessageToChat,
  deleteAChatSession,
} from "./queries/chatQueries";

// ===== QUERIES (Read Operations) =====

/**
 * Hook to fetch all chats
 * @returns {Object} { data: chats[], isLoading, error, refetch }
 */
export const useChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: fetchAllChats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch messages for a specific chat
 * @param {string} sessionId - The chat session ID
 * @returns {Object} { data: messages[], isLoading, error }
 */
export const useChatMessages = (sessionId) => {
  return useQuery({
    queryKey: ["chat", sessionId, "messages"],
    queryFn: () => fetchChatMessages(sessionId),
    enabled: !!sessionId, // Only run query if sessionId exists
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// ===== MUTATIONS (Create/Update/Delete Operations) =====

/**
 * Hook to create a new chat
 * @returns {Object} { mutate, isPending, error }
 */
export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewChat,
    onSuccess: (data) => {
      // Invalidate the chats list so it refetches
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      return data;
    },
    onError: (error) => {
      console.error("Failed to create chat:", error);
    },
  });
};

/**
 * Hook to send a message to a chat
 * @returns {Object} { mutate, isPending, error }
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessageToChat,
    onSuccess: (data, variables) => {
      // Invalidate the messages for this chat so it refetches
      queryClient.invalidateQueries({
        queryKey: ["chat", variables.sessionId, "messages"],
      });
      // Invalidate the chats list to update the title in sidebar
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });
      return data;
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
    },
  });
};

/**
 * Hook to delete a chat
 * @returns {Object} { mutate, isPending }
 */
export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAChatSession,
    onSuccess: (_, sessionId) => {
      // Update cache to remove deleted chat
      queryClient.setQueryData(["chats"], (oldChats) =>
        oldChats.filter((chat) => chat._id !== sessionId)
      );
    },
    onError: (error) => {
      console.error("Failed to delete chat:", error.message);
      // Refetch on error to restore correct state
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
