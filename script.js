window.addEventListener("DOMContentLoaded", () => {
  const grid1 = document.getElementById("grid1");
  const grid2 = document.getElementById("grid2");
  const checkButton = document.getElementById("checkButton");
  const resetButton = document.getElementById("resetButton");
  const message = document.getElementById("message");
  let numAttempts = 0;

  // Generate unique random numbers for grid1
  const numbers = generateUniqueRandomNumbers(9, 1, 9);

  // Populate grid1 with numbers
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.id = "item" + i;
    cell.textContent = numbers[i];
    cell.draggable = true;
    cell.addEventListener("dragstart", handleDragStart);
    grid1.appendChild(cell);
  }

  // Create empty cells for grid2
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.addEventListener("dragover", handleDragOver);
    cell.addEventListener("dragstart", handleDragStart);
    cell.addEventListener("drop", handleDrop);
    grid2.appendChild(cell);
  }

  // Handle drag start event
  function handleDragStart(event) {
    let dragData = JSON.stringify({
      content: event.target.textContent,
      index: event.target.id,
      target: event.target,
      parent: document.getElementById(event.target.id).parentNode.id,
    });
    event.dataTransfer.setData("text/plain", dragData);
  }

  // Handle drag over event
  function handleDragOver(event) {
    event.preventDefault();
  }

  // Handle drop event
  function handleDrop(event) {
    event.preventDefault();
    // Parse the event json content
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));

    // Handling the remove action from the origin
    var draggedItem = document.getElementById(data.index);

    if (event.target.textContent) {
      // If the destination (drop area) is not empty, handle swap
      draggedItem.textContent = event.target.textContent;
      draggedItem.draggable = "false";
      draggedItem.id = event.target.id;

      event.target.id = data.index;
      event.target.textContent = data.content;
      event.target.draggable = true;
    } else {
      // If the destination (drop area) is already empty
      // Clear the origin
      draggedItem.textContent = "";
      draggedItem.draggable = "false";
      draggedItem.id = "";

      // Move it to the destination
      event.target.id = data.index;
      event.target.textContent = data.content;
      event.target.draggable = true;
    }
  }
  // Handle reset button click event
  resetButton.addEventListener("click", () => {
    const grid2Cells = document.getElementById("grid2");
    // Empty the grid2
    [].forEach.call(grid2Cells.childNodes, function (child) {
      child.textContent = "";
      child.draggable = "false";
      child.id = "";
    });


    const numbers = generateUniqueRandomNumbers(9, 1, 9);
    const grid1Cells = document.getElementById("grid1");
    // Populate the grid1
    [].forEach.call(grid1Cells.childNodes, function (child, i) {
      child.id = "item" + i;
      child.className = "cell";
      child.textContent = numbers[i];
      child.draggable = true;
      child.addEventListener("dragstart", handleDragStart);
    });
  });

  // Handle check button click event
  checkButton.addEventListener("click", () => {
    const grid2Cells = Array.from(grid2.getElementsByClassName("cell"));
    const grid2Numbers = grid2Cells.map((cell) => parseInt(cell.textContent));

    let isValid = true;
    for (let i = 0; i < grid2Numbers.length; i++) {
      if (grid2Numbers[i] !== i + 1) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      message.textContent = "OK";
      message.style.color = "green";
    } else {
      numAttempts++;
      if (numAttempts >= 3) {
        message.textContent = "Try again";
        message.style.color = "red";
        checkButton.disabled = true;
      } else {
        message.textContent = `Try again (${3 - numAttempts} attempts left)`;
        message.style.color = "black";
      }
    }
  });

  // Utility function to generate unique random numbers
  function generateUniqueRandomNumbers(count, min, max) {
    const numbers = Array.from(
      { length: max - min + 1 },
      (_, index) => index + min
    );
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers.slice(0, count);
  }
});
