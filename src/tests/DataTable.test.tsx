import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataTable, { Column } from "../DataTable";

type Row = { id: number; name: string; age: number };
const data: Row[] = [
  { id: 1, name: "Bob", age: 30 },
  { id: 2, name: "Alice", age: 25 },
];

const columns: Column<Row>[] = [
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "age", title: "Age", dataIndex: "age", sortable: true },
];

test("sorts by column when header clicked", () => {
  render(<DataTable<Row> data={data} columns={columns} />);
  const header = screen.getByRole("button", { name: /sort by name/i });
  fireEvent.click(header);

  const rows = screen.getAllByRole("row").slice(1); // ignore header row
  const firstDataRow = within(rows[0]).getByText(/Alice|Bob/).textContent;
  expect(firstDataRow).toContain("Alice");
});

test("selects rows (multiple)", () => {
  const onSelect = jest.fn();
  render(<DataTable<Row> data={data} columns={columns} selectable onRowSelect={onSelect} />);
  const checkboxes = screen.getAllByRole("checkbox", { name: /select row/i });
  fireEvent.click(checkboxes[0]);
  expect(onSelect).toHaveBeenCalled();
});
