import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [form, setForm] = useState({
    username: "",
    bio: "",
    avatar: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:4000/profile", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      if (res.data) setForm(res.data);
    });
  }, []);

  const saveProfile = async () => {
    await axios.put(
      "http://localhost:4000/profile",
      form,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Profile updated 🎉");
  };

  return (
    <div>
      <h2>Edit Profile</h2>

      <input
        placeholder="Username"
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
      />

      <textarea
        placeholder="Bio"
        value={form.bio}
        onChange={e => setForm({ ...form, bio: e.target.value })}
      />

      <input
        placeholder="Avatar URL"
        value={form.avatar}
        onChange={e => setForm({ ...form, avatar: e.target.value })}
      />

      <button onClick={saveProfile}>Save</button>
    </div>
  );
}
