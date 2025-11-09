import { db } from "./firebase-config.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const teamForm = document.getElementById("teamForm");

teamForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const teamName = document.getElementById("teamName").value.trim();
  const coachName = document.getElementById("coachName").value.trim();
  const ranking = document.getElementById("ranking").value;

  if (!teamName) {
    alert("Team name is required!");
    return;
  }

  try {
    await addDoc(collection(db, "teams"), {
      teamName,
      coachName,
      ranking: ranking ? parseInt(ranking) : null,
      createdAt: Timestamp.now()
    });
    alert("Team added!");
    window.location.href = "teams.html";
  } catch (error) {
    alert("Failed to add team: " + error.message);
  }
});