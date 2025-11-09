import { 
  db 
} from "./firebase-config.js";

import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  Timestamp 
}
from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const teamList = document.getElementById("teamList");
const addTeamBtn = document.getElementById("addTeam");

if (teamList) {
  async function loadTeams() {
    teamList.innerHTML = "<p>Loading teams...</p>";

    try {
      const querySnapshot = await getDocs(collection(db, "teams"));
      teamList.innerHTML = "";

      if (querySnapshot.empty) {
        teamList.innerHTML = '<div style="white-space:nowrap;">No players yet. Click + Add Player to create one.</div>';
        return;
      }

      querySnapshot.forEach((docSnap) => {
        const team = docSnap.data();
        const div = document.createElement("div");
        div.classList.add("team-card");
        div.style.position = "relative";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.className = "delete-btn";
        deleteBtn.style.position = "absolute";
        deleteBtn.style.top = "10px";
        deleteBtn.style.right = "10px";
        deleteBtn.addEventListener("click", async (e) => {
          e.stopPropagation();
          if (confirm(`Delete team "${team.teamName}"?`)) {
            await deleteDoc(doc(db, "teams", docSnap.id));
            loadTeams();
          }
        });
        div.appendChild(deleteBtn);

        const teamNameEl = document.createElement("div");
        teamNameEl.className = "team-name";
        teamNameEl.textContent = team.teamName;

        const teamInfoEl = document.createElement("div");
        teamInfoEl.className = "team-created";

        if (team.createdAt instanceof Timestamp) {
          teamInfoEl.textContent = `Created on ${team.createdAt.toDate().toLocaleDateString()}`;
        } else {
          teamInfoEl.textContent = `Created on ${new Date(team.createdAt).toLocaleDateString()}`;
        }

        div.appendChild(teamNameEl);
        div.appendChild(teamInfoEl);

        div.addEventListener("click", () => {
          localStorage.setItem("selectedTeamId", docSnap.id);
          window.location.href = "teamDetails.html";
        });

        teamList.appendChild(div);
      });
    } catch (err) {
      console.error(err);
      teamList.innerHTML = `<p style="color:red;">Failed to load teams.</p>`;
    }
  }

  loadTeams();
}

if (addTeamBtn) {
  addTeamBtn.addEventListener("click", async () => {
    const name = prompt("Enter team name:");
    if (!name) return;

    try {
      await addDoc(collection(db, "teams"), {
        teamName: name,
        coachName: "",
        country: "",
        createdAt: Timestamp.now(),
      });
      alert("Team added!");
      loadTeams();
    } catch (err) {
      alert("Failed to add team: " + err.message);
    }
  });
}
