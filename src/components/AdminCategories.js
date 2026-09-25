"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { slugify } from "@/lib/services";
import { Trash2, Pencil, Check, X } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  async function fetchCategories() {
    setLoading(true);
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .order("name");
    if (!error && data) setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    setUploading(true);

    let imageUrl = null;
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${slugify(name)}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(fileName, imageFile);
      if (uploadError) {
        setError("Image upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("service-images")
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase
      .from("service_categories")
      .insert({
        name: name.trim(),
        slug: slugify(name),
        image_url: imageUrl,
      });

    setUploading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setName("");
    setImageFile(null);
    fetchCategories();
  }

  async function handleDelete(id) {
    if (
      !confirm(
        "Delete this category? All services inside it will also be deleted."
      )
    )
      return;
    const { error } = await supabase
      .from("service_categories")
      .delete()
      .eq("id", id);
    if (!error) fetchCategories();
  }

  function startEdit(cat) {
    setEditingId(cat.id);
    setEditName(cat.name);
  }

  async function saveEdit(id) {
    const { error } = await supabase
      .from("service_categories")
      .update({ name: editName.trim(), slug: slugify(editName) })
      .eq("id", id);
    if (!error) {
      setEditingId(null);
      fetchCategories();
    }
  }

  async function handleImageReplace(id, file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `category-${id}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("service-images")
      .upload(fileName, file);
    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("service-images")
      .getPublicUrl(fileName);
    await supabase
      .from("service_categories")
      .update({ image_url: urlData.publicUrl })
      .eq("id", id);
    fetchCategories();
  }

  return (
    <div>
      <form
        onSubmit={handleAdd}
        className="bg-white border border-nude rounded-2xl p-6 mb-8 space-y-4"
      >
        <h3 className="text-charcoal font-medium">Add New Category</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="w-full border border-nude rounded-lg px-4 py-2.5"
        />
        <div>
          <label className="block text-sm text-charcoal/70 mb-1">
            Category Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full text-sm"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="bg-rose hover:bg-blush text-white font-medium px-6 py-2.5 rounded-full transition disabled:opacity-50"
        >
          {uploading ? "Adding..." : "Add Category"}
        </button>
      </form>

      {loading ? (
        <p className="text-charcoal/50">Loading categories...</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border border-nude rounded-xl p-4 flex items-center gap-4"
            >
              {cat.image_url && (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                {editingId === cat.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border border-nude rounded-lg px-3 py-1.5 text-sm"
                  />
                ) : (
                  <p className="text-charcoal font-medium">{cat.name}</p>
                )}
                <label className="text-xs text-rose cursor-pointer hover:underline">
                  Replace image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files[0] &&
                      handleImageReplace(cat.id, e.target.files[0])
                    }
                  />
                </label>
              </div>
              {editingId === cat.id ? (
                <>
                  <button
                    onClick={() => saveEdit(cat.id)}
                    className="text-green-600"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-charcoal/40"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(cat)}
                    className="text-charcoal/50 hover:text-rose"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-charcoal/50 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}