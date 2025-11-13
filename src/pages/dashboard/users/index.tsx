import { useEffect, useState } from "react";
import { Table, Loader, Text, Button, Switch, Tooltip } from "@mantine/core";
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import { ApiGetAllUsers, ApiToggleUserStatus } from "@/api/user";
import EditUserModal from "@/components/modals/EditUserModal";

type User = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  position: string;
  role: string;
  status: string;
  last_login_at: string;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await ApiGetAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users", err);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (username: string, currentStatus: string) => {
    try {
      await ApiToggleUserStatus(username);
      fetchUsers();
    } catch (err) {
      console.error("Failed to toggle user status", err);
      setError("Failed to toggle user status.");
    }
  };

  if (loading)
    return <Loader size="xl" style={{ margin: "auto", display: "block" }} />;
  if (error)
    return (
      <Text color="red" ta="center" mt="md">
        {error}
      </Text>
    );
  if (users.length === 0)
    return (
      <Text ta="center" mt="md">
        No users found.
      </Text>
    );

  const openModalForUser = (username: string) => {
    setEditUser(username);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditUser(null);
  };

  const rows = users.map((user) => (
    <Table.Tr key={user.id} style={{ color: "var(--foreground)" }}>
      <Table.Td>{user.fullName}</Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>{user.username}</Table.Td>
      <Table.Td>{user.position}</Table.Td>
      <Table.Td>{user.role}</Table.Td>
      <Table.Td>{user.status}</Table.Td>
      <Table.Td>{new Date(user.last_login_at).toLocaleString()}</Table.Td>
      <Table.Td className="flex items-center gap-2">
        <Button
          onClick={() => openModalForUser(user.username)}
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          Edit
        </Button>

        <Switch
          checked={user.status === "APPROVED"}
          onChange={() => toggleUserStatus(user.username, user.status)}
          size="sm"
          color={user.status === "APPROVED" ? "green" : "red"}
          aria-label="Toggle user status"
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="p-4">
      <h1
        className="text-2xl font-bold mb-4"
        style={{ color: "var(--primary)" }}
      >
        All Users
      </h1>

      <Table
        striped
        highlightOnHover
        styles={{
          table: {
            backgroundColor: "var(--card)",
            color: "var(--foreground)",
          },
          th: {
            color: "var(--primary)",
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          },
          td: {
            borderColor: "var(--border)",
          },
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Full Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Expertise</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Last Login</Table.Th>
            <Table.Th>
              <Tooltip label="Toggle to change status" withArrow position="top">
                <span style={{ cursor: "help" }}>Actions</span>
              </Tooltip>
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <tbody>{rows}</tbody>
      </Table>

      <EditUserModal
        opened={modalOpen}
        onClose={closeModal}
        username={editUser}
        refresh={fetchUsers}
      />
    </div>
  );
};

export default AdminUsers;

AdminUsers.getLayout = (page: any) => (
  <AdminDashboardLayout>{page}</AdminDashboardLayout>
);
