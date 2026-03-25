import { PostRequest } from "@/plugins/http";

export const ApiMagicFix = (payload: { text: string; instruction?: string }) =>
  PostRequest(`/magic-fix`, payload);