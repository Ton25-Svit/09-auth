import { fetchNoteByIdServer } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Metadata } from "next";
import { fetchNoteById } from "@/lib/api/clientApi";

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  const note = await fetchNoteById(id);
  return {
    title: `Note ${note.title}`,
    description: note.content.slice(0, 30),
    openGraph: {
      title: `Note ${note.title}`,
      description: note.content.slice(0, 30),
      url: `https://09-auth-ashen.vercel.app/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub logo",
        },
      ],
      type: "article",
    },
  };
}

const NoteDetails = async ({ params }: PageProps) => {
  const { id } = params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
};

export default NoteDetails;