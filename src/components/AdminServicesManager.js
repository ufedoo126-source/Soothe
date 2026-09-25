"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { slugify, formatPrice } from "@/lib/services";
import { Trash2, Pencil, Check, X } from "lucide-react";

export default function AdminServicesManager() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  async function fetchData() {
    setLoading(true);
    const { data: cats } = await supabase
      .from("service_categories")
      .select("*")
      .order("name");
    const { data: svcs } = await supabase
      .from("services")
      .select("*, service_categories(name)")
      .order("name");
    setCategories(cats || []);
    setServices(svcs || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !categoryId || !price) {
      setError("Name, category, and price are required.");
      return;
    }
    setSaving(true);
    const { error: insertError } = await supabase.from("services").insert({
      category_id: categoryId,
      name: name.trim(),
      slug: slugify(name),
      duration: duration.trim(),
      price: Number(price),
      description: description.trim() || null,
    });
    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setName("");
    setCategoryId("");
    setDuration("");
    setPrice("");
    setDescription("");
    fetchData();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) fetchData();
  }

  function startEdit(svc) {
    setEditingId(svc.id);
    setEditData({
      name: svc.name,
      duration: svc.duration || "",
      price: svc.price,
      description: svc.description || "",
      category_id: svc.category_id,
    });
  }

  async function saveEdit(id) {
    const { error } = await supabase
      .from("services")
      .update({
        name: editData.name.trim(),
        slug: slugify(editData.name),
        duration: editData.duration.trim(),
        price: Number(editData.price),
        description: editData.description.trim() || null,
        category_id: editData.category_id,
      })
      .eq("id", id);
    if (!error) {
      setEditingId(null);
      fetchData();
    }
  }

  return (
    <div>
      <form
        onSubmit={handleAdd}
        className="bg-white border border-nude rounded-2xl p-6 mb-8 space-y-4"
      >
        <h3 className="text-charcoal font-medium">Add New Service</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Service name"
          className="w-full border border-nude rounded-lg px-4 py-2.5"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-nude rounded-lg px-4 py-2.5"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (e.g. 1 hr)"
          className="w-full border border-nude rounded-lg px-4 py-2.5"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price in Naira (e.g. 45000)"
          className="w-full border border-nude rounded-lg px-4 py-2.5"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={3}
          className="w-full border border-nude rounded-lg px-4 py-2.5"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="bg-rose hover:bg-blush text-white font-medium px-6 py-2.5 rounded-full transition disabled:opacity-50"
        >
          {saving ? "Adding..." : "Add Service"}
        </button>
      </form>

      {loading ? (
        <p className="text-charcoal/50">Loading services...</p>
      ) : (
        <div className="space-y-3">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white border border-nude rounded-xl p-4"
            >
              {editingId === svc.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full border border-nude rounded-lg px-3 py-1.5 text-sm"
                  />
                  <select
                    value={editData.category_id}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        category_id: e.target.value,
                      })
                    }
                    className="w-full border border-nude rounded-lg px-3 py-1.5 text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={editData.duration}
                    onChange={(e) =>
                      setEditData({ ...editData, duration: e.target.value })
                    }
                    className="w-full border border-nude rounded-lg px-3 py-1.5 text-sm"
                  />
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                    className="w-full border border-nude rounded-lg px-3 py-1.5 text-sm"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        description: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full border border-nude rounded-lg px-3 py-1.5 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(svc.id)}
                      className="text-green-600 flex items-center gap-1 text-sm"
                    >
                      <Check size={16} /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-charcoal/40 flex items-center gap-1 text-sm"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-charcoal font-medium">{svc.name}</p>
                    <p className="text-charcoal/50 text-sm">
                      {svc.service_categories?.name} · {svc.duration} ·{" "}
                      {formatPrice(svc.price)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(svc)}
                      className="text-charcoal/50 hover:text-rose"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(svc.id)}
                      className="text-charcoal/50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}