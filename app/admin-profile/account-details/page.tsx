"use client";
import React, { useState, useEffect } from "react";

import Switch from "@/components/custom_ui/Switch";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import UnifiedSidebar from "@/components/custom_ui/UnifiedSidebar";

export default function AccountPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  // All profile fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [stream, setStream] = useState("");
  const [degree, setDegree] = useState("");
  const [course, setCourse] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [college, setCollege] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const res = await fetch('/api/get-profile');
      if (res.ok) {
        const data = await res.json();
        if (data.name) {
          setFirstName(data.name.split(' ')[0] || "");
          setLastName(data.name.split(' ').slice(1).join(' ') || "");
        }
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setDob(data.dob || "");
        setGender(data.gender || "");
        setStream(data.stream || "");
        setDegree(data.degree || "");
        setCourse(data.course || "");
        setState(data.state || "");
        setCity(data.city || "");
        setCollege(data.college || "");
        setRole(data.role || "");
        setImage(data.image || "");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName + (lastName ? " " + lastName : ""),
          email,
          phone,
          dob,
          gender,
          stream,
          degree,
          course,
          state,
          city,
          college,
          role,
          image,
        }),
      });
      if (res.ok) {
        toast.success("Profile updated successfully!");
        setEditing(false);
        // Refetch profile to update UI
        const updated = await fetch('/api/get-profile');
        if (updated.ok) {
          const data = await updated.json();
          if (data.name) {
            setFirstName(data.name.split(' ')[0] || "");
            setLastName(data.name.split(' ').slice(1).join(' ') || "");
          }
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setDob(data.dob || "");
          setGender(data.gender || "");
          setStream(data.stream || "");
          setDegree(data.degree || "");
          setCourse(data.course || "");
          setState(data.state || "");
          setCity(data.city || "");
          setCollege(data.college || "");
          setRole(data.role || "");
          setImage(data.image || "");
        }
      } else {
        toast.error("Failed to update profile.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    // Reset fields to last loaded profile
    setEditing(false);
    // Optionally, you can refetch the profile to reset all fields
    // Or, store the last loaded profile in a ref/state and reset from that
  };


  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition">
      {/* Sidebar (absolute for overlay, sticky for desktop) */}
      <UnifiedSidebar />
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden min-h-screen">
        <div className="absolute top-4 right-4 z-10"><Switch /></div>
        <div className="w-full max-w-2xl bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-[0_0_24px_3px_rgba(99,102,241,0.28)] p-8 mx-auto backdrop-blur-[3px]">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">Account Details</h2>
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block mb-1 font-medium">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  disabled={!editing}
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-1 font-medium">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  disabled={!editing}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={!editing}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input
                type="tel"
                className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Date of Birth</label>
              <input
                type="date"
                className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={dob}
                onChange={e => setDob(e.target.value)}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Gender</label>
              <select
                className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={gender}
                onChange={e => setGender(e.target.value)}
                disabled={!editing}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Stream</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={stream}
                onChange={e => setStream(e.target.value)}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Degree</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={degree}
                onChange={e => setDegree(e.target.value)}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Course</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={course}
                onChange={e => setCourse(e.target.value)}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">State</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={state}
                onChange={e => setState(e.target.value)}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">City</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={city}
                onChange={e => setCity(e.target.value)}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">College</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={college}
                onChange={e => setCollege(e.target.value)}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Role</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={role}
                onChange={e => setRole(e.target.value)}
                disabled={!editing}
              />
            </div>
            <div className="flex gap-4 justify-end mt-8">
              {!editing ? (
                <button
                  type="button"
                  className="py-2 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="py-2 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-70"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="py-2 px-8 rounded-full bg-zinc-300 dark:bg-zinc-700 text-zinc-900 dark:text-white font-semibold transition"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
