import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

console.log("Add Team page loaded");

const teamForm = document.getElementById("teamForm");

teamForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("teamName").value.trim();
  const coach = document.getElementById("coachName").value.trim();
  const country = document.getElementById("country").value.trim();

  if (!name) {
    alert("Team name is required!");
    return;
  }

  try {
    await addDoc(collection(db, "teams"), {
      name,
      coach,
      country,
      createdAt: serverTimestamp()
    });
    alert("✅ Team added successfully!");
    window.location.href = "teams.html";
  } catch (error) {
    console.error("Error adding team:", error);
    alert("⚠️ Error adding team. Check console for details.");
  }
});
