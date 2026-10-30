"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  getUserCollections,
  createCollectionAction,
  deleteCollectionAction,
} from "@/lib/actions/collections";
import { CustomCollection, Visibility } from "@/types/database";
import {
  Layers,
  Plus,
  Globe,
  Lock,
  Share2,
  Trash2,
  X,
  Film,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CustomCollection[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Modal
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [creatingLoading, setCreatingLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserCollections();
        setCollections(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a collection name");
      return;
    }
    setCreatingLoading(true);
    try {
      const res = await createCollectionAction(name, description, visibility);
      if (res.success && res.collection) {
        setCollections((prev) => [res.collection, ...prev]);
        toast.success(`Created collection "${name}"`);
        setIsCreating(false);
        setName("");
        setDescription("");
      } else {
        toast.error("Failed to create collection");
      }
    } finally {
      setCreatingLoading(false);
    }
  };

  const handleDelete = async (id: string, colName: string) => {
    if (!confirm(`Are you sure you want to delete the collection "${colName}"?`)) return;
    try {
      const res = await deleteCollectionAction(id);
      if (res.success) {
        setCollections((prev) => prev.filter((c) => c.id !== id));
        toast.success(`Deleted collection "${colName}"`);
      } else {
        toast.error("Failed to delete collection");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleShare = (id: string, colName: string) => {
    const url = `${window.location.origin}/collections/${id}`;
    navigator.clipboard.writeText(url);
    toast.success(`Share link for "${colName}" copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-obsidian text-cinema-text">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-obsidian-border pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cinema-text flex items-center gap-3">
              <Layers className="w-8 h-8 text-gold" />
              <span>Custom Movie Collections</span>
            </h1>
            <p className="text-sm text-cinema-muted mt-1">
              Curate thematic film anthologies, director retrospectives, and bespoke watchlists.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2.5 rounded-xl bg-gold text-obsidian font-bold text-xs hover:bg-gold-secondary flex items-center gap-2 transition-all shadow-gold-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Collection</span>
          </button>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-obsidian-card border border-obsidian-border animate-pulse"
              />
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-obsidian-card border border-obsidian-border space-y-3">
            <Layers className="w-12 h-12 text-gold mx-auto mb-2 opacity-80" />
            <h3 className="font-serif text-xl font-bold text-cinema-text">
              No Collections Yet
            </h3>
            <p className="text-sm text-cinema-muted max-w-sm mx-auto mb-4">
              Group your favourite cinematic masterpieces into shareable anthologies.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-gold text-obsidian font-bold text-xs rounded-xl hover:bg-gold-secondary"
            >
              Create Your First Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col) => (
              <div
                key={col.id}
                className="group rounded-2xl overflow-hidden bg-obsidian-card border border-obsidian-border hover:border-gold/50 transition-all flex flex-col justify-between shadow-cinematic hover:shadow-gold-sm"
              >
                {/* Visual Cover Banner */}
                <Link
                  href={`/collections/${col.id}`}
                  className="relative aspect-video w-full overflow-hidden bg-obsidian-secondary block"
                >
                  {col.cover_url ? (
                    <Image
                      src={col.cover_url}
                      alt={col.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-obsidian-card to-obsidian-secondary text-center">
                      <Layers className="w-8 h-8 text-gold mb-2 opacity-60" />
                      <span className="font-serif text-xs text-cinema-muted">Filmfolio Anthology</span>
                    </div>
                  )}

                  {/* Gradient & Visibility Tag */}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-obsidian/85 backdrop-blur-md border border-obsidian-border text-[10px] font-bold uppercase flex items-center gap-1.5 text-cinema-text">
                    {col.visibility === "PUBLIC" ? (
                      <>
                        <Globe className="w-3 h-3 text-gold" />
                        <span>Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-cinema-subtle" />
                        <span>Private</span>
                      </>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-obsidian/90 text-xs font-semibold text-gold">
                    {col.movies_count || col.movies?.length || 0} Films
                  </div>
                </Link>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <Link
                      href={`/collections/${col.id}`}
                      className="font-serif text-xl font-bold text-cinema-text hover:text-gold transition-colors block line-clamp-1"
                    >
                      {col.name}
                    </Link>
                    <p className="text-xs text-cinema-muted line-clamp-2 leading-relaxed">
                      {col.description || "No description provided for this collection."}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-obsidian-border">
                    <Link
                      href={`/collections/${col.id}`}
                      className="text-xs font-semibold text-gold hover:text-gold-secondary"
                    >
                      Browse Anthology →
                    </Link>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleShare(col.id, col.name)}
                        className="p-1.5 rounded-lg text-cinema-muted hover:text-gold hover:bg-obsidian-secondary transition-colors"
                        title="Copy Share Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(col.id, col.name)}
                        className="p-1.5 rounded-lg text-cinema-muted hover:text-cinema-red hover:bg-obsidian-secondary transition-colors"
                        title="Delete Collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Collection Modal */}
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-obsidian-secondary border border-obsidian-border rounded-2xl p-6 shadow-cinematic text-cinema-text relative">
              <button
                onClick={() => setIsCreating(false)}
                className="absolute top-4 right-4 p-2 text-cinema-muted hover:text-cinema-text"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-xl font-bold text-cinema-text mb-1 flex items-center gap-2">
                <Layers className="w-5 h-5 text-gold" />
                <span>Create Custom Collection</span>
              </h3>
              <p className="text-xs text-cinema-muted mb-4">
                Curate a new cinema anthology. You can add films to it anytime.
              </p>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. 70s American Neo-Noir, Villeneuve Masterworks"
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Description & Narrative Focus
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the thematic thread or stylistic criteria of this anthology..."
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text placeholder:text-cinema-subtle focus:outline-none focus:border-gold resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-cinema-muted mb-1">
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as Visibility)}
                    className="w-full px-3 py-2 bg-obsidian-card border border-obsidian-border rounded-lg text-sm text-cinema-text focus:outline-none focus:border-gold"
                  >
                    <option value="PUBLIC">Public (Discoverable & Shareable)</option>
                    <option value="PRIVATE">Private (Only visible to you)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-sm text-cinema-muted hover:text-cinema-text"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingLoading}
                    className="px-5 py-2 bg-gold text-obsidian font-semibold rounded-lg hover:bg-gold-secondary transition-colors"
                  >
                    {creatingLoading ? "Creating..." : "Create Collection"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
