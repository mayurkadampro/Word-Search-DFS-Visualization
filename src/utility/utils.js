const extractWordsFromGrid = (grid, minLength = 3) => {
  const words = new Set();

  const numRows = grid.length;
  const numCols = grid[0].length;

  const addWord = (word) => {
    
    if (word.length >= minLength) {
      words.add(word);
    }
  };

  // Extract horizontal words
  for (let row = 0; row < numRows; row++) {
    let rowStr = grid[row].slice(0, randomIntFromInterval(1, grid[row].length - 1)).join("");
    addWord(rowStr); // Left-to-right
    addWord([...rowStr].reverse().join("")); // Right-to-left
  }

  // Extract vertical words
  for (let col = 0; col < numCols; col++) {
    let colStr = [];
    for (let row = 0; row < numRows; row++) {
      colStr.push(grid[row][col]);
      
    }
    
    addWord(colStr.slice(0, randomIntFromInterval(1, colStr.length - 1)).join("")); // Top-to-bottom
    addWord([...colStr].reverse().join("")); // Bottom-to-top
  }

  // Extract diagonal words (top-left to bottom-right)
  //   for (let d = 0; d < numRows + numCols - 1; d++) {
  //     let diag1 = "",
  //       diag2 = "";
  //     for (let row = 0; row < numRows; row++) {
  //       let col1 = d - row;
  //       let col2 = numCols - d + row - 1;

  //       if (col1 >= 0 && col1 < numCols) {
  //         diag1 += grid[row][col1];
  //       }
  //       if (col2 >= 0 && col2 < numCols) {
  //         diag2 += grid[row][col2];
  //       }
  //     }
  //     addWord(diag1);
  //     addWord([...diag1].reverse().join("")); // Bottom-right to top-left
  //     addWord(diag2);
  //     addWord([...diag2].reverse().join("")); // Bottom-left to top-right
  //   }
  
  return shuffleElements(Array.from(words)); // Convert Set to Array for output
};

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const shuffleElements = (arr) => {
  return arr.sort((a, b) => Math.random() - 0.5);
};

const reshape = (arr, rows, cols) => {
  const result = new Array(rows);
  for (let row = 0; row < rows; row++) {
    result[row] = new Array(cols);
  }
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      result[row][col] = arr[row * cols + col];
    }
  }
  return result;
};

const wait = (speed) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, speed * 1000);
  });
};

const gridClass = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
};

const letters = Array.from({ length: 100 }, (i) =>
  String.fromCharCode(Math.round(Math.ceil(Math.random() * 25) + 65))
);

export { extractWordsFromGrid, shuffleElements, reshape, wait, randomIntFromInterval, letters, gridClass };
