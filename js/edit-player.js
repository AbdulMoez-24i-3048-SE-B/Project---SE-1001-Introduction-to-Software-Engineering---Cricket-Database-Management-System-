import { db } from "./firebase-config.js";
import { doc, getDoc, updateDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
const teamId = urlParams.get("teamId");
const playerId = urlParams.get("playerId");

const playerForm = document.getElementById("editPlayerForm");
const roleSelect = document.getElementById("role");
const extraFields = document.getElementById("extraFields");

if (!teamId || !playerId) {
  alert("Invalid player or team ID");
  window.location.href = "teams.html";
}

function renderExtraFields(role, data = {}) {
  extraFields.innerHTML = "";

  if (role === "batsman" || role === "allrounder") {
    extraFields.innerHTML += `
      <div>
        <label for="average">Average:</label>
        <input type="number" id="average" placeholder="Enter batting average" value="${data.average || 0}">
      </div>
      <div>
        <label for="strikeRate">Strike Rate:</label>
        <input type="number" id="strikeRate" placeholder="Enter strike rate" value="${data.strikeRate || 0}">
      </div>
      <div>
        <label for="score">Highest Score:</label>
        <input type="number" id="score" placeholder="Enter highest score" value="${data.score || 0}">
      </div>
    `;
  }

  if (role === "bowler" || role === "allrounder") {
    extraFields.innerHTML += `
      <div>
        <label for="bowlerType">Bowler Type:</label>
        <select id="bowlerType">
          <option value="">Select type</option>
          <option value="spinner" ${data.bowlerType === "spinner" ? "selected" : ""}>Spinner</option>
          <option value="mediumFast" ${data.bowlerType === "mediumFast" ? "selected" : ""}>Medium Fast</option>
          <option value="fast" ${data.bowlerType === "fast" ? "selected" : ""}>Fast</option>
        </select>
      </div>
    `;
  }
}

async function loadPlayer() {
  const playerRef = doc(db, "teams", teamId, "players", playerId);
  const playerSnap = await getDoc(playerRef);

  if (!playerSnap.exists()) {
    alert("Player not found!");
    window.location.href = `teamDetails.html`;
    return;
  }

  const playerData = playerSnap.data();
  document.getElementById("playerName").value = playerData.name || "";
  document.getElementById("handType").value = playerData.handType || "";
  document.getElementById("role").value = playerData.role || "";

  renderExtraFields(playerData.role, playerData);
}

roleSelect.addEventListener("change", () => {
  renderExtraFields(roleSelect.value);
});

playerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("playerName").value.trim();
  const role = document.getElementById("role").value;
  const handType = document.getElementById("handType").value;

  const updatedData = { name, role, handType, updatedAt: Timestamp.now() };

  if (role === "batsman" || role === "allrounder") {
    updatedData.average = Number(document.getElementById("average").value) || 0;
    updatedData.strikeRate = Number(document.getElementById("strikeRate").value) || 0;
    updatedData.score = Number(document.getElementById("score").value) || 0;
  }

  if (role === "bowler" || role === "allrounder") {
    updatedData.bowlerType = document.getElementById("bowlerType").value || "";
  }

  const playerRef = doc(db, "teams", teamId, "players", playerId);
  await updateDoc(playerRef, updatedData);

  alert("Player updated successfully!");
  window.location.href = `teamDetails.html`;
});
loadPlayer();
