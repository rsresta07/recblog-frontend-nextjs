import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/layouts/AdminDashboardLayout";
import {
  ApiGetAllTags,
  ApiAddTag,
  ApiToggleTagStatus,
  ApiEditTag,
} from "@/api/tag";
import { Button } from "@mantine/core";
import { Switch } from "@mantine/core";

const AdminTags = () => {
  type Tag = {
    id: string;
    title: string;
    status: boolean;
  };

  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await ApiGetAllTags();
      setTags(response?.data || []);
    } catch (err) {
      console.error("Failed to fetch tags", err);
      setError("Error fetching tags.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      await ApiAddTag({ title: newTag.trim() });
      setNewTag("");
      fetchTags();
    } catch (err) {
      console.error("Failed to add tag", err);
      setError("Could not add tag.");
    }
  };

  const handleToggleStatus = async (tagId: string) => {
    try {
      await ApiToggleTagStatus(tagId);
      fetchTags();
    } catch (err) {
      console.error("Failed to toggle tag status", err);
      setError("Could not toggle tag status.");
    }
  };

  const handleEditTag = async (tagId: string, currentTitle: string) => {
    const newTitle = prompt("Enter new tag title:", currentTitle);
    if (!newTitle || newTitle.trim() === "") return;

    try {
      await ApiEditTag(tagId, { title: newTitle.trim() });
      fetchTags();
    } catch (err) {
      console.error("Failed to edit tag", err);
      setError("Could not edit tag.");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return (
    <div className="p-4">
      <h1
        className="text-2xl font-bold mb-4"
        style={{ color: "var(--primary)" }}
      >
        Manage Tags
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border px-2 py-1 w-full max-w-xs rounded-lg"
          style={{
            backgroundColor: "var(--card)",
            color: "var(--foreground)",
            borderColor: "var(--border)",
          }}
          placeholder="New tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />

        <Button
          variant="filled"
          radius="md"
          onClick={handleAddTag}
          className="px-4 py-2 rounded-lg shadow-lg transition-colors duration-300"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
          styles={{
            root: {
              "&:hover": {
                backgroundColor: "var(--accent)",
              },
            },
          }}
        >
          Add Tag
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : tags.length === 0 ? (
        <p>No tags available.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {tags.map((tag) => (
            <li
              key={tag?.id}
              className="flex justify-between items-center border p-3 rounded-lg"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <span style={{ color: "var(--foreground)" }}>{tag.title}</span>
              <div className="flex gap-4 items-center">
                <Switch
                  checked={tag.status}
                  onChange={() => handleToggleStatus(tag.id)}
                  color="green"
                  size="md"
                  className="scale-110"
                />
                <button
                  onClick={() => handleEditTag(tag?.id, tag?.title)}
                  className="px-2 py-1 rounded-lg shadow-lg transition-colors duration-300"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary)";
                  }}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminTags;

AdminTags.getLayout = (page: any) => (
  <AdminDashboardLayout>{page}</AdminDashboardLayout>
);
