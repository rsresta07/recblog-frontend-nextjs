import { GetRequest } from "@/plugins/http";

export const APIGetRecommendedPosts = () =>
  GetRequest("/recommendation-service/recommendations");

export const APIGetRawRecommendedPosts = () =>
  GetRequest("/recommendation-service/raw-recommendations");

export const APIUserRecommendedPosts = () =>
  GetRequest("/recommendation-service/user-based-recommendations");

export const APIInteractionRecommendedPosts = () =>
  GetRequest("/recommendation-service/interaction-based-recommendations");

export const APIFinalRecommendedPosts = (page?: number, limit?: number) =>
  GetRequest(
    `/recommendation-service/final-recommendations${
      page || limit
        ? `?${new URLSearchParams({ page: String(page || 1), limit: String(limit || 10) })}`
        : ""
    }`
  );

export const APIGetPostContextRecommendations = (postId: string) =>
  GetRequest(`/recommendation-service/post-context-recommendations/${postId}`);
