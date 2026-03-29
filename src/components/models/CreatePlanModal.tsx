"use client";

import { useState, useRef } from "react";
import { Plus, ImageIcon, Pencil, Trash2, Settings } from "lucide-react";

const CreatePlanModal = ({ onClose, onSave }: any) => {
  const [title, setTitle] = useState("");
  const [criteria, setCriteria] = useState<string[]>([
    "Number of wash 1",
    "AI-powered diagnostics",
    "Maintenance",
  ]);

  const [showInput, setShowInput] = useState(false);
  const [newCriteria, setNewCriteria] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [preview, setPreview] = useState<string>("");
  const [showImage, setShowImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setShowImage(true);
  };

  const handleToggleImage = () => {
    if (!preview) {
      alert("There is no image selected");
      setTimeout(() => fileInputRef.current?.click(), 100);
      return;
    }
    setShowImage((prev) => !prev);
  };

  const addCriteria = () => {
    if (!newCriteria.trim()) return;
    setCriteria((prev) => [...prev, newCriteria]);
    setNewCriteria("");
    setShowInput(false);
  };

  const removeCriteria = (index: number) => {
    setCriteria((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCriteria = (index: number, value: string) => {
    const updated = [...criteria];
    updated[index] = value;
    setCriteria(updated);
    setEditingIndex(null);
  };

  const handleSave = () => {
    if (!title) return;
    if (!preview) {
      alert("Please select an image");
      return;
    }

    onSave({
      title,
      description: criteria.join(", "),
      image: preview,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[520px] rounded-2xl p-6 shadow-xl">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create a new plan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>

        <div className="flex justify-end items-center gap-3 mb-6">
          <button
            onClick={handleToggleImage}
            className="flex items-center gap-2 text-gray-600 text-sm"
          >
            {preview && showImage ? "Hide image" : "Show image"}
            <ImageIcon size={16} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-[#3B4EFF] text-white px-3 py-1 rounded-md text-sm"
          >
            Add <Plus size={14} />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {preview && showImage && (
          <img
            src={preview}
            className="w-24 h-24 object-cover rounded-md border mb-4"
          />
        )}

        <div className="mb-6">
          <label className="text-sm text-gray-600">Title</label>
          <input
            type="text"
            placeholder="Enter the plan name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-2 border rounded-md p-3"
          />
        </div>

        <div className="space-y-4 mb-6">
          {criteria.map((c, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked readOnly />
                {editingIndex === i ? (
                  <input
                    autoFocus
                    defaultValue={c}
                    onBlur={(e) => updateCriteria(i, e.target.value)}
                    className="border px-2 py-1 text-sm"
                  />
                ) : (
                  <span>{c}</span>
                )}
              </div>

              <div className="flex gap-2">
                <Pencil onClick={() => setEditingIndex(i)} size={16} />
                <Trash2 onClick={() => removeCriteria(i)} size={16} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            Add more criteria
            <Settings size={16} />
          </div>

          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 bg-[#3B4EFF] text-white px-3 py-1 rounded-md text-sm"
          >
            Add <Plus size={14} />
          </button>
        </div>

        {showInput && (
          <div className="flex gap-2 mb-6">
            <input
              value={newCriteria}
              onChange={(e) => setNewCriteria(e.target.value)}
              placeholder="Enter criteria"
              className="flex-1 border p-2 rounded-md"
            />
            <button
              onClick={addCriteria}
              className="bg-[#3B4EFF] text-white px-3 rounded-md"
            >
              Add
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#3B4EFF] text-white rounded-md"
          >
            Save plan details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlanModal;