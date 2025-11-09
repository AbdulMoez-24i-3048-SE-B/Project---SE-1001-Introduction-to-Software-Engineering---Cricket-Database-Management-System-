console.log("Teams.js loaded");

import { db } from "./firebase-config.js";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Wait until DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  
  const addTeamBtn = document.getElementById("addTeam");
  const teamList = document.getElementById("teamList");

  if (!addTeamBtn) {
    console.error("Add Team button not found!");
    return;
  }

  addTeamBtn.addEventListener("click", () => {
    window.location.href = "addTeam.html";
  });

  // 🔥 Live listener for team list
  onSnapshot(collection(db, "teams"), (snapshot) => {
    teamList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const t = docSnap.data();
      const div = document.createElement("div");
      div.className = "team-card";
      div.innerHTML = `
        <div class="team-header">
          <div>
            <div class="team-name">${t.name}</div>
            <div class="team-created">
              ${t.createdAt ? t.createdAt.toDate().toLocaleString() : "Just now"}
            </div>
          </div>
          <button class="delete-btn" title="Delete Team">🗑️</button>
        </div>
      `;

      // Clicking card → open team details
      div.querySelector(".team-name").onclick = () => {
        window.location.href = `teamDetails.html?teamId=${docSnap.id}`;
      };

      // Clicking delete → remove from Firestore
      const delBtn = div.querySelector(".delete-btn");
      delBtn.onclick = async (e) => {
        e.stopPropagation(); // prevent triggering card click
        const confirmed = confirm(`Delete team "${t.name}"?`);
        if (confirmed) {
          try {
            await deleteDoc(doc(db, "teams", docSnap.id));
            alert("✅ Team deleted successfully");
          } catch (err) {
            console.error("Error deleting:", err);
            alert("❌ Failed to delete team");
          }
        }
      };

      teamList.appendChild(div);
    });
  });
});
