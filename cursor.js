const cursorImages = [
    '../images/blk1.png',
    '../images/blk2.png',
    '../images/blk3.png',
    '../images/blk4.png',
    '../images/blk5.png',
    '../images/blk6.png',
    '../images/blk7.png',
    '../images/blk8.png',
    // Add more images if needed
];
let currentImageIndex = 0;
let stackHeight = {};  // To keep track of stacking height at different X positions
let fallingBlocks = {};  // To track if a block is still falling at a specific X position

document.addEventListener('mousemove', (e) => {
    const cursor = document.getElementById('customCursor');
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
});

document.addEventListener('click', (e) => {
    const gameArea = document.getElementById('gameArea');
    const block = document.createElement('img');
    block.src = cursorImages[currentImageIndex];
    block.className = 'block';

    // Snap the X position to the grid
    const xPosition = Math.floor(e.pageX / 32) * 32;

    // Check if a block is still falling at this X position
    if (fallingBlocks[xPosition]) return;  // Prevent multiple blocks falling at the same time on the same X position

    fallingBlocks[xPosition] = true;  // Mark this X position as having a falling block

    block.style.left = `${xPosition}px`;

    // Calculate the stack height (Y position)
    const existingHeight = stackHeight[xPosition] || 0;
    const finalYPosition = gameArea.offsetHeight - 32 - existingHeight;

    // Start block at the mouse click position
    block.style.top = e.pageY + 'px';

    // Append the block to the game area
    gameArea.appendChild(block);

    // Smooth falling animation
    const fallDuration = 1000; // Duration in milliseconds
    block.animate([
        { top: e.pageY + 'px' },
        { top: finalYPosition + 'px' }
    ], {
        duration: fallDuration,
        easing: 'ease-in'
    });

    setTimeout(() => {
        // Ensure block lands at final position after animation
        block.style.top = finalYPosition + 'px';

        // Update the stack height for this X position
        stackHeight[xPosition] = existingHeight + 32;

        // Mark this X position as available for another block
        fallingBlocks[xPosition] = false;
    }, fallDuration);

    // Change the cursor image
    currentImageIndex = (currentImageIndex + 1) % cursorImages.length;
    document.getElementById('customCursor').src = cursorImages[currentImageIndex];
});