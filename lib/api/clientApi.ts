"use client";

import { User } from "@/types/user";
import { nextClient } from "./api";
import { NewNote, Note } from "@/types/note";

export interface NoteSearchResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  username: string;
  avatar?: string;
};

// ---------- Notes ----------
export async function fetchNotes({
  searchQuery,
  tag,
  page,
}: {
  searchQuery?: string;
  tag?: string;
  page?: number;
}): Promise<NoteSearchResponse> {
  const response = await nextClient.get<NoteSearchResponse>("/notes", {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(tag && tag !== "All" && { tag }),
      perPage: 9,
      page,
    },
    withCredentials: true,
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextClient.get<Note>(`/notes/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

export async function createNote(noteData: NewNote): Promise<Note> {
  const response = await nextClient.post<Note>("/notes", noteData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await nextClient.delete<Note>(`/notes/${id}`, {
    withCredentials: true,
  });
  return response.data;
}

// ---------- Auth ----------
export async function registerUser(data: RegisterRequest): Promise<User> {
  const response = await nextClient.post<User>("/auth/register", data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
}

export async function loginUser(data: LoginRequest): Promise<User> {
  const response = await nextClient.post<User>("/auth/login", data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
}

export const getMe = async (): Promise<User> => {
  const { data } = await nextClient.get<User>("/users/me", {
    withCredentials: true,
  });
  return data;
};

export const checkSession = async (): Promise<boolean> => {
  const res = await nextClient.get<{ success: boolean }>("/auth/session", {
    withCredentials: true,
  });
  return res.data.success;
};

export const logout = async (): Promise<void> => {
  await nextClient.post("/auth/logout", null, { withCredentials: true });
};

export const updateProfile = async (
  data: UpdateProfileRequest
): Promise<User> => {
  const res = await nextClient.patch<User>("/users/me", data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return res.data;
};
