import { db } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const teamTitle = document.getElementById('teamTitle');
const teamInfo = document.getElementById('teamInfo');
const playerList = document.getElementById('playerList');
const addPlayerBtn = document.getElementById('addPlayer');

const teamId = localStorage.getItem('selectedTeamId');

if (!teamId) {
    teamTitle.textContent = 'Unknown Team';
} else {
    async function loadTeamDetails() {
        const teamDocRef = doc(db, 'teams', teamId);
        const teamDocSnap = await getDoc(teamDocRef);

        if (!teamDocSnap.exists()) {
            teamTitle.textContent = 'Unknown Team';
            return;
        }

        const teamData = teamDocSnap.data();
        teamTitle.textContent = teamData.teamName;

        if (teamInfo) {
            teamInfo.innerHTML = `
                <div class="detail-row"><strong>Coach:</strong> ${teamData.coachName || '-'}</div>
                <div class="detail-row"><strong>Ranking:</strong> ${teamData.ranking || '-'}</div>
            `;
        }

        const playersRef = collection(db, 'teams', teamId, 'players');
        const playersSnapshot = await getDocs(playersRef);

        playerList.innerHTML = '';
        if (playersSnapshot.empty) {
            playerList.innerHTML = '<div style="white-space:nowrap;">No players yet. Click + Add Player to create one.</div>';
        } else {
            playersSnapshot.forEach(playerDoc => {
                const player = playerDoc.data();

                const div = document.createElement('div');
                div.className = 'player-card';
                div.style.position = 'relative';

                const nameDiv = document.createElement('div');
                nameDiv.textContent = player.name;
                div.appendChild(nameDiv);

                const menuBtn = document.createElement('button');
                menuBtn.textContent = '⋮';
                menuBtn.style.position = 'absolute';
                menuBtn.style.top = '5px';
                menuBtn.style.right = '5px';
                menuBtn.style.background = 'var(--bg-card)';
                menuBtn.style.border = 'none';
                menuBtn.style.cursor = 'pointer';
                menuBtn.style.fontWeight = 'bold';
                div.appendChild(menuBtn);

                const menu = document.createElement('div');
                menu.className = 'menu';
                menu.style.position = 'fixed';
                menu.style.display = 'none';
                menu.style.background = 'var(--bg-card)';
                menu.style.border = '1px solid var(--border)';
                menu.style.borderRadius = '6px';
                menu.style.padding = '8px 0';
                menu.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                menu.style.minWidth = '120px';
                menu.style.zIndex = '1000';

                const editOption = document.createElement('div');
                editOption.textContent = 'Edit';
                editOption.style.padding = '8px 16px';
                editOption.style.cursor = 'pointer';
                editOption.addEventListener('mouseenter', () => {
                    editOption.style.background = 'var(--border)';
                });
                editOption.addEventListener('mouseleave', () => {
                    editOption.style.background = '';
                });
                editOption.addEventListener('click', (e) => {
                    e.stopPropagation();
                    window.location.href = `editPlayer.html?teamId=${teamId}&playerId=${playerDoc.id}`;
                });

                const deleteOption = document.createElement('div');
                deleteOption.textContent = 'Delete';
                deleteOption.style.color = 'red';
                deleteOption.style.padding = '8px 16px';
                deleteOption.style.cursor = 'pointer';
                deleteOption.addEventListener('mouseenter', () => {
                    deleteOption.style.background = 'var(--border)';
                });
                deleteOption.addEventListener('mouseleave', () => {
                    deleteOption.style.background = '';
                });
                deleteOption.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm(`Delete player "${player.name}"?`)) {
                        await deleteDoc(doc(db, 'teams', teamId, 'players', playerDoc.id));
                        loadTeamDetails();
                    }
                });

                menu.appendChild(editOption);
                menu.appendChild(deleteOption);
                document.body.appendChild(menu);

                menuBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const rect = menuBtn.getBoundingClientRect();
                    menu.style.top = `${rect.bottom + 5}px`;
                    menu.style.right = `${window.innerWidth - rect.right}px`;
                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                });

                div.addEventListener('click', () => {
                    localStorage.setItem('selectedPlayerId', playerDoc.id);
                    window.location.href = `playerDetails.html?teamId=${teamId}&playerId=${playerDoc.id}`;
                });

                document.addEventListener('click', (e) => {
                    if (!menu.contains(e.target) && e.target !== menuBtn) {
                        menu.style.display = 'none';
                    }
                });

                playerList.appendChild(div);
            });
        }
    }

    loadTeamDetails();
}

if (addPlayerBtn) {
    addPlayerBtn.addEventListener('click', () => {
        if (teamId) {
            window.location.href = `addPlayer.html?teamId=${teamId}`;
        }
    });
}