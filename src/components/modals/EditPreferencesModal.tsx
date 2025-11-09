"use client";
import { useState, useEffect } from "react";
import { ApiGetPreferences, ApiUpdatePreferences } from "@/api/user";
import { ApiGetTag } from "@/api/tag";
import CommonButton from "../common/CommonButton";
import showNotify from "@/utils/notify";

const EditPreferencesModal = () => {
  const [opened, setOpened] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!opened) return;
    (async () => {
      setLoading(true);
      try {
        const [{ data: tags }, { data: prefs }] = await Promise.all([
          ApiGetTag(),
          ApiGetPreferences(),
        ]);
        setOptions(tags.map((t: any) => ({ value: t.id, label: t.title })));
        setSelected(prefs.map((p: any) => p.id));
      } catch {
        showNotify("fail", "Could not load preferences");
      } finally {
        setLoading(false);
      }
    })();
  }, [opened]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await ApiUpdatePreferences(selected);
      showNotify("success", "Preferences updated");
      setOpened(false);
    } catch {
      showNotify("fail", "Could not save preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <CommonButton
        label="Edit Preferences"
        onClick={() => setOpened(true)}
        color="primary"
      />

      {opened && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-card text-card-foreground border border-border rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Preference Tags</h3>

            {loading ? (
              <p className="text-muted-foreground text-center py-8">
                Loading...
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-6">
                  {options
                    .filter((opt) => selected.includes(opt.value))
                    .map((opt) => (
                      <span
                        key={opt.value}
                        className="px-3 py-1 rounded-md bg-accent text-accent-foreground text-sm flex items-center gap-2"
                      >
                        {opt.label}
                        <button
                          className="text-xs opacity-80 hover:opacity-100"
                          onClick={() =>
                            setSelected((prev) =>
                              prev.filter((id) => id !== opt.value)
                            )
                          }
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setOpened(false)}
                    className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-accent/20 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-accent transition"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditPreferencesModal;
