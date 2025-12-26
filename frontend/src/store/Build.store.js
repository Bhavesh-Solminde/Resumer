import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

// --- HELPERS: TRANSFORM DATA FORMATS ---

// Convert Backend Array ["A", "B"] -> Frontend String "A, B"
const arrayToString = (arr) => {
  if (Array.isArray(arr)) return arr.join(", ");
  return "";
};

// Convert Frontend String "A, B" -> Backend Array ["A", "B"]
const stringToArray = (str) => {
  if (!str) return [];
  return str
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const useBuildStore = create((set, get) => ({
  isSaving: false,
  isFetching: true,
  resumeId: null,

  // FLAT FRONTEND STRUCTURE
  formData: {
    name: "",
    contact: {
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
    },
    education: [],
    skills: { Languages: "", Frameworks: "", Tools: "", Databases: "" },
    projects: [],
  },

  // --- ACTIONS ---

  // 1. INITIALIZE (Load or Create)
  initializeEditor: async (id = null) => {
    set({ isFetching: true });
    try {
      if (id) {
        // A. LOAD EXISTING
        const res = await axiosInstance.get(`/resume/build/${id}`); // Corrected route
        const content = res.data.data.content || {};
        const personal = content.personalInfo || {};
        const skills = content.skills || {};

        // TRANSFORM: Backend -> Frontend
        const flatData = {
          name: personal.fullName || "",
          contact: {
            email: personal.email || "",
            phone: personal.phone || "",
            location: personal.address || "", // Mapped from 'address'
            website: personal.website || "",
            linkedin: personal.linkedin || "",
            github: personal.github || "",
          },
          education: content.education || [],
          // Convert Arrays to Strings for the Form
          skills: {
            Languages: arrayToString(skills.languages),
            Frameworks: arrayToString(skills.frameworks),
            Tools: arrayToString(skills.tools),
            Databases: arrayToString(skills.databases), // If you have this
          },
          projects: content.projects || [],
        };

        set({ formData: flatData, resumeId: id });
      } else {
        // B. CREATE NEW
        const res = await axiosInstance.post("/resume/build", {
          title: "Untitled Resume",
        });
        set({ resumeId: res.data.data._id });
        // Keep default formData
      }
    } catch (error) {
      toast.error("Failed to load editor");
      console.error(error);
    } finally {
      set({ isFetching: false });
    }
  },

  // 2. UPDATE + AUTO-SAVE
  updateResumeState: (newData) => {
    // A. Update UI Instantly
    set({ formData: newData, isSaving: true });

    // B. Backup to LocalStorage
    localStorage.setItem("resume-draft", JSON.stringify(newData));

    // C. Debounce Save
    if (get().saveTimeoutId) clearTimeout(get().saveTimeoutId);

    const timeoutId = setTimeout(async () => {
      const currentId = get().resumeId;
      if (!currentId) return;

      // TRANSFORM: Frontend -> Backend
      const backendPayload = {
        content: {
          personalInfo: {
            fullName: newData.name,
            email: newData.contact.email,
            phone: newData.contact.phone,
            address: newData.contact.location,
            website: newData.contact.website,
            linkedin: newData.contact.linkedin,
            github: newData.contact.github,
          },
          education: newData.education,
          // Convert Strings back to Arrays
          skills: {
            languages: stringToArray(newData.skills.Languages),
            frameworks: stringToArray(newData.skills.Frameworks),
            tools: stringToArray(newData.skills.Tools),
            databases: stringToArray(newData.skills.Databases),
          },
          projects: newData.projects,
        },
      };

      try {
        // NOTE: Based on your screenshot, if your backend expects { data: { ... } },
        // change this line. But usually, req.body is standard.
        await axiosInstance.put(`/resume/build/${currentId}`, backendPayload);
        set({ isSaving: false });
        console.log("Auto-saved");
      } catch (error) {
        console.error("Auto-save failed", error);
        set({ isSaving: false });
      }
    }, 2000); // 2 seconds delay

    set({ saveTimeoutId: timeoutId });
  },
}));
