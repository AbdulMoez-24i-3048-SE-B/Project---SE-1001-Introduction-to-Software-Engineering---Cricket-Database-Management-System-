import { db } from "./firebase-config.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const teamForm = document.getElementById("teamForm");

teamForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const teamName = document.getElementById("teamName").value.trim();
  const coachName = document.getElementById("coachName").value.trim();
  const country = document.getElementById("country").value.trim();

  if (!teamName) return;

  try {
    await addDoc(collection(db, "teams"), {
      teamName,
      coachName,
      country,
      createdAt: Timestamp.now()
    });
    alert("Team added!");
    window.location.href = "teams.html";
  } catch (error) {
    alert("Failed to add team: " + error.message);
  }
});
