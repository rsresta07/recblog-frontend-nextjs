"use client";
import { useState, useEffect } from "react";
import { ApiGetPreferences, ApiUpdatePreferences } from "@/api/user";
import { ApiGetTag } from "@/api/tag";
import CommonButton from "../common/CommonButton";
import showNotify from "@/utils/notify";
import { IconX } from "@tabler/icons-react";

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
        variant="outline"
      />

      {opened && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-card/90 backdrop-blur-xl border border-border/60 rounded-3xl shadow-2xl p-8 w-full max-w-lg transform transition-all">
            <h3 className="text-primary mb-6">Edit Preference Tags</h3>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <span className="animate-pulse text-muted-foreground">Loading tags...</span>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-8 min-h-[4rem] p-4 bg-background/50 rounded-2xl border border-border/40">
                  {options
                    .filter((opt) => selected.includes(opt.value))
                    .length === 0 && (
                    <p className="text-sm text-muted-foreground italic w-full text-center mt-2">No tags selected</p>
                  )}
                  {options
                    .filter((opt) => selected.includes(opt.value))
                    .map((opt) => (
                      <span
                        key={opt.value}
                        className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium flex items-center gap-2 group transition-all"
                      >
                        {opt.label}
                        <button
                          className="text-primary/60 group-hover:text-destructive group-hover:bg-destructive/10 rounded-full p-0.5 transition-colors"
                          onClick={() =>
                            setSelected((prev) =>
                              prev.filter((id) => id !== opt.value)
                            )
                          }
                        >
                          <IconX size={14} />
                        </button>
                      </span>
                    ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                  <CommonButton
                    label="Cancel"
                    variant="light"
                    onClick={() => setOpened(false)}
                    fullWidth={false}
                  />
                  <CommonButton
                    label={saving ? "Saving..." : "Save Changes"}
                    onClick={handleSave}
                    disabled={saving}
                    fullWidth={false}
                  />
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