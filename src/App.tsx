import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./index.css";

function generateTableData(rows: number, cols: number) {
  return new Array(rows).fill(0).map((_, row) => {
    return new Array(cols).fill(0).map((_, col) => {
      return `${row}:${col}`;
    });
  });
}

interface TableProps {
  data: string[][];
  visibleRows: number;
  rowHeight: number;
  colWidth: number;
}

function Table({ data, visibleRows, rowHeight, colWidth }: TableProps) {
  const [start, setStart] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function getTopHeight() {
    return rowHeight * start;
  }

  function getBottomHeight() {
    const totalRows = data.length;
    const visibleEnd = start + visibleRows;
    const hiddenRows = Math.max(totalRows - visibleEnd, 0);
    return rowHeight * hiddenRows;
  }

  useEffect(() => {
    function onScroll(event: Event) {
      const target = event.target as HTMLDivElement;
      setStart(Math.floor(target.scrollTop / rowHeight));
    }

    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", onScroll);
      return () => {
        if (scrollContainerRef.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          scrollContainerRef.current.removeEventListener("scroll", onScroll);
        }
      };
    }
  }, [rowHeight]);
  return (
    <div
      style={{
        height: rowHeight * visibleRows + 1,
        overflow: "auto",
      }}
      ref={scrollContainerRef}
    >
      <div
        style={{
          width: "100%",
          height: getTopHeight(),
        }}
      />
      <table>
        <tbody>
          {data.slice(start, start + visibleRows + 1).map((row, rowIdx) => {
            return (
              <tr key={start + rowIdx} style={{ height: rowHeight }}>
                {row.map((cell, cellIdx) => {
                  return <td style={{overflow: 'hidden'}} width={colWidth} key={start + "" + rowIdx + cellIdx}>{cell}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        style={{
          width: "100%",
          height: getBottomHeight(),
        }}
      />
    </div>
  );
}

function App() {
  const [data, setData] = useState<string[][]>(generateTableData(200_000, 20));
  const [visibleRows, setVisibleRows] = useState<number>(15);

  function handleVisibleRowsChange(event: ChangeEvent<HTMLInputElement>) {
    const num = Number(event.target.value)
    if(isNaN(num)) return;
    setVisibleRows(num)
  }

  return (
    <main>
      <Table visibleRows={visibleRows} data={data} rowHeight={48} colWidth={80} />
      <div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <label htmlFor="visible_rows">
            Number of visible rows
          </label>
          <input id="visible_rows" value={visibleRows} type="number" onChange={handleVisibleRowsChange}/>
        </div>
      </div>
    </main>
  );
}

export default App;
