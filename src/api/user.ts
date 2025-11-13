import { GetRequest, PatchRequest, PutRequest } from "@/plugins/http";

export const ApiGetUser = (slug: any) => GetRequest(`/user/details/${slug}`);

export const ApiGetMe = () => GetRequest("/user/me", { withCredentials: true });

export const ApiGetAllUsers = () => GetRequest("/user/all");

export const ApiUpdateMe = (payload: any) =>
  PutRequest("/user/me", payload, { withCredentials: true });

export const ApiGetPreferences = () =>
  GetRequest("/user/preferences", { withCredentials: true });

export const ApiUpdatePreferences = (tagIds: any) =>
  PatchRequest("/user/preferences", { tagIds }, { withCredentials: true });

export const ApiUpdateUserByAdmin = (slug: string, payload: any) =>
  PatchRequest(`/user/update-by-admin/${slug}`, payload, {
    withCredentials: true,
  });

export const ApiToggleUserStatus = (username: string) =>
  PatchRequest(
    `/user/status-by-admin/${username}`,
    {},
    {
      withCredentials: true,
    },
  );
