import {
  DeleteRequest,
  GetRequest,
  PatchRequest,
  PostRequest,
  PutRequest,
} from "@/plugins/http";

export const ApiGetPost = (page = 1, limit = 10) =>
  GetRequest(`/post/active?page=${page}&limit=${limit}`);

export const ApiGetAllPost = (page = 1, limit = 30) =>
  GetRequest(`/post/all?page=${page}&limit=${limit}`);

export const APIGetPostDetails = (slug: string) =>
  GetRequest(`/post/details/${slug}`);

export const APIGetPostDetailAdmin = (id: string) =>
  GetRequest(`/post/admin-get-post/${id}`);

export const APIGetPostDetailsAuth = (slug: string) =>
  GetRequest(`/post/details-auth/${slug}`);

export const APIAddBlog = (slug: string, data: any) =>
  PostRequest(`/post/create/${slug}`, data);

export const ApiDeletePost = (id: string) =>
  PatchRequest(`/post/delete/${id}`, {});

export const ApiTogglePostStatus = (id: string) =>
  PatchRequest(`/post/delete/${id}`, {});

export const ApiUpdatePost = (id: string, payload: any) =>
  PatchRequest(`/post/update/${id}`, payload);

export const ApiAdminUpdatePost = (id: string, payload: any) =>
  PatchRequest(`/post/admin-update/${id}`, payload);
