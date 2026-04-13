import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getStoredExams, saveExams } from "../data/configDatabase";
import templateSchema from "../data/masterSchema.json";
import {
  Save,
  AlertCircle,
  Settings,
  ShieldAlert,
  GraduationCap,
  Link2,
  PlusCircle,
  CalendarPlus,
  Trash2,
  Briefcase,
  IndianRupee,
  UploadCloud,
  Link,
  Type,
  Image,
  Binary,
  FileText,
  Users,
  Calendar,
  Flag,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ListPlus,
  Plus,
  ChevronRight,
  ChevronLeft,
  Map,
  BookOpen,
  Clock,
  CreditCard,
  BarChart3,
  Info,
  Video,
  GripVertical,
  ExternalLink,
  LayoutGrid,
  Layout,
  X,
  Hash,
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

const NURSING_DATE_TEMPLATES = [
  {
    label: "Online Application Start Date",
    cta_text: "Secure your spot – Start Application",
    icon: Calendar,
  },
  {
    label: "Registration Last Date",
    cta_text: "Don't miss out – Apply Now",
    icon: Flag,
  },
  {
    label: "Admit Card Release Date",
    cta_text: "Ready for Battle? Get Admit Card",
    icon: FileText,
  },
  {
    label: "Exam Date (Written/CBT)",
    cta_text: "The Big Day – Good luck!",
    icon: CheckCircle2,
  },
];

const NURSING_LANGUAGES = [
  "Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", 
  "Kannada", "Odia", "Malayalam", "Punjabi", "Assamese", "Maithili", 
  "Santali", "Kashmiri", "Nepali", "Konkani", "Sindhi", "Dogri", 
  "Manipuri", "Sanskrit", "Bodo"
];

export default function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [timelineErrors, setTimelineErrors] = useState({});
  const [activeExamId, setActiveExamId] = useState(null);
  const [activeSection, setActiveSection] = useState("identity");
  const [isSaved, setIsSaved] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [notificationInputMode, setNotificationInputMode] = useState("link");
  const [logoInputMode, setLogoInputMode] = useState("link");
  const [previewDob, setPreviewDob] = useState("");
  const [lastSavedExams, setLastSavedExams] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [showGlobalPreview, setShowGlobalPreview] = useState(false);
  const [activeTimelineHud, setActiveTimelineHud] = useState({ index: null, type: null });

  // HUD Testing State
  const [hudGender, setHudGender] = useState("Male");
  const [hudCategory, setHudCategory] = useState("UR");
  const [hudPwBD, setHudPwBD] = useState(false);
  const [hudMaritalStatus, setHudMaritalStatus] = useState("Unmarried");
  const [hudIsEsm, setHudIsEsm] = useState(false);
  const [hudEsmService, setHudEsmService] = useState(0);
  const [hudIsGovtEmployee, setHudIsGovtEmployee] = useState(false);
  const [hudResult, setHudResult] = useState(null);

  const HS_SUBJECTS = [
    "Physics",
    "Chemistry",
    "Biology",
    "Mathematics",
    "English",
  ];
  const COMMON_STATES = [
    "All India / INC",
    "Bihar",
    "Delhi",
    "Haryana",
    "Madhya Pradesh",
    "Rajasthan",
    "Uttar Pradesh",
    "West Bengal",
  ];

  const handleHSSubjectToggle = (subject) => {
    updateExamData((prev) => {
      const subjects = prev.hs_subjects || [];
      const newSubjects = subjects.includes(subject)
        ? subjects.filter((s) => s !== subject)
        : [...subjects, subject];
      return { ...prev, hs_subjects: newSubjects };
    });
  };

  const applyHSShortcut = (type) => {
    let subjects = [];
    if (type === "PCB") subjects = ["Physics", "Chemistry", "Biology"];
    if (type === "PCM") subjects = ["Physics", "Chemistry", "Mathematics"];
    if (type === "PCMB")
      subjects = ["Physics", "Chemistry", "Mathematics", "Biology"];
    updateExamData((prev) => ({
      ...prev,
      hs_subjects: subjects,
      hs_science_required: true,
      academic_baseline: '12th_science'
    }));
  };

  useEffect(() => {
    const stored = getStoredExams();
    setExams(stored);
    setLastSavedExams(JSON.parse(JSON.stringify(stored)));
  }, []);

  const isDirty = JSON.stringify(exams) !== JSON.stringify(lastSavedExams);
  const activeExam = exams.find((e) => e.id === activeExamId);

  useEffect(() => {
    if (activeExam?.metadata?.notification_url?.startsWith("data:"))
      setNotificationInputMode("upload");
    else setNotificationInputMode("link");

    if (activeExam?.metadata?.image_url?.startsWith("data:"))
      setLogoInputMode("upload");
    else setLogoInputMode("link");
  }, [activeExamId]);

  const updateExamData = (updaterFn) => {
    setExams((prev) => prev.map((e) => (e.id === activeExamId ? updaterFn(e) : e)));
    setIsSaved(false);
    setUploadError("");
  };

  const createNewExam = () => {
    const newId = `exam-${Date.now()}`;
    const newExam = JSON.parse(JSON.stringify(templateSchema));
    newExam.id = newId;

    newExam.metadata.important_dates = NURSING_DATE_TEMPLATES.map((t, idx) => ({
      ...t,
      template_label: t.label, // Use as placeholder
      label: "", // Empty for custom input
      id: Date.now() + idx + Math.random(),
      date: "",
      action_url: "",
      cta_text: t.cta_text || "",
      resources: {
        video: { url: "", title: "" },
        upsell: { url: "", title: "" },
        guide: { url: "", title: "" },
      },
    }));

    setExams([...exams, newExam]);
    setActiveExamId(newId);
    setActiveSection("identity");
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    const val =
      name === "total_vacancies"
        ? value === ""
          ? ""
          : Math.max(0, Number(value))
        : value;
    updateExamData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [name]: val },
    }));
  };

  const handleCategoryVacancyChange = (index, field, value) => {
    updateExamData((prev) => {
      const vacancies = [...(prev.metadata.category_vacancies || [])];
      vacancies[index] = {
        ...vacancies[index],
        [field]: field === "count" ? (value === "" ? "" : Math.max(0, Number(value))) : value,
      };
      return {
        ...prev,
        metadata: { ...prev.metadata, category_vacancies: vacancies },
      };
    });
  };

  const addCategoryVacancy = () => {
    updateExamData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        category_vacancies: [
          ...(prev.metadata.category_vacancies || []),
          { category: "", count: "" },
        ],
      },
    }));
  };

  const removeCategoryVacancy = (index) => {
    updateExamData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        category_vacancies: prev.metadata.category_vacancies.filter((_, i) => i !== index),
      },
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 2000000) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      updateExamData((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, image_url: reader.result },
      }));
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 4000000) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      updateExamData((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, notification_url: reader.result },
      }));
    reader.readAsDataURL(file);
  };

  const handleImportantDateChange = (index, field, value) => {
    updateExamData((prev) => {
      const dates = [...(prev.metadata.important_dates || [])];
      if (field.includes(".")) {
        const parts = field.split(".");
        let current = { ...dates[index] };
        let target = current;
        for (let i = 0; i < parts.length - 1; i++) {
          target[parts[i]] = { ...(target[parts[i]] || {}) };
          target = target[parts[i]];
        }
        target[parts[parts.length - 1]] = value;
        dates[index] = current;
      } else {
        dates[index] = { ...dates[index], [field]: value };
      }
      if (field === "label") {
        const template = NURSING_DATE_TEMPLATES.find((t) => t.label === value);
        if (template) dates[index].cta_text = template.cta_text;
      }
      return {
        ...prev,
        metadata: { ...prev.metadata, important_dates: dates },
      };
    });
  };

  const addImportantDate = (label = "") =>
    updateExamData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        important_dates: [
          ...(prev.metadata.important_dates || []),
          {
            template_label: label || "New Event",
            label: "",
            date: "",
            action_url: "",
            cta_text: label
              ? NURSING_DATE_TEMPLATES.find((t) => t.label === label)
                  ?.cta_text || ""
              : "",
            resources: {
              video: { url: "", title: "" },
              upsell: { url: "", title: "" },
              guide: { url: "", title: "" },
            },
            has_time_limit: false,
            start_time: "",
            end_time: "",
            id: Date.now() + Math.random(),
          },
        ],
      },
    }));

  const removeImportantDate = (index) =>
    updateExamData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        important_dates: prev.metadata.important_dates.filter(
          (_, i) => i !== index,
        ),
      },
    }));

  const reorderImportantDates = (newOrder) =>
    updateExamData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, important_dates: newOrder },
    }));

  const handleTextChange = (e) =>
    updateExamData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const toggleTargetLanguage = (lang) => {
    updateExamData((prev) => {
      const current = prev.target_languages || [];
      const next = current.includes(lang)
        ? current.filter((l) => l !== lang)
        : [...current, lang];
      return { ...prev, target_languages: next };
    });
  };

  const handleNumberChange = (e) =>
    updateExamData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
    }));
  const handleCheckbox = (e) =>
    updateExamData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));

  const handleCategoryRelaxation = (category, value) => {
    const val = value === "" ? "" : Math.max(0, Number(value));
    updateExamData((prev) => ({
      ...prev,
      category_relaxations: { ...prev.category_relaxations, [category]: val },
    }));
  };

  const handleDegreeChange = (degree, field, value) => {
    // Auto-close drawer/popup if the degree being deselected is the one being configured
    if (field === "allowed" && !value && selectedDegree?.id === degree) {
      setSelectedDegree(null);
    }

    updateExamData((prev) => ({
      ...prev,
      degrees: {
        ...prev.degrees,
        [degree]: {
          ...prev.degrees[degree],
          [field]: value,
          registration_protocol: prev.degrees[degree]?.registration_protocol || {
            scope: "any",
            state: "",
            permanent_only: true,
          },
        },
      },
    }));
  };

  const handleRegistrationProtocolChange = (degree, field, value) => {
    updateExamData((prev) => {
      const degrees = { ...(prev.degrees || {}) };
      const protocol = {
        ...(degrees[degree]?.registration_protocol || {
          scope: "any",
          state: "",
          permanent_only: true,
        }),
      };
      protocol[field] = value;
      degrees[degree] = { ...degrees[degree], registration_protocol: protocol };
      return { ...prev, degrees };
    });
  };

  const handleUpdateFeeCategory = (id, field, value) => {
    updateExamData((prev) => {
      const matrix = prev.fee_matrix || { categories: [] };
      const categories = [...(matrix.categories || [])];
      const index = categories.findIndex((c) => c.id === id);
      if (index !== -1) {
        categories[index] = { ...categories[index], [field]: value };
        // If set to waived, clear the amount
        if (field === "waived" && value === true) {
          categories[index].amount = "";
        }
      }
      return { ...prev, fee_matrix: { ...matrix, categories } };
    });
  };

  const handleAddFeeCategory = () => {
    updateExamData((prev) => {
      const matrix = prev.fee_matrix || { categories: [] };
      const newCategory = {
        id: `custom-${Date.now()}`,
        label: "New Category",
        amount: 0,
        waived: false,
        active: true,
        is_custom: true,
      };
      return {
        ...prev,
        fee_matrix: {
          ...matrix,
          categories: [...(matrix.categories || []), newCategory],
        },
      };
    });
  };

  const handleRemoveFeeCategory = (id) => {
    updateExamData((prev) => ({
      ...prev,
      fee_matrix: {
        ...prev.fee_matrix,
        categories: (prev.fee_matrix.categories || []).filter((c) => c.id !== id),
      },
    }));
  };

  const calculatePreviewAge = (dob, cutoff) => {
    if (!dob || !cutoff) return null;
    const b = new Date(dob),
      t = new Date(cutoff);
    if (isNaN(b.getTime()) || isNaN(t.getTime())) return null;
    let y = t.getFullYear() - b.getFullYear(),
      m = t.getMonth() - b.getMonth(),
      d = t.getDate() - b.getDate();
    if (d < 0) {
      m--;
      d += new Date(t.getFullYear(), t.getMonth(), 0).getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }
    return { y, m, d };
  };

  const checkHudEligibility = () => {
    if (!previewDob || !activeExam.as_on_date) {
      setHudResult({ status: "error", message: "Set DOB & Cut-off" });
      return;
    }
    const age = calculatePreviewAge(previewDob, activeExam.as_on_date);
    if (!age) return;

    // 1. Base Max Determination
    let baseMax = activeExam.base_age_max_male || 0;
    if (hudGender === "Female" && activeExam.has_female_specific_age) {
      baseMax = activeExam.base_age_max_female || baseMax;
    }

    // 2. Relaxations (Category & PwBD)
    let boost = activeExam.category_relaxations?.[hudCategory] || 0;
    if (hudPwBD) {
      const pwbdBoost =
        activeExam.pwbd_relaxations?.[
          hudCategory === "SC_ST" ? "SC" : hudCategory
        ] || 10;
      boost = Math.max(boost, pwbdBoost);
    }

    let finalMax = baseMax + boost;
    if (hudPwBD && activeExam.pwbd_max_age_ceiling) {
      finalMax = Math.min(finalMax, activeExam.pwbd_max_age_ceiling);
    }

    // 3. Military Service Deduction (ESM Logic)
    let effectiveAge = age.y;
    if (hudIsEsm && activeExam.has_esm_relaxation) {
      const service = Number(hudEsmService) || 0;
      const grace = activeExam.esm_grace_period || 0;
      effectiveAge = age.y - service - grace;

      // Apply ESM Ceiling: It effectively defines the new finalMax for this group
      if (activeExam.esm_max_age_ceiling) {
        finalMax = Math.max(finalMax, activeExam.esm_max_age_ceiling);
      }
    }

    // 4. Min Determination (Inheritance Logic)
    let finalMin = activeExam.base_age_min || 18;
    if (
      hudGender === "Female" &&
      activeExam.has_female_specific_age &&
      activeExam.base_age_min_female
    ) {
      finalMin = activeExam.base_age_min_female;
    }

    const isUnder = effectiveAge < finalMin;
    const isOver = effectiveAge > finalMax;

    // 5. Marital Gate
    let maritalFail = false;
    if (
      activeExam.has_marital_restriction &&
      activeExam.allowed_marital_statuses?.length > 0
    ) {
      if (!activeExam.allowed_marital_statuses.includes(hudMaritalStatus))
        maritalFail = true;
    }

    // 6. Govt Job Caution (Regulatory Soft-Flag)
    let cautionMessage = null;
    if (activeExam.show_govt_caution && hudIsGovtEmployee) {
      cautionMessage = "Check your Specific Group (B/C/D) eligibility in notification.";
    }

    if (isUnder)
      setHudResult({
        status: "fail",
        message: `Underage (${effectiveAge} < ${finalMin})`,
      });
    else if (isOver)
      setHudResult({
        status: "fail",
        message: `Overage (${effectiveAge} > ${finalMax})`,
      });
    else if (maritalFail)
      setHudResult({ status: "fail", message: `Invalid Marital Status` });
    else
      setHudResult({
        status: "pass",
        message: `ELIGIBLE (${effectiveAge}y)`,
        caution: cautionMessage,
      });
  };

  const saveConfig = () => {
    try {
      saveExams(exams);
      setLastSavedExams(JSON.parse(JSON.stringify(exams)));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      setUploadError("Failed: " + err.message);
    }
  };

  const discardChanges = () => {
    if (
      window.confirm(
        "This will undo all your changes since you last saved. Are you sure?",
      )
    ) {
      setExams(JSON.parse(JSON.stringify(lastSavedExams)));
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm("You haven't saved yet — leave anyway?"))
      return;
    setActiveExamId(null);
  };

  // --- REAL-TIME VISUALIZATION COMPONENTS ---

  const renderLiveStudentCardHUD = () => (
    <div
      style={{
        marginTop: "1.25rem",
        paddingTop: "1.25rem",
        borderTop: "1px dashed var(--border-strong)",
        display: "grid",
        gridTemplateColumns: "1fr 340px",
        gap: "1.25rem",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "1.25rem",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 900,
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              letterSpacing: "0.05em",
            }}
          >
            HUD Control Panel (Test Engine)
          </span>
        </div>
        <div
          className="card"
          style={{
            background: "white",
            padding: "0.9rem",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.6rem",
              marginBottom: "0.6rem",
            }}
          >
            <div>
              <label className="form-label" style={{ fontSize: "0.7rem" }}>
                Test Gender
              </label>
              <select
                className="form-select"
                value={hudGender}
                onChange={(e) => setHudGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="form-label" style={{ fontSize: "0.7rem" }}>
                Test Category
              </label>
              <select
                className="form-select"
                value={hudCategory}
                onChange={(e) => setHudCategory(e.target.value)}
              >
                <option value="UR">UR</option>
                <option value="OBC">OBC</option>
                <option value="SC_ST">SC/ST</option>
                <option value="EWS">EWS</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "0.6rem",
              marginBottom: "0.6rem",
            }}
          >
            <div
              className="input-with-icon"
              style={{
                background: "var(--bg-app-subtle)",
                borderRadius: "12px",
                border: "1px solid var(--border-subtle)",
                padding: "4px 10px",
              }}
            >
              <Calendar size={14} style={{ opacity: 0.4 }} />
              <input
                type="date"
                className="form-input"
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
                value={previewDob}
                onChange={(e) => setPreviewDob(e.target.value)}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 10px",
                background: "var(--bg-app-subtle)",
                borderRadius: "12px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <input
                type="checkbox"
                checked={hudPwBD}
                onChange={(e) => setHudPwBD(e.target.checked)}
              />
              <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>PwBD</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.6rem",
              marginBottom: "0.9rem",
              alignItems: "center",
            }}
          >
            {activeExam.has_esm_relaxation && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 12px",
                  background: "var(--accent-primary-bg)",
                  borderRadius: "12px",
                  border: "1px solid var(--accent-primary-subtle)",
                }}
              >
                <input
                  type="checkbox"
                  checked={hudIsEsm}
                  onChange={(e) => setHudIsEsm(e.target.checked)}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    color: "var(--accent-primary)",
                  }}
                >
                  ESM
                </span>
                {hudIsEsm && (
                  <input
                    type="number"
                    placeholder="Yrs"
                    className="form-input"
                    style={{
                      width: "60px",
                      height: "24px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                    }}
                    value={hudEsmService}
                    onChange={(e) => setHudEsmService(e.target.value)}
                  />
                )}
              </div>
            )}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                background: "var(--bg-app-subtle)",
                borderRadius: "12px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <input
                type="checkbox"
                checked={hudIsGovtEmployee}
                onChange={(e) => setHudIsGovtEmployee(e.target.checked)}
              />
              <span style={{ fontSize: "0.75rem", fontWeight: 800 }}>
                Govt. Employee
              </span>
            </div>
            {activeExam.has_marital_restriction && (
              <div style={{ flex: 1 }}>
                <select
                  className="form-select"
                  style={{ height: "36px", fontSize: "0.7rem" }}
                  value={hudMaritalStatus}
                  onChange={(e) => setHudMaritalStatus(e.target.value)}
                >
                  <option value="Unmarried">Unmarried</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widow">Widow</option>
                </select>
              </div>
            )}
          </div>

          <button
            className="btn btn-primary"
            style={{
              width: "100%",
              borderRadius: "12px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
            onClick={checkHudEligibility}
          >
            Run Simulation
          </button>
        </div>
      </div>

      <div
        style={{
          background: "var(--bg-app)",
          padding: "1rem",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <motion.div
          layout
          style={{
            width: "300px",
            background: "white",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.12)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "var(--bg-app-subtle)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {activeExam.metadata?.image_url ? (
                  <img
                    src={activeExam.metadata.image_url}
                    alt=""
                    style={{ width: "32px" }}
                  />
                ) : (
                  <LayoutGrid size={24} color="var(--accent-primary)" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 900,
                    lineHeight: 1.2,
                  }}
                >
                  {activeExam.metadata?.exam_name || "New exam"}
                </h3>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "var(--accent-primary)",
                    textTransform: "uppercase",
                  }}
                >
                  {activeExam.is_state_exam
                    ? activeExam.exam_state
                    : "National Central"}
                  {activeExam.metadata?.notification_status === "short" && " • [ UPCOMING ]"}
                </span>
              </div>
            </div>

            <div
              style={{
                padding: "1rem",
                background:
                  hudResult?.status === "pass"
                    ? "var(--accent-primary-bg)"
                    : hudResult?.status === "fail"
                      ? "var(--accent-danger-bg)"
                      : "var(--bg-app-subtle)",
                borderRadius: "16px",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "var(--text-tertiary)",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Verdict
              </span>
              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  color:
                    hudResult?.status === "pass"
                      ? "var(--accent-primary)"
                      : hudResult?.status === "fail"
                        ? "var(--accent-danger)"
                        : "var(--text-primary)",
                }}
              >
                {hudResult ? hudResult.message : "Ready for Test"}
              </span>
              {hudResult?.caution && (
                <div
                  className="badge-caution"
                  style={{
                    marginTop: "12px",
                    textAlign: "left",
                    fontSize: "0.7rem",
                    lineHeight: 1.2,
                    textTransform: "none",
                  }}
                >
                  <AlertCircle size={14} />
                  {hudResult.caution}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: hudGender === "Female" ? "#ec4899" : "#3b82f6",
                }}
              ></div>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--text-tertiary)",
                }}
              >
                {hudCategory} {hudPwBD ? "+PwBD" : ""} {hudIsEsm ? "+ESM" : ""}
              </span>
            </div>
            <BarChart3 size={16} color="var(--border-strong)" />
          </div>
        </motion.div>
      </div>
    </div>
  );



  const renderSectionHeader = (title, subtitle, Icon) => (
    <div
      className="section-header"
      style={{
        marginBottom: "1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          background: "var(--accent-primary-bg)",
          color: "var(--accent-primary)",
          padding: "8px",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} />
      </div>
      <div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "var(--text-primary)",
            lineHeight: 1.3,
          }}
        >
          {title}
        </h2>
        <p
          style={{
            marginTop: "2px",
            color: "var(--text-tertiary)",
            fontWeight: 400,
            fontSize: "0.8rem",
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );

  const renderIdentityHub = () => {
    const totalCategorySum = (activeExam.metadata?.category_vacancies || [])
      .reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);
    const totalAllowed = Number(activeExam.metadata?.total_vacancies) || 0;
    const isOverLimit = totalCategorySum > totalAllowed;

    return (
      <div className="animate-in">
        {renderSectionHeader(
          "Exam details",
          "Add the basic info — you'll find all of this on page 1 of the notification.",
          LayoutGrid,
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Row 0: Status toggle — first thing admin sees */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "white",
              padding: "0.6rem 0.75rem",
              borderRadius: "10px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <label className="form-label" style={{ fontSize: "0.7rem", fontWeight: 700, marginBottom: 0, color: "var(--text-secondary)" }}>Notification status</label>
            <div
              onClick={() => updateExamData(prev => ({
                ...prev,
                metadata: {
                  ...prev.metadata,
                  notification_status: prev.metadata.notification_status === "short" ? "detailed" : "short"
                }
              }))}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                cursor: 'pointer', userSelect: 'none',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: activeExam.metadata?.notification_status === "short" ? "var(--accent-primary)" : "var(--text-tertiary)", opacity: activeExam.metadata?.notification_status === "short" ? 1 : 0.4 }}>Tentative</span>
              <div style={{ width: '32px', height: '17px', background: activeExam.metadata?.notification_status === "detailed" ? "var(--accent-primary)" : "var(--border-strong)", borderRadius: '20px', position: 'relative', transition: 'background 0.2s', padding: '2px' }}>
                <motion.div initial={false} animate={{ x: activeExam.metadata?.notification_status === "detailed" ? 15 : 0 }} style={{ width: '13px', height: '13px', background: 'white', borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: activeExam.metadata?.notification_status === "detailed" ? "var(--accent-primary)" : "var(--text-tertiary)", opacity: activeExam.metadata?.notification_status === "detailed" ? 1 : 0.4 }}>Official</span>
            </div>
          </div>

          {/* Row 1: Exam Name + Pay Scale */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: "1rem",
              background: "white",
              padding: "0.75rem",
              borderRadius: "12px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div>
              <label className="form-label" style={{ fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.3rem" }}>Exam name</label>
              <input
                type="text"
                name="exam_name"
                className="form-input"
                style={{ fontSize: "0.9rem", fontWeight: 700, background: 'var(--bg-app-subtle)' }}
                placeholder="e.g. AIIMS NORCET 8.0"
                value={activeExam.metadata?.exam_name || ""}
                onChange={handleMetadataChange}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.3rem" }}>Pay scale</label>
              <div className="input-with-icon">
                <IndianRupee size={12} className="icon" style={{ color: 'var(--accent-primary)' }} />
                <input type="text" name="salary_range" className="form-input" style={{ fontWeight: 700, background: 'var(--bg-app-subtle)' }} placeholder="e.g., 12-13 Lakh per Annum" value={activeExam.metadata?.salary_range || ""} onChange={handleMetadataChange} />
              </div>
            </div>
          </div>

          {/* Row 2: Logo + Notification PDF */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ background: "white", padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <label className="form-label" style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-primary)", marginBottom: 0 }}>Exam logo</label>
                {activeExam.metadata?.image_url && (
                  <div style={{ width: "20px", height: "20px", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
                    <img src={activeExam.metadata.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </div>
                )}
                <div className="segmented-control" style={{ scale: "0.75", transformOrigin: "left", marginLeft: "auto" }}>
                  <button className={`segmented-btn ${logoInputMode === "link" ? "active" : ""}`} onClick={() => setLogoInputMode("link")}>Link</button>
                  <button className={`segmented-btn ${logoInputMode === "upload" ? "active" : ""}`} onClick={() => setLogoInputMode("upload")}>Upload</button>
                </div>
              </div>
              {logoInputMode === "link" ? (
                <input className="form-input" placeholder="Logo URL" name="image_url" value={activeExam.metadata?.image_url && !activeExam.metadata?.image_url?.startsWith("data:") ? activeExam.metadata.image_url : ""} onChange={handleMetadataChange} />
              ) : (
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="form-input" />
              )}
            </div>

            <div style={{ background: "white", padding: "0.75rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <label className="form-label" style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-primary)", marginBottom: 0 }}>Notification PDF</label>
                <div className="segmented-control" style={{ scale: "0.75", transformOrigin: "left", marginLeft: "auto" }}>
                  <button className={`segmented-btn ${notificationInputMode === "link" ? "active" : ""}`} onClick={() => setNotificationInputMode("link")}>Link</button>
                  <button className={`segmented-btn ${notificationInputMode === "upload" ? "active" : ""}`} onClick={() => setNotificationInputMode("upload")}>Upload</button>
                </div>
              </div>
              {notificationInputMode === "link" ? (
                <input type="url" name="notification_url" className="form-input" value={activeExam.metadata?.notification_url && !activeExam.metadata?.notification_url?.startsWith("data:") ? activeExam.metadata.notification_url : ""} onChange={handleMetadataChange} placeholder="Notification URL" />
              ) : (
                <input type="file" accept="application/pdf" onChange={handleFileUpload} className="form-input" />
              )}
            </div>
          </div>

          {/* Row 3: Vacancies — at the bottom */}
          <div
            style={{
              background: "white",
              padding: "0.75rem",
              borderRadius: "12px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
              <label className="form-label" style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-primary)", marginBottom: 0 }}>Vacancies</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="number"
                  name="total_vacancies"
                  className="form-input"
                  style={{ width: "120px", fontWeight: 800, fontSize: '0.85rem', textAlign: "center" }}
                  placeholder="Total seats"
                  value={activeExam.metadata?.total_vacancies || ""}
                  onChange={handleMetadataChange}
                />
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700,
                  color: isOverLimit ? 'var(--accent-danger)' : 'var(--text-tertiary)',
                  background: isOverLimit ? 'var(--accent-danger-bg)' : 'var(--bg-app-subtle)',
                  padding: '3px 8px', borderRadius: '6px',
                  border: isOverLimit ? '1px solid var(--accent-danger)' : '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap'
                }}>
                  {isOverLimit && <AlertTriangle size={10} style={{ marginRight: '3px', verticalAlign: 'middle' }} />}
                  {totalCategorySum} / {totalAllowed || 0} allocated
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>Category-wise breakdown</span>
              </div>
              {(activeExam.metadata?.category_vacancies || []).map((cv, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={idx}
                  style={{
                    display: "grid", gridTemplateColumns: "1fr 100px 28px", gap: "0.4rem", alignItems: "center",
                    background: 'var(--bg-app-subtle)', padding: '2px 4px', borderRadius: '6px'
                  }}
                >
                  <input type="text" className="form-input" placeholder="Category (e.g., UR, OBC...)" style={{ fontSize: "0.8rem", fontWeight: 700, border: 'none', background: 'transparent' }} value={cv.category} onChange={(e) => handleCategoryVacancyChange(idx, "category", e.target.value)} />
                  <input type="number" className="form-input" placeholder="Count" style={{ fontSize: "0.8rem", fontWeight: 700, textAlign: 'center', border: 'none', background: 'transparent' }} value={cv.count} onChange={(e) => handleCategoryVacancyChange(idx, "count", e.target.value)} />
                  <button onClick={() => removeCategoryVacancy(idx)} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }} className="hover-danger"><Trash2 size={14} /></button>
                </motion.div>
              ))}
              <button className="btn" style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, background: 'white', color: 'var(--accent-primary)', border: '1px solid var(--border-subtle)', width: 'fit-content', borderRadius: '6px', marginTop: '0.2rem' }} onClick={addCategoryVacancy}><Plus size={12} /> Add category</button>
            </div>

            {isOverLimit && (
              <motion.div initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '0.5rem', padding: '6px 10px', background: 'var(--accent-danger-bg)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-danger)', fontSize: '0.7rem', fontWeight: 700 }}>
                <AlertTriangle size={12} />
                <span>Sum of categories ({totalCategorySum}) exceeds total vacancies ({totalAllowed}).</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderImportantDates = () => {
    const dates = activeExam.metadata?.important_dates || [];
    const filledCount = dates.filter(d => d.date || d.is_tentative).length;
    const allFilled = dates.length > 0 && filledCount === dates.length;
    const hasAnyDate = dates.some(d => d.date || d.label);

    return (
    <div className="animate-in">
      {renderSectionHeader(
        "Key dates",
        "Add the important dates from the notification — application, admit card, exam day, and more.",
        Clock,
      )}

      {/* Timeline Preview */}
      {hasAnyDate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            padding: "1rem 1.25rem",
            marginBottom: "0.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", color: "var(--text-tertiary)", letterSpacing: "0.05em" }}>Timeline preview</span>
            {allFilled && (
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-success)", display: "flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={10} /> All dates set
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", position: "relative", padding: "0 0.5rem" }}>
            {/* Connecting line */}
            <div style={{
              position: "absolute",
              top: "6px",
              left: `calc(0.5rem + 4px)`,
              right: `calc(0.5rem + 4px + ${(dates.length - 1) > 0 ? (100 - 100 / dates.length) : 0}% * 0)`,
              width: `calc(100% - 1rem - 8px)`,
              height: "2px",
              background: `linear-gradient(to right, ${dates.map((d, idx) => {
                const pct = (idx / Math.max(dates.length - 1, 1)) * 100;
                const color = d.date ? "var(--accent-primary)" : "var(--border-strong)";
                return `${color} ${pct}%`;
              }).join(", ")})`,
              borderRadius: "2px",
            }} />
            {dates.map((d, idx) => {
              const hasCta = d.cta_text && d.action_url;
              const hasDate = !!d.date;
              const displayLabel = d.label || d.template_label || "Untitled";
              const displayDate = d.is_tentative ? "TBA" : (d.date ? new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : "No date");
              return (
                <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: "12px", height: "12px", borderRadius: "50%",
                    background: hasDate || d.is_tentative ? "var(--accent-primary)" : "var(--border-strong)",
                    border: "2px solid white",
                    boxShadow: hasDate ? "0 0 0 2px var(--accent-primary-bg)" : "none",
                    transition: "all 0.3s ease",
                  }} />
                  <div style={{ textAlign: "center", maxWidth: "120px" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "110px" }}>{displayLabel}</div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 600, color: d.is_tentative ? "var(--accent-primary)" : (hasDate ? "var(--text-secondary)" : "var(--text-tertiary)") }}>{displayDate}</div>
                    {hasCta && <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--accent-success)", marginTop: "1px" }}>{d.cta_text}</div>}
                    {d.resources?.video?.url && <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--accent-primary)", marginTop: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px" }}><Video size={8} /> {d.resources?.video?.title || "Video"}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Edit rows — Option E compact */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem", padding: "0 0.25rem" }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Edit dates</span>
      </div>

      <div className="milestone-container" style={{ position: "relative" }}>
        <Reorder.Group
          axis="y"
          values={dates}
          onReorder={reorderImportantDates}
          style={{ padding: 0 }}
        >
          {dates.map((m, i) => {
            const isExpanded = activeTimelineHud.index === i;
            const hasTime = m.has_time_limit && m.start_time;
            const hasCta = m.cta_text && m.action_url;
            const hasVideo = m.resources?.video?.url;
            const displayDate = m.is_tentative ? "TBA" : (m.date ? new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "");

            return (
            <Reorder.Item
              key={m.id || i}
              value={m}
              style={{ listStyle: "none", marginBottom: "0.2rem", position: "relative", zIndex: isExpanded ? 2000 : 1 }}
            >
              {/* Compact row */}
              <motion.div
                layout
                style={{
                  display: "grid",
                  gridTemplateColumns: "24px 1fr 200px 1fr 20px",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.5rem 0.6rem",
                  background: isExpanded ? "var(--accent-primary-bg)" : "white",
                  borderRadius: isExpanded ? "8px 8px 0 0" : "8px",
                  border: "1px solid var(--border-subtle)",
                  borderBottom: isExpanded ? "none" : "1px solid var(--border-subtle)",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onClick={() => setActiveTimelineHud(isExpanded ? { index: null, type: null } : { index: i, type: 'all' })}
              >
                <div style={{ cursor: "grab", color: "var(--text-tertiary)", display: "flex" }} onClick={(e) => e.stopPropagation()}>
                  <GripVertical size={14} />
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: m.label ? "var(--text-primary)" : "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {m.label || m.template_label || "Untitled event"}
                </span>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: m.is_tentative ? "var(--text-tertiary)" : (m.date ? "var(--text-secondary)" : "var(--text-tertiary)") }}>
                  {m.is_tentative ? (
                    <span style={{ background: "var(--bg-app-subtle)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)" }}>TBA</span>
                  ) : (
                    <>
                      {displayDate || "No date"}
                      {hasTime && <span style={{ color: "var(--text-tertiary)", marginLeft: "6px" }}>{m.start_time}</span>}
                    </>
                  )}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                  {hasCta && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-success)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      <ExternalLink size={11} style={{ flexShrink: 0 }} /> {m.cta_text}
                    </span>
                  )}
                  {hasVideo && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      <Video size={11} style={{ flexShrink: 0 }} /> {m.resources?.video?.title || "Video"}
                    </span>
                  )}
                </div>
                <ChevronRight size={14} style={{ color: "var(--text-tertiary)", transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
              </motion.div>

              {/* Expanded edit panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{
                      overflow: 'hidden',
                      background: 'white',
                      borderRadius: '0 0 8px 8px',
                      border: '1px solid var(--border-subtle)',
                      borderTop: 'none',
                      padding: '0.6rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {/* Row 1: Event name */}
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Event name</label>
                      <input
                        className="form-input"
                        style={{ fontSize: "0.8rem", fontWeight: 700 }}
                        value={m.label || ""}
                        onChange={(e) => handleImportantDateChange(i, "label", e.target.value)}
                        placeholder={m.template_label || "Enter event name..."}
                      />
                    </div>
                    {/* Row 2: TBA + Date + Time */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                        <input type="checkbox" style={{ width: '14px', height: '14px' }} checked={m.is_tentative || false} onChange={(e) => handleImportantDateChange(i, "is_tentative", e.target.checked)} />
                        TBA
                      </label>
                      {m.is_tentative ? (
                        <div style={{ flex: 1, padding: "4px 8px", fontSize: "0.7rem", fontWeight: 800, textAlign: "center", background: "var(--bg-app-subtle)", color: "var(--accent-primary)", borderRadius: "6px", border: "1px dashed var(--accent-primary)" }}>To be announced</div>
                      ) : (
                        <input type="date" className="form-input" style={{ flex: 1, fontSize: "0.8rem", fontWeight: 700 }} value={m.date || ""} onChange={(e) => handleImportantDateChange(i, "date", e.target.value)} />
                      )}
                      <input type="time" className="form-input" style={{ width: "110px", fontWeight: 700, fontSize: "0.8rem" }} value={m.start_time || ""} onChange={(e) => { handleImportantDateChange(i, "start_time", e.target.value); if (!m.has_time_limit) handleImportantDateChange(i, "has_time_limit", true); }} disabled={m.is_tentative} placeholder="Time" />
                    </div>
                    {/* Row 3: CTA text + URL */}
                    <div>
                      <label className="form-label" style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>Action button (CTA)</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "0.5rem" }}>
                        <input className="form-input" placeholder="Button text (e.g. Apply Now)" value={m.cta_text || ""} onChange={(e) => handleImportantDateChange(i, "cta_text", e.target.value)} style={{ fontSize: "0.8rem" }} />
                        <input className="form-input" placeholder="Link URL (https://...)" value={m.action_url || ""} onChange={(e) => handleImportantDateChange(i, "action_url", e.target.value)} style={{ fontSize: "0.8rem" }} />
                      </div>
                    </div>
                    {/* Row 4: Video title + URL */}
                    <div>
                      <label className="form-label" style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>Prep video</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "0.5rem" }}>
                        <input className="form-input" placeholder="Video title (e.g. Strategy Guide)" value={m.resources?.video?.title || ""} onChange={(e) => handleImportantDateChange(i, "resources.video.title", e.target.value)} style={{ fontSize: "0.8rem" }} />
                        <input className="form-input" placeholder="YouTube URL (https://...)" value={m.resources?.video?.url || ""} onChange={(e) => handleImportantDateChange(i, "resources.video.url", e.target.value)} style={{ fontSize: "0.8rem" }} />
                      </div>
                    </div>
                    {/* Delete button */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button onClick={(e) => { e.stopPropagation(); removeImportantDate(i); }} style={{ padding: "4px 10px", fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-danger)", background: "var(--accent-danger-bg)", border: "1px solid var(--accent-danger)", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reorder.Item>
            );
          })}
        </Reorder.Group>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
          <button className="btn btn-primary" style={{ padding: "0.35rem 1rem", borderRadius: "16px", fontSize: "0.75rem" }} onClick={() => addImportantDate()}>
            <Plus size={14} /> Add date
          </button>
          {["Result", "Physical Test", "Interview", "Admit Card", "Exam Date", "Answer Key", "Merit List"].map((pill) => (
            <button key={pill} className="btn" style={{ height: "24px", padding: "0 0.6rem", fontSize: "0.7rem", borderRadius: "16px", background: "var(--bg-app-subtle)", border: "1px solid var(--border-subtle)" }} onClick={() => addImportantDate(pill)}>
              + {pill}
            </button>
          ))}
        </div>
      </div>
    </div>
    );
  };

  const UNIVERSAL_DEGREES = [
    { id: "bsc_nursing", label: "B.Sc. (Hons.) Nursing / B.Sc. Nursing" },
    { id: "post_basic_bsc", label: "B.Sc. (Post-Certificate) / Post-Basic B.Sc. Nursing" },
    { id: "gnm", label: "Diploma in General Nursing and Midwifery (G.N.M.)" },
    { id: "diploma_psychiatry", label: "Diploma in Psychiatry" }
  ];

  const renderEducation = () => (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {renderSectionHeader(
        "Qualifications",
        "Which degrees and experience does the notification accept? Set them here.",
        GraduationCap,
      )}

      {/* Row 1: Minimum education */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "white", padding: "0.6rem 0.75rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
        <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Minimum education</label>
        <select
          className="form-select"
          value={activeExam.hs_science_required ? '12th_science' : (activeExam.academic_baseline || '12th')}
          onChange={(e) => {
            const val = e.target.value;
            updateExamData(p => ({ ...p, academic_baseline: val, hs_science_required: val === '12th_science' }));
          }}
          style={{ width: "auto", fontWeight: 700 }}
        >
          <option value="10th">Matriculation (Standard 10th)</option>
          <option value="12th">Standard 10+2 (Higher Secondary)</option>
          <option value="12th_science">10+2 with Science (PCB Required)</option>
        </select>
      </div>

      {/* Row 2: Degrees — single-column accordion */}
      <div style={{ background: "white", borderRadius: "10px", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
        {UNIVERSAL_DEGREES.map((degMeta, idx) => {
          const d = degMeta.id;
          const isAuth = !!activeExam.degrees?.[d]?.allowed;
          const deg = activeExam.degrees?.[d] || {};
          const isExpanded = selectedDegree?.id === d;
          const scopeLabel = deg.registration_protocol?.scope === 'specific' ? deg.registration_protocol?.state : "National";

          return (
            <div key={d}>
              {idx > 0 && <div style={{ height: "1px", background: "var(--border-subtle)" }} />}
              {/* Collapsed row */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.5rem 0.75rem",
                  cursor: "pointer",
                  background: isExpanded ? "var(--accent-primary-bg)" : "transparent",
                  transition: "background 0.15s",
                }}
                onClick={() => {
                  if (isAuth) {
                    setSelectedDegree(isExpanded ? null : { id: d });
                  }
                }}
              >
                <div
                  onClick={(e) => { e.stopPropagation(); handleDegreeChange(d, "allowed", !isAuth); if (!isAuth) setSelectedDegree({ id: d }); if (isAuth && isExpanded) setSelectedDegree(null); }}
                  style={{ width: '28px', height: '15px', background: isAuth ? "var(--accent-primary)" : "rgba(0,0,0,0.12)", borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                >
                  <motion.div animate={{ x: isAuth ? 13 : 2 }} style={{ width: '11px', height: '11px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </div>
                <span style={{ flex: 1, fontSize: "0.8rem", fontWeight: isAuth ? 700 : 500, color: isAuth ? "var(--text-primary)" : "var(--text-tertiary)" }}>
                  {degMeta.label}
                </span>
                {isAuth && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", background: "var(--bg-app-subtle)", padding: "2px 6px", borderRadius: "4px" }}>{scopeLabel}</span>
                    {deg.requires_experience && (
                      <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--accent-success)", background: "var(--accent-success-bg)", padding: "2px 6px", borderRadius: "4px" }}>{deg.req_exp_months}m exp</span>
                    )}
                  </div>
                )}
                {isAuth && (
                  <ChevronRight size={14} style={{ color: "var(--text-tertiary)", transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }} />
                )}
              </div>

              {/* Expanded inline rules */}
              <AnimatePresence>
                {isExpanded && isAuth && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden", borderTop: "1px solid var(--border-subtle)" }}
                  >
                    <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.6rem", background: "var(--bg-app-subtle)" }}>
                      {/* Registration */}
                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "0.3rem" }}>Nursing council registration</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>
                            <input type="radio" checked={deg.registration_protocol?.scope !== 'specific'} onChange={() => handleRegistrationProtocolChange(d, "scope", "any")} />
                            Any State Council / INC
                          </label>
                          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>
                            <input type="radio" checked={deg.registration_protocol?.scope === 'specific'} onChange={() => handleRegistrationProtocolChange(d, "scope", "specific")} />
                            Specific state
                          </label>
                          {deg.registration_protocol?.scope === 'specific' && (
                            <select className="form-select" style={{ width: "auto", fontSize: "0.8rem" }} value={deg.registration_protocol?.state || ""} onChange={(e) => handleRegistrationProtocolChange(d, "state", e.target.value)}>
                              <option value="">Select state</option>
                              {COMMON_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          )}
                        </div>
                        {deg.registration_protocol?.scope === 'specific' && (
                          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)", marginTop: "0.3rem" }}>
                            <input type="checkbox" checked={deg.registration_protocol?.allow_inc_suitability || false} onChange={(e) => handleRegistrationProtocolChange(d, "allow_inc_suitability", e.target.checked)} />
                            Also accept INC-registered candidates
                          </label>
                        )}
                      </div>

                      {/* Clinical Experience */}
                      <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700 }}>
                            <input type="checkbox" style={{ width: '15px', height: '15px' }} checked={deg.requires_experience || false} onChange={(e) => handleDegreeChange(d, "requires_experience", e.target.checked)} />
                            Require clinical experience
                          </label>
                          {deg.requires_experience && (
                            <>
                              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Months</span>
                                <input type="number" className="form-input" style={{ width: "60px", fontWeight: 700, textAlign: "center" }} value={deg.req_exp_months || ""} onChange={(e) => handleDegreeChange(d, "req_exp_months", e.target.value)} placeholder="24" />
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Min. beds</span>
                                <input type="number" className="form-input" style={{ width: "60px", fontWeight: 700, textAlign: "center" }} value={deg.req_min_hospital_beds || ""} onChange={(e) => handleDegreeChange(d, "req_min_hospital_beds", e.target.value)} placeholder="50" />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderEducationRuleDrawer = () => null;

  // Remaining modular renderers kept legacy but consistent with the cockpit UI

  const toggleMaritalStatus = (status) => {
    const current = activeExam.allowed_marital_statuses || [];
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    updateExamData((p) => ({ ...p, allowed_marital_statuses: updated }));
  };

  const renderAgeLimits = () => {
    if (!activeExam) return null;

    const yrsSuffix = (color = "var(--text-tertiary)") => (
      <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', fontWeight: 700, color, pointerEvents: 'none' }}>yrs</span>
    );

    const toggle = (checked, onClick) => (
      <div onClick={onClick} style={{ width: '28px', height: '15px', background: checked ? "var(--accent-primary)" : "rgba(0,0,0,0.12)", borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
        <motion.div animate={{ x: checked ? 13 : 2 }} style={{ width: '11px', height: '11px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </div>
    );

    return (
      <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {renderSectionHeader(
          "Age rules",
          "Set the age limits and relaxations — you'll find these in the eligibility section of the notification.",
          Users,
        )}

        {/* Row 1: Reference date */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "white", padding: "0.6rem 0.75rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>Reference date</label>
          <input type="date" name="as_on_date" className="form-input" style={{ width: "180px", fontWeight: 700 }} value={activeExam.as_on_date || ""} onChange={handleTextChange} />
        </div>

        {/* Row 2: Age Range */}
        <div style={{ background: "white", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>Age range</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", display: "block", marginBottom: "0.2rem" }}>Minimum age</label>
              <div style={{ position: 'relative' }}>
                <input type="number" name="base_age_min" className="form-input" style={{ fontWeight: 700, paddingRight: '35px' }} value={activeExam.base_age_min ?? ""} onChange={handleNumberChange} />
                {yrsSuffix()}
              </div>
            </div>
            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", display: "block", marginBottom: "0.2rem" }}>Maximum age</label>
              <div style={{ position: 'relative' }}>
                <input type="number" name="base_age_max_male" className="form-input" style={{ fontWeight: 700, paddingRight: '35px' }} value={activeExam.base_age_max_male ?? ""} onChange={handleNumberChange} />
                {yrsSuffix()}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.4rem 0", borderTop: "1px solid var(--border-subtle)", marginTop: "0.25rem" }}>
            <input type="checkbox" style={{ width: '15px', height: '15px', cursor: 'pointer' }} checked={activeExam.has_female_specific_age || false} onChange={() => updateExamData((p) => ({ ...p, has_female_specific_age: !p.has_female_specific_age }))} />
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>Different limits for women</span>
          </div>

          {activeExam.has_female_specific_age && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.4rem", paddingTop: "0.4rem" }}>
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--accent-primary)", display: "block", marginBottom: "0.2rem" }}>Min. age (women)</label>
                <div style={{ position: 'relative' }}>
                  <input type="number" name="base_age_min_female" className="form-input" style={{ fontWeight: 700, paddingRight: '35px', borderColor: "var(--accent-primary)" }} placeholder={activeExam.base_age_min} value={activeExam.base_age_min_female ?? ""} onChange={handleNumberChange} />
                  {yrsSuffix("var(--accent-primary)")}
                </div>
              </div>
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--accent-primary)", display: "block", marginBottom: "0.2rem" }}>Max. age (women)</label>
                <div style={{ position: 'relative' }}>
                  <input type="number" name="base_age_max_female" className="form-input" style={{ fontWeight: 700, paddingRight: '35px', borderColor: "var(--accent-primary)" }} placeholder={activeExam.base_age_max_male} value={activeExam.base_age_max_female ?? ""} onChange={handleNumberChange} />
                  {yrsSuffix("var(--accent-primary)")}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Row 3: Relaxations */}
        <div style={{ background: "white", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Category relaxations */}
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>Category relaxations</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {["OBC", "SC", "ST"].map((cat) => (
                  <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 8px", background: "var(--bg-app-subtle)", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>{cat}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input type="number" style={{ width: "35px", background: "transparent", border: "none", borderBottom: "1px solid var(--border-strong)", textAlign: "center", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }} value={activeExam.category_relaxations?.[cat] ?? ""} onChange={(e) => handleCategoryRelaxation(cat, e.target.value)} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>yrs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* PwBD relaxations */}
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>PwBD relaxations</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {["UR", "OBC", "SC"].map((pCat) => (
                  <div key={pCat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 8px", background: "var(--bg-app-subtle)", borderRadius: "6px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>PwBD ({pCat})</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input type="number" style={{ width: "35px", background: "transparent", border: "none", borderBottom: "1px solid var(--border-strong)", textAlign: "center", fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }} value={activeExam.pwbd_relaxations?.[pCat] ?? ""} onChange={(e) => updateExamData((p) => ({ ...p, pwbd_relaxations: { ...p.pwbd_relaxations, [pCat]: Number(e.target.value), ...(pCat === "SC" ? { ST: Number(e.target.value) } : {}) } }))} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>yrs</span>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 8px", background: "var(--accent-primary-bg)", borderRadius: "6px", marginTop: "2px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent-primary)" }}>PwBD cap</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="number" style={{ width: "35px", background: "transparent", border: "none", borderBottom: "1.5px solid var(--accent-primary)", textAlign: "center", fontWeight: 700, color: "var(--accent-primary)", fontSize: "0.85rem" }} placeholder="56" value={activeExam.pwbd_max_age_ceiling ?? ""} onChange={(e) => updateExamData((p) => ({ ...p, pwbd_max_age_ceiling: e.target.value === "" ? "" : Number(e.target.value) }))} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-primary)' }}>yrs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: "0.6rem", fontWeight: 500 }}>
            These relaxation years get added to the upper age limit.
          </p>
        </div>

        {/* Row 4: Additional Rules */}
        <div style={{ background: "white", padding: "0.75rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "0.5rem" }}>Additional rules</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {/* ESM */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.4rem 0.5rem", background: "var(--bg-app-subtle)", borderRadius: "6px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", minWidth: "130px" }}>Ex-servicemen</span>
              {toggle(activeExam.has_esm_relaxation, () => updateExamData((p) => ({ ...p, has_esm_relaxation: !p.has_esm_relaxation })))}
              {activeExam.has_esm_relaxation ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Grace</span>
                    <input type="number" style={{ width: "40px", background: "white", border: "1px solid var(--border-strong)", borderRadius: "4px", textAlign: "center", fontWeight: 700, fontSize: "0.8rem", padding: "2px" }} placeholder="0" value={activeExam.esm_grace_period ?? ""} onChange={(e) => updateExamData((p) => ({ ...p, esm_grace_period: e.target.value === "" ? "" : Number(e.target.value) }))} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>yrs</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Cap</span>
                    <input type="number" style={{ width: "40px", background: "white", border: "1px solid var(--border-strong)", borderRadius: "4px", textAlign: "center", fontWeight: 700, fontSize: "0.8rem", padding: "2px" }} placeholder="50" value={activeExam.esm_max_age_ceiling ?? ""} onChange={(e) => updateExamData((p) => ({ ...p, esm_max_age_ceiling: e.target.value === "" ? "" : Number(e.target.value) }))} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>yrs</span>
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Off</span>
              )}
            </div>

            {/* Govt Employee */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.4rem 0.5rem", background: "var(--bg-app-subtle)", borderRadius: "6px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", minWidth: "130px" }}>Govt. employee</span>
              {toggle(activeExam.show_govt_caution, () => updateExamData((p) => ({ ...p, show_govt_caution: !p.show_govt_caution })))}
              <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{activeExam.show_govt_caution ? "Show a heads-up for govt employees" : "Off"}</span>
            </div>

            {/* Marital Status */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.4rem 0.5rem", background: "var(--bg-app-subtle)", borderRadius: "6px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", minWidth: "130px" }}>Marital rules</span>
              {toggle(activeExam.has_marital_restriction, () => updateExamData((p) => ({ ...p, has_marital_restriction: !p.has_marital_restriction })))}
              <div style={{ display: "flex", gap: "4px" }}>
                {["Unmarried", "Married", "Widow"].map((s) => (
                  <button key={s} onClick={() => toggleMaritalStatus(s)} style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "4px", border: "1px solid var(--border-subtle)", cursor: "pointer", background: activeExam.allowed_marital_statuses?.includes(s) ? "var(--accent-primary)" : "white", color: activeExam.allowed_marital_statuses?.includes(s) ? "white" : "var(--text-secondary)", fontWeight: 600, pointerEvents: activeExam.has_marital_restriction ? "auto" : "none", opacity: activeExam.has_marital_restriction ? 1 : 0.4 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderJobTypeSection = () => (
    <div className="animate-in">
      {renderSectionHeader(
        "Location & language",
        "Who's eligible to apply? Check the domicile and language sections in the notification.",
        Briefcase,
      )}

      <div
        className="card"
        style={{
          background: "white",
          padding: "1rem",
          borderRadius: "16px",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <label
          className="form-label"
          style={{
            fontSize: "0.7rem",
            fontWeight: 800,
            color: "var(--text-tertiary)",
            textTransform: "uppercase",
            marginBottom: "0.6rem",
            display: "block",
          }}
        >
          Recruitment type
        </label>
        <div
          className="segmented-control"
          style={{ marginBottom: "1.25rem", maxWidth: "300px" }}
        >
          <button
            className={`segmented-btn ${!activeExam.is_state_exam ? "active" : ""}`}
            onClick={() =>
              updateExamData((p) => ({
                ...p,
                is_state_exam: false,
                exam_state: "",
                is_national_scope: true,
              }))
            }
          >
            Central
          </button>
          <button
            className={`segmented-btn ${activeExam.is_state_exam ? "active" : ""}`}
            onClick={() =>
              updateExamData((p) => ({
                ...p,
                is_state_exam: true,
                is_national_scope: false,
              }))
            }
          >
            State
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeExam.is_state_exam ? (
            <motion.div
              key="state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label className="form-label">Governing State</label>
                  <select
                    name="exam_state"
                    className="form-select"
                    value={activeExam.exam_state || ""}
                    onChange={handleTextChange}
                  >
                    <option value="">Select State</option>
                    {[
                      "Bihar",
                      "Uttar Pradesh",
                      "Rajasthan",
                      "West Bengal",
                      "Maharashtra",
                      "Tamil Nadu",
                      "Kerala",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Who can apply?</label>
                  <select
                    name="is_national_scope"
                    className="form-select"
                    value={activeExam.is_national_scope ? "true" : "false"}
                    onChange={(e) =>
                      updateExamData((p) => ({
                        ...p,
                        is_national_scope: e.target.value === "true",
                      }))
                    }
                  >
                    <option value="true">ANY INDIAN CITIZEN</option>
                    <option value="false">
                      ONLY {activeExam.exam_state || "STATE"} DOMICILE HOLDERS
                    </option>
                  </select>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.5rem" }}>
                    If restricted, only candidates from this state will be eligible.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  background: "var(--bg-app-subtle)",
                  padding: "0.9rem",
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: activeExam.req_regional_language
                        ? "var(--accent-warning-bg)"
                        : "var(--bg-app)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Binary
                      size={20}
                      color={
                        activeExam.req_regional_language
                          ? "var(--accent-warning)"
                          : "var(--text-tertiary)"
                      }
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>
                      Regional language
                    </label>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      Does the notification require fluency in a state language?
                    </p>
                  </div>
                  <div className="segmented-control" style={{ scale: "0.8" }}>
                    <button
                      className={`segmented-btn ${!activeExam.req_regional_language ? "active" : ""}`}
                      onClick={() =>
                        updateExamData((p) => ({
                          ...p,
                          req_regional_language: false,
                        }))
                      }
                    >
                      Not required
                    </button>
                    <button
                      className={`segmented-btn ${activeExam.req_regional_language ? "active" : ""}`}
                      onClick={() =>
                        updateExamData((p) => ({
                          ...p,
                          req_regional_language: true,
                        }))
                      }
                    >
                      Required
                    </button>
                  </div>
                </div>

                {activeExam.req_regional_language && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <label className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>Specify Languages (Select Multiple)</label>
                    <div style={{ 
                      display: "flex", 
                      flexWrap: "wrap", 
                      gap: "0.6rem",
                      background: "rgba(255,255,255,0.5)",
                      padding: "1rem",
                      borderRadius: "16px",
                      border: "1px solid var(--border-subtle)"
                    }}>
                      {NURSING_LANGUAGES.map(lang => {
                        const isSelected = (activeExam.target_languages || []).includes(lang);
                        return (
                          <button
                            key={lang}
                            onClick={() => toggleTargetLanguage(lang)}
                            className={`action-pellet ${isSelected ? 'active' : ''}`}
                            style={{ 
                              padding: "6px 14px", 
                              fontSize: "0.75rem",
                              borderRadius: "12px",
                              border: isSelected ? "2px solid var(--accent-primary)" : "1px solid var(--border-strong)",
                              boxShadow: isSelected ? "var(--shadow-sm)" : "none",
                              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                          >
                            {isSelected && <CheckCircle2 size={12} style={{ marginRight: '6px' }} />}
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                    {(!activeExam.target_languages || activeExam.target_languages.length === 0) && (
                      <p style={{ fontSize: "0.7rem", color: "var(--accent-warning)", marginTop: "0.75rem", fontWeight: 700 }}>
                        <AlertTriangle size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        Please select at least one language.
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="central"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                padding: "1.25rem",
                textAlign: "center",
                background: "var(--bg-app)",
                borderRadius: "12px",
                border: "1px dashed var(--border-strong)",
              }}
            >
              <ShieldAlert
                size={32}
                color="var(--accent-primary)"
                style={{ marginBottom: "1rem" }}
              />
              <h3 style={{ fontWeight: 800 }}>Open to all</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                Any Indian citizen can apply. No domicile or language requirements.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderMarkingScheme = () => {
    if (!activeExam) return null;
    const stageType = activeExam.exam_pattern?.stage_type || "single";
    const setStageType = (val) => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage_type: val } }));

    const renderSectionalRow = (prefix, label) => {
      const enabled = activeExam.exam_pattern?.[`${prefix}_sectional_enabled`];
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", padding: "0.4rem 0.5rem", background: enabled ? "var(--bg-app-subtle)" : "transparent", borderRadius: "6px", marginTop: "0.25rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, minWidth: "110px" }}>
            <input type="checkbox" style={{ width: '15px', height: '15px' }} checked={enabled || false} onChange={() => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, [`${prefix}_sectional_enabled`]: !p.exam_pattern?.[`${prefix}_sectional_enabled`] } }))} />
            Section-wise
          </label>
          {enabled && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)" }}>Sections</span>
                <input type="number" className="form-input" style={{ width: "65px", fontWeight: 700, textAlign: "center" }} placeholder="5" value={activeExam.exam_pattern?.[`${prefix}_sections_count`] || ""} onChange={e => { const count = Number(e.target.value); const qps = activeExam.exam_pattern?.[`${prefix}_q_per_section`] || 0; const dps = activeExam.exam_pattern?.[`${prefix}_d_per_section`] || 0; updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, [`${prefix}_sections_count`]: count, [`${prefix}_qs`]: count * qps, [`${prefix}_duration`]: count * dps } })); }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)" }}>Qs/sec</span>
                <input type="number" className="form-input" style={{ width: "65px", fontWeight: 700, textAlign: "center" }} placeholder="40" value={activeExam.exam_pattern?.[`${prefix}_q_per_section`] || ""} onChange={e => { const qps = Number(e.target.value); const count = activeExam.exam_pattern?.[`${prefix}_sections_count`] || 0; updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, [`${prefix}_q_per_section`]: qps, [`${prefix}_qs`]: count * qps } })); }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)" }}>Time/sec</span>
                <input type="number" className="form-input" style={{ width: "65px", fontWeight: 700, textAlign: "center" }} placeholder="36" value={activeExam.exam_pattern?.[`${prefix}_d_per_section`] || ""} onChange={e => { const dps = Number(e.target.value); const count = activeExam.exam_pattern?.[`${prefix}_sections_count`] || 0; updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, [`${prefix}_d_per_section`]: dps, [`${prefix}_duration`]: count * dps } })); }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)" }}>min</span>
              </div>
            </>
          )}
        </div>
      );
    };

    return (
      <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {renderSectionHeader(
          "Paper pattern",
          "How is the exam structured? Check the pattern section in the notification.",
          FileText
        )}

        {/* Stage 1 */}
        <div style={{ background: "white", borderRadius: "10px", border: "1px solid var(--border-subtle)", padding: "0.75rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "0.5rem" }}>
            {stageType === "prelims_mains" ? "Stage 1 — Prelims" : "Exam structure"}
          </span>

          {/* Row 1: Format + Negative marking + Language */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>Format</label>
              {["objective","descriptive","mixed", undefined].includes(activeExam.exam_pattern?.stage1_format) && activeExam.exam_pattern?.stage1_format !== "__custom__" ? (
                <select className="form-select" style={{ flex: 1 }} value={activeExam.exam_pattern?.stage1_format || "objective"} onChange={e => { const v = e.target.value; if (v === "__custom__") updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_format: "__custom__" } })); else updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_format: v } })); }}>
                  <option value="objective">Objective (MCQ)</option>
                  <option value="descriptive">Descriptive</option>
                  <option value="mixed">Mixed (MCQ + Descriptive)</option>
                  <option value="__custom__">Any other...</option>
                </select>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                  <input className="form-input" style={{ flex: 1, fontWeight: 700 }} autoFocus placeholder="e.g. Clinical Viva, Skill Test..." value={activeExam.exam_pattern?.stage1_format === "__custom__" ? "" : (activeExam.exam_pattern?.stage1_format || "")} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_format: e.target.value || "__custom__" } }))} />
                  <button onClick={() => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_format: "objective" } }))} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: "4px" }}><X size={14} /></button>
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>Negative</label>
              <select className="form-select" style={{ flex: 1 }} value={activeExam.exam_pattern?.stage1_negative || "0.33"} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_negative: e.target.value } }))}>
                <option value="none">None</option>
                <option value="0.25">1/4 (-0.25)</option>
                <option value="0.33">1/3 (-0.33)</option>
                <option value="0.20">1/5 (-0.20)</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>Language</label>
              <select className="form-select" style={{ flex: 1 }} value={activeExam.exam_pattern?.question_language || "english"} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, question_language: e.target.value, regional_language: e.target.value === "english_state" ? p.exam_pattern?.regional_language || "" : "" } }))}>
                <option value="english">Only English</option>
                <option value="english_hindi">English + Hindi</option>
                <option value="english_state">English + State Language</option>
              </select>
              {activeExam.exam_pattern?.question_language === "english_state" && (
                <select className="form-select" style={{ flex: 1 }} value={activeExam.exam_pattern?.regional_language || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, regional_language: e.target.value } }))}>
                  <option value="">Select</option>
                  {NURSING_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              )}
            </div>
          </div>

          {/* Row 2: Questions + Marks + Duration */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", padding: "0.5rem 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", display: "block", marginBottom: "0.2rem" }}>Questions</label>
              <input type="number" className="form-input" style={{ fontWeight: 700 }} value={activeExam.exam_pattern?.stage1_qs || ""} readOnly={activeExam.exam_pattern?.stage1_sectional_enabled} style={{ fontWeight: 700, opacity: activeExam.exam_pattern?.stage1_sectional_enabled ? 0.5 : 1, background: activeExam.exam_pattern?.stage1_sectional_enabled ? 'var(--bg-app-subtle)' : 'white' }} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_qs: Number(e.target.value) || 0 } }))} />
            </div>
            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", display: "block", marginBottom: "0.2rem" }}>Marks</label>
              <input type="number" className="form-input" style={{ fontWeight: 700 }} value={activeExam.exam_pattern?.stage1_marks || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_marks: Number(e.target.value) || 0 } }))} />
            </div>
            <div>
              <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", display: "block", marginBottom: "0.2rem" }}>Duration (mins)</label>
              <input type="number" className="form-input" readOnly={activeExam.exam_pattern?.stage1_sectional_enabled} style={{ fontWeight: 700, opacity: activeExam.exam_pattern?.stage1_sectional_enabled ? 0.5 : 1, background: activeExam.exam_pattern?.stage1_sectional_enabled ? 'var(--bg-app-subtle)' : 'white' }} value={activeExam.exam_pattern?.stage1_duration || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_duration: Number(e.target.value) || 0 } }))} />
            </div>
          </div>

          {/* Row 3: Sectional breakdown */}
          {renderSectionalRow("stage1", "Section-wise breakdown")}
        </div>

        {/* Stage 2 toggle + content */}
        <div style={{ background: "white", borderRadius: "10px", border: "1px solid var(--border-subtle)", padding: "0.75rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: stageType === 'prelims_mains' ? "0.5rem" : 0 }}>
            <input type="checkbox" style={{ width: '15px', height: '15px' }} checked={stageType === 'prelims_mains'} onChange={(e) => setStageType(e.target.checked ? "prelims_mains" : "single")} />
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: stageType === 'prelims_mains' ? "var(--accent-primary)" : "var(--text-secondary)" }}>This exam has a Stage 2 (Mains)</span>
          </label>

          {stageType === "prelims_mains" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {/* Row 1: Format + Negative + Language */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>Format</label>
                  {["objective","descriptive","mixed", undefined].includes(activeExam.exam_pattern?.stage2_format) && activeExam.exam_pattern?.stage2_format !== "__custom__" ? (
                    <select className="form-select" style={{ flex: 1 }} value={activeExam.exam_pattern?.stage2_format || "descriptive"} onChange={e => { const v = e.target.value; if (v === "__custom__") updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_format: "__custom__" } })); else updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_format: v } })); }}>
                      <option value="objective">Objective (MCQ)</option>
                      <option value="descriptive">Descriptive</option>
                      <option value="mixed">Mixed (MCQ + Descriptive)</option>
                      <option value="__custom__">Any other...</option>
                    </select>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
                      <input className="form-input" style={{ flex: 1, fontWeight: 700 }} autoFocus placeholder="e.g. Clinical Viva, Skill Test..." value={activeExam.exam_pattern?.stage2_format === "__custom__" ? "" : (activeExam.exam_pattern?.stage2_format || "")} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_format: e.target.value || "__custom__" } }))} />
                      <button onClick={() => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_format: "descriptive" } }))} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-tertiary)", padding: "4px" }}><X size={14} /></button>
                    </div>
                  )}
                </div>
                {activeExam.exam_pattern?.stage2_format !== "descriptive" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>Negative</label>
                    <select className="form-select" style={{ flex: 1 }} value={activeExam.exam_pattern?.stage2_negative || "0.33"} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_negative: e.target.value } }))}>
                      <option value="none">None</option><option value="0.25">1/4</option><option value="0.33">1/3</option>
                    </select>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>Language</label>
                  <select className="form-select" style={{ flex: 1 }} value={activeExam.exam_pattern?.stage2_question_language || "english"} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_question_language: e.target.value, stage2_regional_language: e.target.value === "english_state" ? p.exam_pattern?.stage2_regional_language || "" : "" } }))}>
                    <option value="english">English</option>
                    <option value="english_hindi">Eng + Hindi</option>
                    <option value="english_state">Eng + State</option>
                  </select>
                  {activeExam.exam_pattern?.stage2_question_language === "english_state" && (
                    <select className="form-select" style={{ flex: 1 }} value={activeExam.exam_pattern?.stage2_regional_language || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_regional_language: e.target.value } }))}>
                      <option value="">Select</option>
                      {NURSING_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {/* Row 2: Questions + Marks + Duration */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", padding: "0.4rem 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", display: "block", marginBottom: "0.2rem" }}>Questions</label>
                  <input type="number" className="form-input" readOnly={activeExam.exam_pattern?.stage2_sectional_enabled} style={{ fontWeight: 700, opacity: activeExam.exam_pattern?.stage2_sectional_enabled ? 0.5 : 1, background: activeExam.exam_pattern?.stage2_sectional_enabled ? 'var(--bg-app-subtle)' : 'white' }} value={activeExam.exam_pattern?.stage2_qs || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_qs: Number(e.target.value) || 0 } }))} />
                </div>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", display: "block", marginBottom: "0.2rem" }}>Marks</label>
                  <input type="number" className="form-input" style={{ fontWeight: 700 }} value={activeExam.exam_pattern?.stage2_marks || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_marks: Number(e.target.value) || 0 } }))} />
                </div>
                <div>
                  <label style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", display: "block", marginBottom: "0.2rem" }}>Duration (mins)</label>
                  <input type="number" className="form-input" readOnly={activeExam.exam_pattern?.stage2_sectional_enabled} style={{ fontWeight: 700, opacity: activeExam.exam_pattern?.stage2_sectional_enabled ? 0.5 : 1, background: activeExam.exam_pattern?.stage2_sectional_enabled ? 'var(--bg-app-subtle)' : 'white' }} value={activeExam.exam_pattern?.stage2_duration || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_duration: Number(e.target.value) || 0 } }))} />
                </div>
              </div>

              {/* Row 3: Sectional */}
              {renderSectionalRow("stage2", "Stage 2 section-wise breakdown")}
            </motion.div>
          )}
        </div>

        {/* Pattern notes */}
        <div style={{ background: "white", borderRadius: "10px", border: "1px solid var(--border-subtle)", padding: "0.75rem" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>Pattern notes</label>
          <textarea
            className="form-input"
            style={{ width: "100%", minHeight: "80px", fontSize: "0.8rem", lineHeight: "1.5", resize: "vertical", borderRadius: "8px" }}
            placeholder="Any extra details about the pattern — special instructions, tie-breaking rules, etc."
            value={activeExam.exam_pattern?.description || ""}
            onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, description: e.target.value } }))}
          />
        </div>
      </div>
    );
  };

  const renderSyllabusSplit = () => {
    return (
      <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {renderSectionHeader(
          "Syllabus",
          "What's the subject split? Check the syllabus section of the notification.",
          BookOpen
        )}

        {/* Row 1: Subject split */}
        <div style={{ background: "white", borderRadius: "10px", border: "1px solid var(--border-subtle)", padding: "0.75rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "0.5rem" }}>Subject split</span>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)" }}>Nursing</label>
              <input type="number" className="form-input" min="0" max="100" style={{ width: "65px", fontWeight: 700, textAlign: "center" }} value={activeExam.syllabus?.core_percentage ?? ""} placeholder="70" onChange={e => { const val = e.target.value === "" ? 0 : Math.max(0, Math.min(100, Number(e.target.value))); updateExamData(p => ({ ...p, syllabus: { ...p.syllabus, core_percentage: val, non_core_percentage: 100 - val } })); }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)" }}>%</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)" }}>Non-nursing</label>
              <input type="number" className="form-input" min="0" max="100" style={{ width: "65px", fontWeight: 700, textAlign: "center" }} value={activeExam.syllabus?.non_core_percentage ?? ""} placeholder="30" onChange={e => { const val = e.target.value === "" ? 0 : Math.max(0, Math.min(100, Number(e.target.value))); updateExamData(p => ({ ...p, syllabus: { ...p.syllabus, non_core_percentage: val, core_percentage: 100 - val } })); }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)" }}>%</span>
            </div>
          </div>
        </div>

        {/* Row 2: Non-nursing subjects */}
        <div style={{ background: "white", borderRadius: "10px", border: "1px solid var(--border-subtle)", padding: "0.75rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>Non-nursing subjects</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
            {(activeExam.syllabus?.non_core_subjects || []).map((sub, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0px", background: "var(--bg-app-subtle)", borderRadius: "6px", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
                <input type="text" className="form-input" style={{ width: `${Math.max(60, (sub.name?.length || 10) * 8 + 16)}px`, background: "transparent", border: "none", fontWeight: 700, fontSize: "0.75rem", padding: "4px 8px", minHeight: "auto" }} placeholder="Subject name" value={sub.name} onChange={e => { const newSubs = [...activeExam.syllabus.non_core_subjects]; newSubs[idx].name = e.target.value; updateExamData(p => ({...p, syllabus: {...p.syllabus, non_core_subjects: newSubs}})); }} />
                <button onClick={() => updateExamData(p => ({...p, syllabus: {...p.syllabus, non_core_subjects: p.syllabus.non_core_subjects.filter((_, i) => i !== idx)}}))} style={{ background: "transparent", border: "none", borderLeft: "1px solid var(--border-subtle)", color: "var(--text-tertiary)", cursor: "pointer", padding: "4px 6px", display: "flex" }}><X size={12} /></button>
              </div>
            ))}
            <button onClick={() => updateExamData(p => ({ ...p, syllabus: { ...p.syllabus, non_core_subjects: [...(p.syllabus?.non_core_subjects || []), { name: "" }] } }))} style={{ padding: "4px 10px", fontSize: "0.7rem", fontWeight: 700, background: "white", color: "var(--accent-primary)", border: "1px dashed var(--accent-primary)", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}><Plus size={12} /> Add</button>
          </div>
        </div>

        {/* Row 3: Syllabus notes */}
        <div style={{ background: "white", borderRadius: "10px", border: "1px solid var(--border-subtle)", padding: "0.75rem" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", display: "block", marginBottom: "0.4rem" }}>Syllabus notes</label>
          <textarea className="form-input" style={{ width: "100%", minHeight: "80px", fontSize: "0.8rem", lineHeight: "1.5", resize: "vertical", borderRadius: "8px" }} placeholder="Add detailed topics, reference books, or anything else students should know." value={activeExam.syllabus?.description || ""} onChange={e => updateExamData(p => ({ ...p, syllabus: { ...p.syllabus, description: e.target.value } }))} />
        </div>
      </div>
    );
  };

  const renderFeeStructure = () => {
    // ------------------------------------------------------------------
    // AUTO-MIGRATION: Detect old format and migrate to dynamic array
    // ------------------------------------------------------------------
    if (activeExam && (!activeExam.fee_matrix || !activeExam.fee_matrix.categories)) {
      const defaultCats = [
        { id: "UR", label: "Unreserved (UR)" },
        { id: "OBC", label: "OBC" },
        { id: "EWS", label: "EWS" },
        { id: "SC_ST", label: "SC / ST" },
        { id: "Women", label: "Women (All Cats)" },
        { id: "PwBD", label: "PwBD (Disability)" },
        { id: "ESM", label: "Ex-Servicemen" }
      ];

      const migratedCategories = defaultCats.map(cat => ({
        ...cat,
        amount: activeExam.fee_matrix?.[cat.id]?.amount ?? 0,
        waived: activeExam.fee_matrix?.[cat.id]?.waived ?? false,
        active: true, // Keep standard ones active by default
        is_custom: false
      }));

      // Flush migration to state
      updateExamData(p => ({
        ...p,
        fee_matrix: {
          ...p.fee_matrix,
          categories: migratedCategories
        }
      }));
      return null; // Force re-render with new structure
    }

    const categories = activeExam.fee_matrix.categories || [];

    return (
      <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {renderSectionHeader(
          "Application fees",
          "What does each category pay to apply? You'll find the fee table in the notification.",
          IndianRupee
        )}

        {/* Domicile wall toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "white", padding: "0.6rem 0.75rem", borderRadius: "10px", border: "1px solid var(--border-subtle)" }}>
          <input type="checkbox" style={{ width: '15px', height: '15px', cursor: 'pointer' }} checked={activeExam.fee_matrix?.enforce_domicile_wall || false} onChange={(e) => updateExamData(p => ({ ...p, fee_matrix: { ...p.fee_matrix, enforce_domicile_wall: e.target.checked } }))} />
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)" }}>Charge UR fee for out-of-state candidates</span>
        </div>

        {/* Fee cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {categories.map((c) => (
            <div
              key={c.id}
              style={{
                background: "white",
                borderRadius: "10px",
                border: c.active ? (c.waived ? "1.5px solid var(--accent-success)" : "1px solid var(--border-subtle)") : "1px dashed var(--border-subtle)",
                padding: "0.6rem 0.75rem",
                transition: "all 0.15s",
                display: "flex",
                flexDirection: "column",
                gap: c.active ? "0.5rem" : "0",
              }}
            >
              {/* Row 1: Name + toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input className="form-input" style={{ flex: 1, fontWeight: 700, fontSize: "0.8rem", border: "none", background: "transparent", padding: "0", minWidth: 0, color: c.active ? "var(--text-primary)" : "var(--text-tertiary)" }} value={c.label} onChange={(e) => handleUpdateFeeCategory(c.id, "label", e.target.value)} placeholder="Category name" />
                <div
                  onClick={() => handleUpdateFeeCategory(c.id, "active", !c.active)}
                  style={{ width: '28px', height: '15px', background: c.active ? "var(--accent-primary)" : "rgba(0,0,0,0.12)", borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                >
                  <motion.div animate={{ x: c.active ? 13 : 2 }} style={{ width: '11px', height: '11px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </div>
              </div>

              {/* Row 2: Helper text + fee controls (when active) OR "Not included" (when inactive) */}
              {c.active ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {!c.waived && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0px", background: "var(--bg-app-subtle)", borderRadius: "6px", border: "1px solid var(--border-subtle)", overflow: "hidden", width: "100px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-tertiary)", paddingLeft: "6px" }}>₹</span>
                      <input type="number" className="form-input" style={{ flex: 1, fontWeight: 700, fontSize: "0.8rem", textAlign: "right", border: "none", background: "transparent", padding: "3px 4px", minHeight: "auto" }} placeholder="0" value={c.amount} onChange={(e) => handleUpdateFeeCategory(c.id, "amount", e.target.value)} />
                    </div>
                  )}
                  <div style={{ flex: 1 }} />
                  <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", fontSize: "0.7rem", fontWeight: 600, color: c.waived ? "var(--accent-success)" : "var(--text-tertiary)", whiteSpace: "nowrap" }}>
                    <input type="checkbox" style={{ width: '13px', height: '13px', cursor: 'pointer' }} checked={c.waived || false} onChange={() => handleUpdateFeeCategory(c.id, "waived", !c.waived)} />
                    Fee waived
                  </label>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", fontStyle: "italic" }}>Not included</span>
                  <button onClick={() => handleRemoveFeeCategory(c.id)} style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer", padding: "0", display: "flex" }}><Trash2 size={12} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={handleAddFeeCategory} style={{ padding: "4px 10px", fontSize: "0.7rem", fontWeight: 700, background: "white", color: "var(--accent-primary)", border: "1px solid var(--border-subtle)", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", width: "fit-content" }}><Plus size={12} /> Add category</button>
      </div>
    );
  };

  if (!activeExam) {
    return (
      <div className="main-content">
        <div
          style={{
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "1.4rem" }}>Your exams</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Pick an exam to configure, or start a new one.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={createNewExam}
            style={{ borderRadius: "20px", padding: "0.5rem 1.25rem", fontSize: "0.8rem" }}
          >
            <PlusCircle size={16} /> New exam
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {exams.map((e) => (
            <motion.div
              whileHover={{ scale: 1.02, translateY: -4 }}
              key={e.id}
              className="card"
              style={{
                cursor: "pointer",
                background: "white",
                padding: "1.25rem",
                borderRadius: "20px",
                border: "1px solid var(--border-subtle)",
              }}
              onClick={() => setActiveExamId(e.id)}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "var(--bg-app)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {e.metadata?.image_url ? (
                    <img src={e.metadata.image_url} style={{ width: "30px" }} />
                  ) : (
                    <GraduationCap size={20} color="var(--accent-primary)" />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800 }}>
                    {e.metadata?.exam_name || "Unnamed"}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "var(--accent-primary)",
                      textTransform: "uppercase",
                    }}
                  >
                    {e.exam_state || "Central"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const sections = [
    { id: "identity", label: "Exam details", icon: LayoutGrid },
    { id: "job_type", label: "Location & language", icon: Briefcase },
    { id: "dates", label: "Key dates", icon: Clock },
    { id: "age", label: "Age rules", icon: Users },
    { id: "edu", label: "Qualifications", icon: GraduationCap },
    { id: "marking", label: "Paper pattern", icon: FileText },
    { id: "syllabus", label: "Syllabus", icon: BookOpen },
    { id: "fees", label: "Application fees", icon: IndianRupee },
  ];

  return (
    <div
      className="admin-container"
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg-arctic-slate)",
      }}
    >
      <div
        className="admin-sidebar"
        style={{
          width: "230px",
          background: "white",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "0.75rem 0.75rem",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              background: "var(--accent-primary)",
              color: "white",
              padding: "5px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Settings size={14} />
          </div>
          <h2
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.3,
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {activeExam?.metadata?.exam_name || "Exam name"}
          </h2>
          {isDirty && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                width: "7px",
                height: "7px",
                background: "var(--accent-warning)",
                borderRadius: "50%",
                flexShrink: 0,
              }}
              title="You have unsaved changes"
            />
          )}
        </div>
        <div
          className="sidebar-nav-scroll"
          style={{
            flex: 1,
            padding: "0.4rem 0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            overflowY: "auto",
            minHeight: 0,
          }}
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`sidebar-link ${activeSection === s.id ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "0.45rem 0.65rem",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.8rem",
                background:
                  activeSection === s.id
                    ? "var(--accent-primary-bg)"
                    : "transparent",
                color:
                  activeSection === s.id
                    ? "var(--accent-primary)"
                    : "var(--text-secondary)",
                cursor: "pointer",
                textAlign: "left",
                fontWeight: activeSection === s.id ? 700 : 500,
                transition: "all 150ms ease",
              }}
            >
              <s.icon size={16} />
              <span>{s.label}</span>
              {activeSection === s.id && (
                <ChevronRight size={12} style={{ marginLeft: "auto", opacity: 0.6 }} />
              )}
            </button>
          ))}
        </div>
        <div
          style={{
            padding: "0.5rem",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "0.35rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.35rem" }}>
            <button
              className="btn"
              onClick={discardChanges}
              style={{
                padding: "0.35rem 0.5rem",
                fontSize: "0.7rem",
                flex: 1,
                borderRadius: "6px",
              }}
            >
              Cancel
            </button>
            <button
              className={`btn btn-primary ${isSaved ? "success" : ""}`}
              onClick={saveConfig}
              style={{
                padding: "0.35rem 0.5rem",
                fontSize: "0.7rem",
                flex: 1.5,
                borderRadius: "6px",
              }}
            >
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
          <button
            onClick={handleExit}
            className="btn"
            style={{
              width: "100%",
              justifyContent: "center",
              color: "var(--text-tertiary)",
              fontSize: "0.7rem",
              fontWeight: 600,
              padding: "0.3rem",
            }}
          >
            <ChevronLeft size={14} /> All exams
          </button>
        </div>
      </div>
      <div
        className="admin-main"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem 2.5rem",
          background: "transparent",
        }}
      >
        {activeSection === "identity" && renderIdentityHub()}
        {activeSection === "job_type" && renderJobTypeSection()}
        {activeSection === "dates" && renderImportantDates()}
        {activeSection === "age" && renderAgeLimits()}
        {activeSection === "edu" && renderEducation()}
        {activeSection === "marking" && renderMarkingScheme()}
        {activeSection === "syllabus" && renderSyllabusSplit()}
        {activeSection === "fees" && renderFeeStructure()}
        {showGlobalPreview && renderLiveStudentCardHUD()}
        {renderEducationRuleDrawer()}
      </div>
    </div>
  );
}
