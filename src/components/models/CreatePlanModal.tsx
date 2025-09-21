import { useState } from "react";

const CreatePlanModal = ({ onClose, onSave }: any) => {
  const [title, setTitle] = useState("");
  const [criteria, setCriteria] = useState([
    "Number of wash 1",
    "AI-powered diagnostics",
    "Maintenance",
  ]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // for preview
    }
  };

  const handleSave = () => {
    if (!title) return;

    onSave({
      title,
      description: criteria.join(", "),
      image: preview,
      file: imageFile,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[500px] shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Create a new plan</h2>

        {/* Image Upload Section */}
        <div className="mb-4 flex items-center gap-4">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-md border"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center border rounded-md text-gray-400">
              No image
            </div>
          )}

          <label className="cursor-pointer bg-[#3241B3] text-white px-3 py-2 rounded-md text-sm">
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Enter the plan name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md p-2 mb-4"
        />

        {/* Criteria */}
        <div className="space-y-2 mb-4">
          {criteria.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="checkbox" checked readOnly />
              <span>{c}</span>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!title}
          className={`w-full py-2 rounded-md font-semibold ${
            title
              ? "bg-[#3241B3] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Save plan details
        </button>
      </div>
    </div>
  );
};

export default CreatePlanModal;
