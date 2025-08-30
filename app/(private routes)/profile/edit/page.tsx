"use client";

import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/api/clientApi";
import { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";

const EditProfileForm = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const [username, setUsername] = useState(user?.username || "");
  const updateUser = useAuthStore((state) => state.setUser);

  // Form Action API
  const updateProfileAction = async (formData: FormData) => {
    const newUsername = formData.get("username") as string;

    try {
      const updatedUser = await updateProfile({ username: newUsername });
      updateUser(updatedUser); 
      router.push("/profile");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
   
        <Image
          src={user?.avatar || "/default-avatar.png"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />
        
        <form className={css.profileInfo} action={updateProfileAction}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save ☻
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel ☹
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfileForm;
