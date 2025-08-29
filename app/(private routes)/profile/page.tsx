import { getMeServer } from "@/lib/api/serverApi";
import { Metadata } from "next";
import css from "./ProfilePage.module.css";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Profile Page | NoteHub",
  description: "Manage your profile in NoteHub",
};

export default async function ProfilePage() {
  const user = await getMeServer();

  if (!user) {
    return (
      <main className={css.mainContent}>
        <div className={css.profileCard}>
          <h1 className={css.formTitle}>Not logged in</h1>
          <Link href="/auth/login" className={css.editProfileButton}>
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
