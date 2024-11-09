import React, { useState, useRef, useEffect } from "react";
import { Slider } from "./ui/slider";
import { Select } from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  extractWordsFromGrid,
  reshape,
  wait,
  gridClass,
  letters,
  shuffleElements,
} from "../utility/utils";

const WordSearch = () => {
  const [grid, setGrid] = useState(6);
  const [speed, setSpeed] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const boardRef = useRef(null);
  const [isComputing, setisComputing] = useState(false);
  const [board, setBoard] = useState([]);
  const [possibleWords, setPossibleWords] = useState([]);

  useEffect(() => {
    const newArray = reshape(letters, grid, grid);
    setBoard(newArray);
    setPossibleWords(extractWordsFromGrid(newArray));
  }, [grid]);

  const dfsSearch = function (board, word) {
    setisComputing(true);

    const validate = async (row, col, k) => {
      // Out of boundary case for recursive call
      if (row < 0 || col < 0 || row >= board.length || col >= board[0].length)
        return;

      boardRef.current.children[board[row][col] + row + col]?.classList.add(
        "box-selected"
      );

      // Wrong Character
      if (board[row][col] != word[k]) {
        return false;
      } else {
        boardRef.current.children[board[row][col] + row + col]?.classList.add(
          "box-matched"
        );


        if (row > 0 && row < board.length - 1 && (board[row - 1][col] === word[k + 1] || board[row + 1][col] === word[k + 1])) {
          boardRef.current.children[
            board[row][col] + row + col
          ]?.classList.add("box-completed");
        } else if (row === board.length - 1 && board[row - 1][col] === word[k + 1]) {
          boardRef.current.children[
            board[row][col] + row + col
          ]?.classList.add("box-completed");
        } else if (row === 0 && board[row + 1][col] === word[k + 1]) {
          boardRef.current.children[
            board[row][col] + row + col
          ]?.classList.add("box-completed");
        }

        if (col > 0 && col < board[0].length - 1 && (board[row][col - 1] === word[k + 1] || board[row][col + 1] === word[k + 1])) {
          boardRef.current.children[
            board[row][col] + row + col
          ]?.classList.add("box-completed");
        } else if (col === board[0].length - 1 && board[row][col - 1] === word[k + 1]) {
          boardRef.current.children[
            board[row][col] + row + col
          ]?.classList.add("box-completed");
        } else if (col === 0 && board[row][col + 1] === word[k + 1]) {
          boardRef.current.children[
            board[row][col] + row + col
          ]?.classList.add("box-completed");
        }

      }

      // Base case to return from recursive call
      if (k === word.length - 1) {
        boardRef.current.children[
          board[row][col] + row + col
        ]?.classList.add("box-completed");
        setisComputing(false);
        return true;
      }

      await wait(speed);

      // Change value as null so we dont go back and forth
      board[row][col] = null;

      // try all directions
      validate(row + 1, col, k + 1);
      validate(row - 1, col, k + 1);
      validate(row, col + 1, k + 1);
      validate(row, col - 1, k + 1);

      // Change into real value, reset the board.
      board[row][col] = word[k];
    };

    // Iterative loop
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === word[0]) {
          validate(i, j, 0);
        }
      }
    }
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        const value = board[i][j];
        boardRef.current.children[value + i + j]?.classList.remove(
          "box-selected"
        );
        boardRef.current.children[value + i + j]?.classList.remove(
          "box-matched"
        );
        boardRef.current.children[value + i + j]?.classList.remove(
          "box-completed"
        );
      }
    }
  };

  const handleReset = () => {
    reset();
  };

  const handleSearch = () => {
    if (!searchTerm) alert("Select text to search");
    reset();
    dfsSearch(board, searchTerm);
  };

  const handleShuffle = () => {
    reset();
    const newArray = reshape(shuffleElements(letters), grid, grid);
    setBoard(newArray);
    setPossibleWords(extractWordsFromGrid(newArray));
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <Card>
        <CardHeader className="text-center py-4">
          <CardTitle className="text-xl font-bold text-gray-800">
            <div className="flex justify-between items-center">
              <div>Word Search</div>
              <div>
                <Button
                  disabled={isComputing}
                  variant="outline"
                  onClick={handleReset}
                  className="mr-3"
                >
                  Reset
                </Button>
                <Button variant="outline" onClick={handleShuffle} disabled={isComputing}>
                  shuffle
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Speed Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Speed</span>
              <span className="text-sm text-gray-500">{speed}sec</span>
            </div>
            <Slider
              disabled={isComputing}
              value={speed}
              onChange={setSpeed}
              max={5}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          {/* Grid Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Grid Size (Min 4 to Max 10)
              </span>
              <span className="text-sm text-gray-500">{grid}</span>
            </div>
            <Slider
              disabled={isComputing}
              value={grid}
              onChange={setGrid}
              max={10}
              min={4}
              step={1}
              className="w-full"
            />
          </div>

          {/* Search Controls */}
          <div className="flex gap-2">
            <Select
              disabled={isComputing ? "disabled" : false}
              className="flex-1 h-8 text-sm"
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            >
              <option key={"default"} >
                Select words
              </option>
              {possibleWords.map((words, index) => (
                <option key={index} value={words}>
                  {words}
                </option>
              ))}
            </Select>

            <Input
              disabled={isComputing ? "disabled" : false}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              placeholder="Enter word"
              className="flex-1 h-8 text-sm"
            />

            <Button onClick={handleSearch} className="h-10 text-sm px-3" disabled={isComputing}>
              Search
            </Button>
          </div>

          {/* Letter Grid */}
          <div
            className={`grid ${gridClass[grid]} gap-1.5 mt-4`}
            ref={boardRef}
          >
            {board.map((row, rowIndex) =>
              row.map((letter, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="aspect-square flex items-center justify-center bg-gray-100 rounded-md text-base font-semibold hover:bg-gray-200 transition-colors cursor-pointer
                           sm:text-sm sm:rounded-sm"
                  id={letter + rowIndex + colIndex}
                >
                  {letter}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordSearch;
