document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('balance');
    const betAmountInput = document.getElementById('betAmount');
    const placeBetButton = document.getElementById('placeBet');
    const cashOutButton = document.getElementById('cashOut');
    const historyList = document.getElementById('historyList');
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    const withdrawModal = document.getElementById('withdrawModal');
    const closeModal = document.querySelector('.close');
    const withdrawForm = document.getElementById('withdrawForm');
    const loadingScreen = document.getElementById('loadingScreen');
    const container = document.querySelector('.container');

    let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 50;
    let currentMultiplier = 1.00;
    let betAmount = 0;
    let gameInterval;
    let gameActive = false;

    balanceElement.textContent = balance.toFixed(2);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            container.style.display = 'block';
        }, 2000);
    });

    balanceElement.addEventListener('click', () => {
        withdrawModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        withdrawModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == withdrawModal) {
            withdrawModal.style.display = 'none';
        }
    });

    withdrawForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const bankAccount = document.getElementById('bankAccount').value;
        const ifsc = document.getElementById('ifsc').value;
        const email = document.getElementById('email').value;

        const withdrawInfo = {
            fullName,
            bankAccount,
            ifsc,
            email
        };

        localStorage.setItem('withdrawInfo', JSON.stringify(withdrawInfo));
        alert('Withdrawal information saved!');
        withdrawModal.style.display = 'none';
    });

    placeBetButton.addEventListener('click', () => {
        betAmount = parseFloat(betAmountInput.value);
        if (betAmount > balance) {
            alert('Insufficient balance!');
            return;
        }
        balance -= betAmount;
        balanceElement.textContent = balance.toFixed(2);
        startGame();
    });

    cashOutButton.addEventListener('click', () => {
        if (!gameActive) return;
        clearInterval(gameInterval);
        const winnings = betAmount * currentMultiplier;
        balance += winnings;
        balanceElement.textContent = balance.toFixed(2);
        localStorage.setItem('balance', balance.toFixed(2));
        addHistory(`Cashed out at ${currentMultiplier.toFixed(2)}x, won ₹${winnings.toFixed(2)}`);
        gameActive = false;
    });

    function startGame() {
        currentMultiplier = 1.00;
        gameActive = true;
        gameInterval = setInterval(() => {
            currentMultiplier += currentMultiplier < 10 ? 0.01 : currentMultiplier < 50 ? 0.05 : 0.1;
            drawMultiplier(currentMultiplier);
            if (Math.random() < 0.01) { // Randomly end the game
                clearInterval(gameInterval);
                alert('The plane flew away!');
                gameActive = false;
            }
        }, 100);
    }

    function drawMultiplier(multiplier) {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        ctx.font = '30px Arial';
        ctx.fillStyle = '#ffd700';
        ctx.textAlign = 'center';
        ctx.fillText(`${multiplier.toFixed(2)}x`, gameCanvas.width / 2, gameCanvas.height / 2);
    }

    function addHistory(message) {
        const listItem = document.createElement('li');
        listItem.textContent = message;
        historyList.appendChild(listItem);
    }

    // Ensure balance is saved when the user closes the site
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('balance', balance.toFixed(2));
    });
});
