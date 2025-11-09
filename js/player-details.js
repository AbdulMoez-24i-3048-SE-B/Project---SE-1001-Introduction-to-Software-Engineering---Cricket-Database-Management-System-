import { db } from "./firebase-config.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const playerDetailsDiv = document.getElementById("playerDetails");
const urlParams = new URLSearchParams(window.location.search);
const teamId = urlParams.get("teamId");
const playerId = urlParams.get("playerId");

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";

async function loadPlayer() {
  if (!teamId || !playerId) {
    playerDetailsDiv.innerHTML = "<p>Invalid player or team.</p>";
    return;
  }

  const playerDocRef = doc(db, "teams", teamId, "players", playerId);
  const playerSnap = await getDoc(playerDocRef);

  if (!playerSnap.exists()) {
    playerDetailsDiv.innerHTML = "<p>Player not found.</p>";
    return;
  }

  const player = playerSnap.data();

  const createRow = (label, value) => `
    <div class="detail-row">
      <div class="detail-label">${label}</div>
      <div class="detail-value">${capitalize(String(value))}</div>
    </div>
  `;

  let html = "";
  html += createRow("Name", player.name);
  html += createRow("Hand Type", player.handType);
  html += createRow("Role", player.role);

  const role = player.role.toLowerCase(); // normalize
if (role === "batsman" || role === "allrounder") {
    html += createRow("Average", player.average);
    html += createRow("Strike Rate", player.strikeRate);
    html += createRow("Highest Score", player.score);
}

if (role === "bowler" || role === "allrounder") {
    html += createRow("Bowler Type", player.bowlerType);
}


  playerDetailsDiv.innerHTML = html;
}
loadPlayer();
