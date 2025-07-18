import React, { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";


// TODO: Implement sortable, filterable, paginated table
const violationTable = ({violations}) => {
  const violation = violations || [];

  const [filterDroneId, setFilterDroneId] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sorting, setSorting] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    return violation.filter((v) => {
      return (
        (filterDroneId ? violation.drone_id === filterDroneId : true) &&
        (filterDate ? violation.date === filterDate : true) &&
        (filterType ? v.type === filterType : true)
      );
    });
  }, [violation, violations, filterDroneId, filterDate, filterType]);

  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const columns = useMemo(
    () => [
      { accessorKey: "drone_id", header: "ID" },
      { accessorKey: "type", header: "Type" },
      { accessorKey: "timestamp", header: "Timestamp" },
      { accessorKey: "latitude", header: "Latitude" },
      { accessorKey: "longitude", header: "Longitude" },
      {
        accessorKey: "image_url",
        header: "Image",
        cell: (info) => (
          <img src={info.getValue()} alt="Violation" width={50} height={50} />
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    setPage(0);
  }, [filterDroneId, filterDate, filterType, pageSize]);

  const violationTypes = [...new Set(violation.map((v) => v.type))];
  const droneIds = [...new Set(violation.map((v) => v.drone_id))];
  const dates = [...new Set(violation.map((v) => v.date))];

  return <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
    <div className="font-semibold mb-2">violation Data Table</div>
    
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap gap-4">
        <div>
          <label>Filter by Drone ID:</label>
          <select
            value={filterDroneId}
            onChange={(e) => setFilterDroneId(e.target.value)}
            className="border p-1 ml-2"
          >
            <option value="">All</option>
            {droneIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Filter by Date:</label>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border p-1 ml-2"
          >
            <option value="">All</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Filter by Violation Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border p-1 ml-2"
          >
            <option value="">All</option>
            {violationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="border border-gray-300 p-2 cursor-pointer"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted()] ?? ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 p-2 text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {Math.ceil(filteredData.length / pageSize)}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={(page + 1) * pageSize >= filteredData.length}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
          className="ml-4 border p-1"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>

  </div>
};








export default violationTable; 
