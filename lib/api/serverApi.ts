import { Note } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { AxiosResponse } from "axios";

export interface NoteSearchResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

async function getServerCookies(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  return {
    Cookie: cookieHeader,
  };
}

export async function fetchNotesServer({
  searchQuery,
  tag,
  page,
}: {
  searchQuery?: string;
  tag?: string;
  page?: number;
}): Promise<NoteSearchResponse> {
  const headers = await getServerCookies();

  const response = await nextServer.get<NoteSearchResponse>(`/notes`, {
    params: {
      ...(searchQuery && { search: searchQuery }),
      ...(tag && tag !== "All" && { tag }),
      perPage: 9,
      page,
    },
    headers,
  });

  return response.data;
}

export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const headers = await getServerCookies();
  const res = await nextServer.get<Note>(`/notes/${id}`, { headers });
  return res.data;
};

export const checkServerSession = async (): Promise<AxiosResponse> => {
  const headers = await getServerCookies();
  return nextServer.get("/auth/session", { headers });
};

export const getMeServer = async (): Promise<User | null> => {
  try {
    const headers = await getServerCookies();
    const res = await nextServer.get<User>("/users/me", { headers });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user on server:", error);
    return null;
  }
};