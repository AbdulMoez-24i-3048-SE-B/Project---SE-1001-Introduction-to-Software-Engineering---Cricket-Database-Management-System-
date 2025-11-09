import { db } from "./firebase-config.js";
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const playerForm = document.getElementById("playerForm");
const roleSelect = document.getElementById("role");
const extraFields = document.getElementById("extraFields");
const urlParams = new URLSearchParams(window.location.search);
const teamId = urlParams.get("teamId");

roleSelect.addEventListener("change", () => {
  extraFields.innerHTML = "";

  if (roleSelect.value === "batsman" || roleSelect.value === "allrounder") {
    const batsmanFields = `
      <div>
        <label for="average">Average:</label>
        <input type="number" id="average" placeholder="Enter batting average">
      </div>
      <div>
        <label for="strikeRate">Strike Rate:</label>
        <input type="number" id="strikeRate" placeholder="Enter strike rate">
      </div>
      <div>
        <label for="score">Highest Score:</label>
        <input type="number" id="score" placeholder="Enter highest score">
      </div>
    `;
    extraFields.innerHTML += batsmanFields;
  }

  if (roleSelect.value === "bowler" || roleSelect.value === "allrounder") {
    const bowlerFields = `
      <div>
        <label for="bowlerType">Bowler Type:</label>
        <select id="bowlerType">
          <option value="">Select type</option>
          <option value="spinner">Spinner</option>
          <option value="mediumFast">Medium Fast</option>
          <option value="fast">Fast</option>
        </select>
      </div>
    `;
    extraFields.innerHTML += bowlerFields;
  }
});

playerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("playerName").value.trim();
  const role = document.getElementById("role").value;
  const handType = document.getElementById("handType").value;

  if (!teamId) return;

  const data = { name, role, handType, createdAt: Timestamp.now() };

  if (role === "batsman" || role === "allrounder") {
    data.average = Number(document.getElementById("average")?.value) || 0;
    data.strikeRate = Number(document.getElementById("strikeRate")?.value) || 0;
    data.score = Number(document.getElementById("score")?.value) || 0;
  }

  if (role === "bowler" || role === "allrounder") {
    data.bowlerType = document.getElementById("bowlerType")?.value || "";
  }

  await addDoc(collection(db, "teams", teamId, "players"), data);
  window.location.href = `teamDetails.html?teamId=${teamId}`;
});
