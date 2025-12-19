"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Loader2, Plus, Save, Trash2, X, LogOut, Layout, Users, Mail } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import Modal from "@/components/ui/Modal";
import ImageCropper from "@/components/ui/ImageCropper";

interface Project {
  id: number;
  title: string;
  location: string;
  year: string;
  description: string;
  image: string;
}

interface Content {
  studio: {
    subtitle1: string;
    subtitle2: string;
    team_name: string;
    team_role: string;
    location_city: string;
    location_desc: string;
  };
  contact: {
    email: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'work' | 'studio' | 'contact'>('work');
  const [projects, setProjects] = useState<Project[]>([]);
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadMode, setUploadMode] = useState<Record<number, boolean>>({});

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [cropperProjectId, setCropperProjectId] = useState<number | null>(null);

  const router = useRouter();
  const { addToast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = objectUrl;
    img.onload = async () => {
      const ratio = img.width / img.height;
      if (ratio < 0.5 || ratio > 0.85) {
        setCropperSrc(objectUrl);
        setCropperProjectId(projectId);
        addToast("Ratio Mismatch. Opening Cropper...", "info");
      } else {
        uploadFile(file, projectId);
      }
    };
  };

  const uploadFile = async (file: Blob, projectId: number) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        handleUpdate(projectId, "image", data.url);
        addToast("Image Uploaded.", "success");
        setCropperSrc(null);
      } else {
        throw new Error("Upload Failed");
      }
    } catch (error) { addToast("Upload failed.", "error"); }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    if (cropperProjectId !== null) {
      uploadFile(croppedBlob, cropperProjectId);
      setCropperProjectId(null);
    }
  };

  const handleContentUpdate = (section: 'studio' | 'contact', field: string, value: string) => {
    if (!content) return;
    setContent(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
    });
  };

  const handleSaveContent = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        addToast("Content Updated Successfully.", "success");
      } else {
        throw new Error("Save Failed");
      }
    } catch (e) {
      addToast("Failed to save content.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='));
    if (!token) { router.push("/login"); return; }

    Promise.all([
      fetch("/api/projects").then(r => r.json()),
      fetch("/api/content").then(r => r.json())
    ]).then(([projectsData, contentData]) => {
      setProjects(projectsData);
      setContent(contentData);
      setIsLoading(false);
    }).catch(e => {
      addToast("Failed to load data.", "error");
      setIsLoading(false);
    });
  }, [router, addToast]);

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; max-age=0";
    router.push("/login");
  };

  const handleUpdate = (id: number, field: keyof Project, value: string) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };
  const handleSaveProjects = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/projects", { method: "POST", body: JSON.stringify(projects) });
      addToast("Projects Saved.", "success");
      setEditingId(null);
    } catch (e) { addToast("Error Saving.", "error"); }
    finally { setIsSaving(false); }
  };
  const confirmDelete = (id: number) => { setDeleteId(id); setIsDeleteModalOpen(true); };
  const executeDelete = () => {
    if (deleteId) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
      addToast("Project Deleted.", "info");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };
  const handleAdd = () => {
    const newId = (projects.length > 0 ? Math.max(...projects.map((p) => p.id)) : 0) + 1;
    const newProject: Project = { id: newId, title: "NEW PROJECT", location: "Loc", year: "2025", description: "Desc", image: "https://placehold.co/800x1200" };
    setProjects([newProject, ...projects]);
    setEditingId(newId);
  };

  if (isLoading) return <div className="w-full h-screen bg-[#050505] flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 px-8 pb-20">
      <Header />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-oswald font-bold uppercase mb-4">CMS Admin</h1>
            <div className="flex gap-4">
              <button onClick={() => setActiveTab('work')} className={`pb-2 text-sm uppercase font-mono tracking-widest transition-colors ${activeTab === 'work' ? 'border-b-2 border-white text-white' : 'text-neutral-500 hover:text-white'}`}>
                Work
              </button>
              <button onClick={() => setActiveTab('studio')} className={`pb-2 text-sm uppercase font-mono tracking-widest transition-colors ${activeTab === 'studio' ? 'border-b-2 border-white text-white' : 'text-neutral-500 hover:text-white'}`}>
                Studio
              </button>
              <button onClick={() => setActiveTab('contact')} className={`pb-2 text-sm uppercase font-mono tracking-widest transition-colors ${activeTab === 'contact' ? 'border-b-2 border-white text-white' : 'text-neutral-500 hover:text-white'}`}>
                Contact
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            {activeTab === 'work' && (
              <button onClick={handleAdd} className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 transition-colors uppercase font-mono text-xs tracking-widest">
                <Plus size={16} /> New Project
              </button>
            )}
            <button
              onClick={activeTab === 'work' ? handleSaveProjects : handleSaveContent}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-neutral-200 transition-colors uppercase font-mono text-xs tracking-widest font-bold disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-red-900/20 text-red-500 hover:bg-red-900/40 transition-colors uppercase font-mono text-xs tracking-widest">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {activeTab === 'work' && (
          <div className="grid gap-8">
            {projects.map((project) => (
              <div key={project.id} className={`p-6 bg-[#0a0a0a] border ${editingId === project.id ? "border-white" : "border-white/10"} transition-colors`} onClick={() => setEditingId(project.id)}>
                <div className="flex gap-8 flex-col md:flex-row">
                  <div className="w-32 h-40 bg-neutral-900 relative flex-shrink-0">
                    <img src={project.image} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Title</label>
                      <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-oswald text-xl uppercase" value={project.title} onChange={(e) => handleUpdate(project.id, "title", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest flex justify-between">
                        <span>Image Source</span>
                        <div className="flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setUploadMode(prev => ({ ...prev, [project.id]: false })) }} className={`px-1 ${!uploadMode[project.id] ? "text-white" : "text-white/30"}`}>URL</button>
                          <span>/</span>
                          <button onClick={(e) => { e.stopPropagation(); setUploadMode(prev => ({ ...prev, [project.id]: true })) }} className={`px-1 ${uploadMode[project.id] ? "text-white" : "text-white/30"}`}>UPLOAD</button>
                        </div>
                      </label>
                      {!uploadMode[project.id] ? (
                        <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-mono text-xs text-neutral-400" value={project.image || ""} onChange={(e) => handleUpdate(project.id, "image", e.target.value)} placeholder="https://..." />
                      ) : (
                        <input type="file" accept="image/*" className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-mono text-xs text-neutral-400 file:mr-4 file:py-1 file:px-2 file:border-0 file:text-xs file:bg-neutral-800 file:text-white hover:file:bg-neutral-700" onChange={(e) => handleFileUpload(e, project.id)} />
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Location</label>
                      <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-mono text-sm" value={project.location} onChange={(e) => handleUpdate(project.id, "location", e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Year</label>
                      <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-mono text-sm" value={project.year} onChange={(e) => handleUpdate(project.id, "year", e.target.value)} />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1">
                      <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Description</label>
                      <textarea className="w-full bg-transparent border border-white/10 focus:border-white outline-none p-4 font-sans text-sm text-neutral-300 leading-relaxed min-h-[100px]" value={project.description} onChange={(e) => handleUpdate(project.id, "description", e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-col justify-start">
                    <button onClick={(e) => { e.stopPropagation(); confirmDelete(project.id); }} className="p-2 text-red-500 hover:bg-white/10 rounded transition-colors"><Trash2 size={20} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'studio' && content && (
          <div className="bg-[#0a0a0a] border border-white/10 p-8">
            <h3 className="text-xl font-oswald uppercase mb-6 flex items-center gap-2"><Users size={20} /> Studio Content</h3>
            <div className="grid gap-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Intro Text (Paragraph 1)</label>
                <textarea className="w-full bg-transparent border border-white/10 focus:border-white outline-none p-4 font-sans text-sm text-neutral-300 leading-relaxed min-h-[100px]" value={content.studio.subtitle1} onChange={(e) => handleContentUpdate('studio', "subtitle1", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Philosophy (Paragraph 2)</label>
                <textarea className="w-full bg-transparent border border-white/10 focus:border-white outline-none p-4 font-sans text-sm text-neutral-300 leading-relaxed min-h-[100px]" value={content.studio.subtitle2} onChange={(e) => handleContentUpdate('studio', "subtitle2", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Team Title (Name)</label>
                  <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-mono text-sm" value={content.studio.team_name} onChange={(e) => handleContentUpdate('studio', "team_name", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Team Role</label>
                  <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-mono text-sm" value={content.studio.team_role} onChange={(e) => handleContentUpdate('studio', "team_role", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Location City</label>
                  <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-mono text-sm" value={content.studio.location_city} onChange={(e) => handleContentUpdate('studio', "location_city", e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Location Desc</label>
                  <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-mono text-sm" value={content.studio.location_desc} onChange={(e) => handleContentUpdate('studio', "location_desc", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && content && (
          <div className="bg-[#0a0a0a] border border-white/10 p-8">
            <h3 className="text-xl font-oswald uppercase mb-6 flex items-center gap-2"><Mail size={20} /> Contact Info</h3>
            <div className="grid gap-6">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Email Address</label>
                <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-oswald text-xl" value={content.contact.email} onChange={(e) => handleContentUpdate('contact', "email", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Instagram URL</label>
                <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-mono text-sm text-neutral-400" value={content.contact.instagram} onChange={(e) => handleContentUpdate('contact', "instagram", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">Twitter URL</label>
                <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-mono text-sm text-neutral-400" value={content.contact.twitter} onChange={(e) => handleContentUpdate('contact', "twitter", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-500 font-mono tracking-widest">LinkedIn URL</label>
                <input className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-1 font-mono text-sm text-neutral-400" value={content.contact.linkedin} onChange={(e) => handleContentUpdate('contact', "linkedin", e.target.value)} />
              </div>
            </div>
          </div>
        )}

      </div>

      <Modal isOpen={isDeleteModalOpen} title="PERMANENT DELETION" description="This action will wipe the project from the database memory. This cannot be undone." confirmLabel="DELETE" cancelLabel="ABORT" isDestructive onConfirm={executeDelete} onCancel={() => setIsDeleteModalOpen(false)} />
      {cropperSrc && <ImageCropper imageSrc={cropperSrc} onCropComplete={handleCropComplete} onCancel={() => setCropperSrc(null)} />}
    </main>
  );
}
