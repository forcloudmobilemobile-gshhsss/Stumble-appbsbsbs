const searchBtn = document.getElementById('searchBtn');
const usernameInput = document.getElementById('usernameInput');
const resultBox = document.getElementById('result');
const playerNameDisplay = document.getElementById('playerName');
const playerCrownsDisplay = document.getElementById('playerCrowns');
const errorMsg = document.getElementById('errorMsg');

searchBtn.addEventListener('click', async () => {
    const username = usernameInput.value.trim();
    if (!username) return;

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
        
        const data = await response.json();
        
        let crowns = '0';
        let foundUsername = username;

        // Parse StumbleLabs data
        if (Array.isArray(data) && data.length > 0) {
            crowns = data[0].Crowns ?? data[0].crowns ?? 'Not Found';
            foundUsername = data[0].Username ?? data[0].username ?? username;
        } else if (data && typeof data === 'object') {
            crowns = data.Crowns ?? data.crowns ?? data.user?.crowns ?? 'Not Found';
            foundUsername = data.Username ?? data.username ?? data.user?.username ?? username;
        } else {
            throw new Error('Not found');
        }

        playerNameDisplay.textContent = foundUsername;
        playerCrownsDisplay.textContent = crowns;

    } catch (error) {
        playerNameDisplay.textContent = 'Error';
        playerCrownsDisplay.textContent = '-';
        errorMsg.textContent = 'Failed to fetch player.';
    }
})
