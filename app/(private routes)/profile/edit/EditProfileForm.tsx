"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import css from "./EditProfileForm.module.css";

type Props = {
  initialUsername: string;
  initialEmail: string;
  initialAvatar?: string;
};

export default function EditProfileForm({
  initialUsername,
  initialEmail,
  initialAvatar = "/default-avatar.png",
}: Props) {
  const [username, setUsername] = useState(initialUsername);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
        credentials: "include",
      });

      if (res.ok) {
        router.push("/profile");
      } else {
        console.error("Failed to update profile");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={initialAvatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form onSubmit={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <p>Email: {initialEmail}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
