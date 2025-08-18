import React, { useState } from "react";
import InputField from "./components/InputField.tsx";
import DataTable, { Column } from "./components/DataTable.tsx";
import "./components/components.css";

type User = { id: number; name: string; email: string; age: number };

const demoData: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", age: 25 },
  { id: 2, name: "Bob", email: "bob@example.com", age: 30 },
  { id: 3, name: "Charlie", email: "charlie@example.com", age: 22 },
];

const columns: Column<User>[] = [
  { key: "name", title: "Name", dataIndex: "name", sortable: true },
  { key: "email", title: "Email", dataIndex: "email" },
  { key: "age", title: "Age", dataIndex: "age", sortable: true },
];

export default function App() {
  const [username, setUsername] = useState("");
  const [selected, setSelected] = useState<User[]>([]);

  return (
    <div style={{ padding: 20, display: "grid", gap: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>UI Components Demo</h1>

      <section style={{ maxWidth: 420 }}>
        <InputField
          label="Username"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          helperText="This is a helper text"
          errorMessage="This field is required"
          invalid={!username}
          variant="outlined"
          size="md"
          clearable
        />
        <InputField
          label="Password"
          placeholder="Enter password"
          type="password"
          value={username ? "secret" : ""}
          onChange={() => {}}
          variant="filled"
          size="lg"
          passwordToggle
        />
        <InputField
          label="Ghost style"
          placeholder="Ghost input"
          onChange={() => {}}
          variant="ghost"
          size="sm"
        />
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Users</h2>
        <DataTable<User>
          data={demoData}
          columns={columns}
          selectable
          onRowSelect={setSelected}
        />
        {selected.length > 0 && (
          <p style={{ marginTop: 8 }}>
            Selected: {selected.map((u) => u.name).join(", ")}
          </p>
        )}
      </section>
    </div>
  );
}
