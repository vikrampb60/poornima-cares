// src/ComplaintStatus.js
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export default function ComplaintStatus() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // current user (same logic as dashboard)
  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("studentUser");
      return raw ? JSON.parse(raw) : { name: "Guest", username: "guest" };
    } catch {
      return { name: "Guest", username: "guest" };
    }
  })();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // query complaints by userId (if userId stored)
        const q = query(
          collection(db, "complaints"),
          where("userId", "==", currentUser.username || "guest"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setComplaints(list);
      } catch (err) {
        console.error(err);
        alert("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUser.username]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Your Complaints</h2>
      {loading && <p>Loading...</p>}
      {!loading && complaints.length === 0 && <p>No complaints yet.</p>}
      <div>
        {complaints.map((c) => (
          <div key={c.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginBottom: 10 }}>
            <strong>{c.title}</strong>
            <p>{c.description}</p>
            <p>Status: <strong>{c.status}</strong></p>
            {c.imageUrl && (
              <p><img src={c.imageUrl} alt="attached" style={{ maxWidth: 240 }} /></p>
            )}
            <small>{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : "—"}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
