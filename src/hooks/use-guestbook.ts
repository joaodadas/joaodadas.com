import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchPosts,
  signGuestbook,
  type GuestbookPost,
  type GuestbookPostsResponse,
} from "~/lib/api/guestbook";

const QUERY_KEY = ["guestbook", "posts"];

type GuestbookPages = InfiniteData<GuestbookPostsResponse>;

export function useGuestbookPosts(initialData?: GuestbookPostsResponse) {
  return useInfiniteQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam as number),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    ...(initialData
      ? {
          initialData: { pages: [initialData], pageParams: [0] },
        }
      : {}),
  });
}

export interface SignGuestbookInput {
  message: string;
  signature: string | null;
  author: { username: string; name: string | null };
}

export function useSignGuestbook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ author: _author, ...input }: SignGuestbookInput) =>
      signGuestbook(input),

    onMutate: async (variables: SignGuestbookInput) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousPosts =
        queryClient.getQueryData<GuestbookPages>(QUERY_KEY);

      queryClient.setQueryData<GuestbookPages>(QUERY_KEY, (old) => {
        if (!old) return old;

        const optimisticPost: GuestbookPost = {
          id: `temp-${Date.now()}`,
          message: variables.message,
          signature: variables.signature,
          createdAt: new Date().toISOString(),
          username: variables.author.username,
          name: variables.author.name,
          image: null,
        };

        return {
          ...old,
          pages: old.pages.map((page, index) =>
            index === 0
              ? { ...page, posts: [optimisticPost, ...page.posts] }
              : page,
          ),
        };
      });

      return { previousPosts };
    },

    onSuccess: () => {
      toast.success("Successfully signed the guestbook!");
    },

    onError: (
      err: unknown,
      _vars: SignGuestbookInput,
      context: { previousPosts?: GuestbookPages } | undefined,
    ) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(QUERY_KEY, context.previousPosts);
      }
      const message =
        err instanceof Error ? err.message : "Failed to sign guestbook";
      toast.error(message);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
