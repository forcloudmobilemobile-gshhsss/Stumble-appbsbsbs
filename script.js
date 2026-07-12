const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('usernameInput');
const resultBox = document.getElementById('result');
const playerNameDisplay = document.getElementById('playerName');
const playerCrownsDisplay = document.getElementById('playerCrowns');
const errorMsg = document.getElementById('errorMsg');

searchBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (!username) return;

    // Reset UI for loading state
    resultBox.classList.remove('hidden');
    playerNameDisplay.textContent = 'Searching...';
    playerCrownsDisplay.textContent = '-';
    errorMsg.textContent = '';

    try {
        // Fetching from your secure Vercel API backend
        const response = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        
        // Match the updated structure shown in the Discord logs
        if (result && result.success && result.data) {
            const playerData = result.data;
            
            // Clean out color codes (like <#0bf>) from usernames if they exist
            const cleanName = playerData.userName ? playerData.userName.replace(/<#.*?>/g, '') : username;
            const crowns = playerData.crowns !== undefined ? playerData.crowns : '0';

            playerNameDisplay.textContent = cleanName;
            playerCrownsDisplay.textContent = crowns;
        } else {
            throw new Error(result.message || 'Player not found');
        }

    } catch (error) {
        playerNameDisplay.textContent = 'Error';
        playerCrownsDisplay.textContent = '-';
        errorMsg.textContent = 'Player not found or API error.';
    }
});
