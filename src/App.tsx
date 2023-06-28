import { useRef, useState } from "react";
import "./index.css";
import { Table } from "./components/Table";

function generateTableData(rows: number, cols: number) {
  return new Array(rows).fill(0).map((_, row) => {
    return new Array(cols).fill(0).map((_, col) => {
      return `${row + 1}:${col + 1}`;
    });
  });
}

function App() {
  const [data, setData] = useState<string[][]>(generateTableData(200_000, 15));
  const [visibleRows, setVisibleRows] = useState<number>(15);
  const numberOfVisibleRowsRef = useRef<HTMLInputElement>(null);
  const numberOfRowsRef = useRef<HTMLInputElement>(null);

  function handleVisibleRowsChange() {
    if (!numberOfVisibleRowsRef.current) return;
    const inputValue = numberOfVisibleRowsRef.current.value;
    const number = Number(inputValue);
    if (isNaN(number) || number <= 0) return;
    setVisibleRows(number);
  }

  function handleRowsCountChange() {
    if (!numberOfRowsRef.current) return;
    const inputValue = numberOfRowsRef.current.value;
    const number = Number(inputValue);
    if (isNaN(number) || number <= 0) return;
    setData(generateTableData(number, 15));
  }

  return (
    <main>
      <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
        <span>This table contains {data.length} rows </span>
      </div>
      <Table
        visibleRows={visibleRows}
        data={data}
        rowHeight={48}
        colWidth={80}
      />
      {/* Controls */}
      <div
        style={{
          marginTop: "1rem",
          marginLeft: "auto",
          marginRight: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          width: "fit-content",
        }}
      >
        <label
          style={{
            border: "1px solid black",
            padding: "0.5rem",
            borderRight: "none",
          }}
          htmlFor="visible_rows"
        >
          Number of visible rows
        </label>
        <div
          style={{
            display: "flex",
            border: "1px solid black",
            borderLeft: "none",
            padding: "0.5rem",
          }}
        >
          <input
            id="visible_rows"
            defaultValue={visibleRows}
            type="number"
            ref={numberOfVisibleRowsRef}
          />
          <button
            style={{ flexShrink: "1", flexGrow: "1" }}
            onClick={handleVisibleRowsChange}
          >
            Apply
          </button>
        </div>

        <label
          style={{
            border: "1px solid black",
            padding: "0.5rem",
            borderRight: "none",
          }}
          htmlFor="rows_count"
        >
          Number of rows
        </label>
        <div
          style={{
            border: "1px solid black",
            padding: "0.5rem",
            borderLeft: "none",
          }}
        >
          <input
            id="rows_count"
            type="number"
            defaultValue={data.length}
            ref={numberOfRowsRef}
          />
          <button onClick={handleRowsCountChange}>Create table!</button>
        </div>
      </div>
    </main>
  );
}

export default App;
