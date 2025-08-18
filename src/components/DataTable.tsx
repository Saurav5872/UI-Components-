import React, { useMemo, useState } from "react";
import './components.css'; 
export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  
  render?: (value: T[keyof T], record: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  
  ariaLabel?: string;
  emptyMessage?: string;
  loadingMessage?: string;
}

type SortOrder = "asc" | "desc";

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  ariaLabel = "Data table",
  emptyMessage = "No data to display",
  loadingMessage = "Loading…",
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedIds, setSelectedIds] = useState<Array<T["id"]>>([]);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const arr = [...data];
    arr.sort((a, b) => {
      const av = a[sortKey!];
      const bv = b[sortKey!];
      if (av == null && bv == null) return 0;
      if (av == null) return sortOrder === "asc" ? -1 : 1;
      if (bv == null) return sortOrder === "asc" ? 1 : -1;
      // basic < / >
      // @ts-ignore - TS can't guarantee comparable types; works for string/number/date.
      if (av < bv) return sortOrder === "asc" ? -1 : 1;
      // @ts-ignore
      if (av > bv) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [data, sortKey, sortOrder]);

  const allSelected =
    sorted.length > 0 && sorted.every((r) => selectedIds.includes(r.id));
  const someSelected =
    sorted.some((r) => selectedIds.includes(r.id)) && !allSelected;

  const commitSelection = (ids: Array<T["id"]>) => {
    setSelectedIds(ids);
    onRowSelect?.(data.filter((d) => ids.includes(d.id)));
  };

  const toggleAll = () => {
    if (allSelected) {
      commitSelection([]);
    } else {
      commitSelection(sorted.map((r) => r.id));
    }
  };

  const toggleRow = (id: T["id"]) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    commitSelection(next);
  };

  const handleSort = (key: keyof T) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className="dt-wrap">
      <div className="dt-scroll" aria-busy={loading || undefined}>
        <table className="dt" role="table" aria-label={ariaLabel}>
          <thead className="dt-head">
            <tr>
              {selectable && (
                <th className="dt-th dt-th-select">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((c) => {
                const isSorted = sortKey === c.dataIndex;
                const ariaSort = c.sortable
                  ? isSorted
                    ? sortOrder === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                  : undefined;
                return (
                  <th
                    key={c.key}
                    className={`dt-th ${c.className ?? ""}`}
                    aria-sort={ariaSort as any}
                    scope="col"
                  >
                    {c.sortable ? (
                      <button
                        type="button"
                        className="dt-sort"
                        onClick={() => handleSort(c.dataIndex)}
                        aria-label={`Sort by ${c.title}`}
                        title={`Sort by ${c.title}`}
                      >
                        <span>{c.title}</span>
                        <span aria-hidden="true" className="dt-sort-icon">
                          {isSorted ? (sortOrder === "asc" ? "▲" : "▼") : "↕"}
                        </span>
                      </button>
                    ) : (
                      c.title
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="dt-td dt-td-center" colSpan={columns.length + (selectable ? 1 : 0)}>
                  {loadingMessage}
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td className="dt-td dt-td-center" colSpan={columns.length + (selectable ? 1 : 0)}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr key={String(row.id)} className={i % 2 ? "dt-row alt" : "dt-row"}>
                  {selectable && (
                    <td className="dt-td dt-td-select">
                      <input
                        type="checkbox"
                        aria-label={`Select row ${row.id}`}
                        checked={selectedIds.includes(row.id)}
                        onChange={() => toggleRow(row.id)}
                      />
                    </td>
                  )}
                  {columns.map((c) => {
                    const val = row[c.dataIndex];
                    return (
                      <td key={c.key} className="dt-td">
                        {c.render ? c.render(val, row) : String(val)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="dt-hint">Tip: drag sideways to see more columns on small screens.</p>
    </div>
  );
}

export default DataTable;
