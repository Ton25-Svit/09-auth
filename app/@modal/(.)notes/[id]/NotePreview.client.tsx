"use client";

import { useRouter, useParams } from "next/navigation";
import {
  useQuery,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";
import { useEffect } from "react";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NotePreview.module.css";

type NotePreviewProps = {
  dehydratedState: DehydratedState;
};

export default function NotePreviewModal({
  dehydratedState,
}: NotePreviewProps) {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  const close = () => router.back();

  useEffect(() => {
    if (isError) {
      console.error("Something went wrong while fetching notes.");
    }
  }, [isError]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Modal onClose={close}>
        {isLoading && <p>Loading...</p>}
        {data && (
          <div>
            <div className={css.header}>
              <p className={css.tag}>{data.tag}</p>
              <button onClick={close} className={css.backBtn}>
                Close
              </button>
            </div>
            <h2 className={css.title}>{data.title}</h2>
            <p className={css.content}>{data.content}</p>
            <p className={css.date}>
              {new Date(data.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </Modal>
    </HydrationBoundary>
  );
}
