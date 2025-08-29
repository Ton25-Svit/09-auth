import NotesClient from "./Notes.client"
import { Metadata } from "next";
import { fetchNotesServer } from "@/lib/api/serverApi";

interface Props {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props):Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];
  
  return {
    title: `Notes: ${tag}`,
    description: `${tag} notes to management`,
    openGraph: {
      title: `Notes: ${tag}`,
      description: `${tag} notes to management`,
      url: `https://09-auth-ashen.vercel.com/notehub/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub logo"
        },
      ],
    }
  }
}


export default async function NotesByCategory({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0] === "All" ? undefined : slug[0]

  const initialData = await fetchNotesServer({
  searchQuery: "",
  page: 1,
  tag,
  });
  
  return (
    <main >
      <NotesClient initialData={initialData} tag={ tag } />
    </main>
  )
}