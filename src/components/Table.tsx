import { useEffect, useRef, useState } from "react";

interface TableProps {
  data: string[][];
  visibleRows: number;
  rowHeight: number;
  colWidth: number;
}

export function Table({ data, visibleRows, rowHeight, colWidth }: TableProps) {
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

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTo({ top: 0 });
  }, [data]);
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
      <table className="table">
        <tbody>
          {/* +25 to prevent blinking when load */}
          {data.slice(start, start + visibleRows + 10).map((row, rowIdx) => {
            return (
              <tr key={start + rowIdx} style={{ height: rowHeight }}>
                {row.map((cell, cellIdx) => {
                  return (
                    <td
                      style={{ overflow: "hidden" }}
                      width={colWidth}
                      key={start + "" + rowIdx + cellIdx}
                    >
                      {cell}
                    </td>
                  );
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
