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
        "Are you sure? This will revert all unsaved changes for this session.",
      )
    ) {
      setExams(JSON.parse(JSON.stringify(lastSavedExams)));
    }
  };

  const handleExit = () => {
    if (isDirty && !window.confirm("You have unsaved changes. Exit anyway?"))
      return;
    setActiveExamId(null);
  };

  // --- REAL-TIME VISUALIZATION COMPONENTS ---

  const renderLiveStudentCardHUD = () => (
    <div
      style={{
        marginTop: "2.5rem",
        paddingTop: "2.5rem",
        borderTop: "1px dashed var(--border-strong)",
        display: "grid",
        gridTemplateColumns: "1fr 340px",
        gap: "2rem",
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
              fontSize: "0.65rem",
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
            padding: "1.25rem",
            borderRadius: "16px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <label className="form-label" style={{ fontSize: "0.6rem" }}>
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
              <label className="form-label" style={{ fontSize: "0.6rem" }}>
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
              gap: "1rem",
              marginBottom: "1rem",
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
              <span style={{ fontSize: "0.65rem", fontWeight: 700 }}>PwBD</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
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
                    fontSize: "0.65rem",
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
              <span style={{ fontSize: "0.65rem", fontWeight: 800 }}>
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
          padding: "1.5rem",
          borderRadius: "24px",
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
                  {activeExam.metadata?.exam_name || "New Engine"}
                </h3>
                <span
                  style={{
                    fontSize: "0.55rem",
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
                  fontSize: "0.65rem",
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
                    fontSize: "0.6rem",
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
                  fontSize: "0.65rem",
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
        marginBottom: "2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div style={{ flex: 1 }}>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "2.25rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              margin: 0,
              color: "var(--text-primary)",
            }}
          >
            <div
              style={{
                background: "var(--accent-primary-bg)",
                color: "var(--accent-primary)",
                padding: "12px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={28} />
            </div>
            {title}
          </h2>
          <p
            style={{
              marginTop: "6px",
              color: "var(--text-secondary)",
              fontWeight: 400,
              opacity: 0.8,
              paddingLeft: "72px",
              fontSize: "1rem",
            }}
          >
            {subtitle}
          </p>
        </motion.div>
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
          "Recruitment Details",
          "Enter the official exam name, pay scale, and vacancies exactly as they appear in the notification.",
          LayoutGrid,
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            className="card"
            style={{
              padding: "1.5rem",
              borderRadius: "20px",
              background: "white",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "1.5rem", 
              marginBottom: "1rem" 
            }}>
              <div style={{ flex: 1 }}>
                <label
                  className="form-label"
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    marginBottom: "0.4rem",
                    letterSpacing: '0.05em'
                  }}
                >
                  Exam Information
                </label>
                <div className="input-with-icon">
                  <Type size={14} className="icon" style={{ color: 'var(--accent-primary)' }} />
                  <input
                    type="text"
                    name="exam_name"
                    className="form-input"
                    style={{ 
                      fontSize: "1.1rem", 
                      fontWeight: 800, 
                      padding: "10px 12px 10px 36px",
                      background: 'var(--bg-app-subtle)',
                      border: '1px solid var(--border-subtle)'
                    }}
                    placeholder="Official Job Title (e.g., AIIMS NORCET 8.0)"
                    value={activeExam.metadata?.exam_name || ""}
                    onChange={handleMetadataChange}
                  />
                </div>
              </div>

              <div style={{ minWidth: "180px" }}>
                <label
                  className="form-label"
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    marginBottom: "0.4rem",
                    letterSpacing: '0.02em',
                    textAlign: 'center',
                    display: 'block'
                  }}
                >
                  Notification Status
                </label>
                <div 
                  onClick={() => updateExamData(prev => ({ 
                    ...prev, 
                    metadata: { 
                      ...prev.metadata, 
                      notification_status: prev.metadata.notification_status === "short" ? "detailed" : "short" 
                    } 
                  }))}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    background: 'var(--bg-app-subtle)',
                    padding: '6px 10px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ 
                    fontSize: '0.6rem', 
                    fontWeight: 900, 
                    color: activeExam.metadata?.notification_status === "short" ? "var(--accent-primary)" : "var(--text-tertiary)",
                    opacity: activeExam.metadata?.notification_status === "short" ? 1 : 0.4,
                    letterSpacing: '0.02em'
                  }}>TENTATIVE</span>
                  
                  <div style={{ 
                    width: '32px', 
                    height: '18px', 
                    background: activeExam.metadata?.notification_status === "detailed" ? "var(--accent-primary)" : "var(--border-strong)",
                    borderRadius: '20px',
                    position: 'relative',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px'
                  }}>
                    <motion.div 
                      initial={false}
                      animate={{ x: activeExam.metadata?.notification_status === "detailed" ? 14 : 0 }}
                      style={{ 
                        width: '14px', 
                        height: '14px', 
                        background: 'white', 
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    />
                  </div>

                  <span style={{ 
                    fontSize: '0.6rem', 
                    fontWeight: 900, 
                    color: activeExam.metadata?.notification_status === "detailed" ? "var(--accent-primary)" : "var(--text-tertiary)",
                    opacity: activeExam.metadata?.notification_status === "detailed" ? 1 : 0.4,
                    letterSpacing: '0.02em'
                  }}>OFFICIAL</span>
                </div>
                <p style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)', fontWeight: 700, textAlign: 'center', marginTop: '4px' }}>
                  Mark as 'Official' if the final PDF is released 
                </p>
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label className="form-label" style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.4rem', display: 'block' }}>Salary & Pay Scale</label>
              <div className="input-with-icon">
                <IndianRupee size={14} className="icon" style={{ color: 'var(--accent-primary)' }} />
                <input
                  type="text"
                  name="salary_range"
                  className="form-input"
                  style={{ fontWeight: 700, background: 'var(--bg-app-subtle)' }}
                  placeholder="e.g., 12-13 Lakh per Annum"
                  value={activeExam.metadata?.salary_range || ""}
                  onChange={handleMetadataChange}
                />
              </div>
            </div>

            <div
              className="premium-glass"
              style={{
                marginTop: "1.5rem",
                padding: "1.25rem",
                borderRadius: "20px",
                border: "1px solid var(--border-subtle)",
                background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(245,247,255,0.4) 100%)",
                display: "grid",
                gridTemplateColumns: "280px 1fr",
                gap: "2rem",
              }}
            >
              {/* Left Column: Master Vacancy Control */}
              <div style={{ borderRight: '1px dashed var(--border-subtle)', paddingRight: '2rem' }}>
                <label
                  className="form-label"
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: "var(--accent-primary)",
                    marginBottom: "0.6rem",
                    display: "block",
                    letterSpacing: '0.05em'
                  }}
                >
                  Vacancy Management Hub
                </label>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '1rem', lineHeight: 1.4 }}>
                  Establish the total advertised seats as the root baseline for distribution.
                </p>

                <div className="input-with-icon" style={{ marginBottom: '1.25rem' }}>
                  <Users size={14} className="icon" style={{ color: 'var(--accent-primary)' }} />
                  <input
                    type="number"
                    name="total_vacancies"
                    className="form-input"
                    style={{ fontWeight: 800, fontSize: '1.2rem', padding: '12px 12px 12px 38px' }}
                    placeholder="Total Seats"
                    value={activeExam.metadata?.total_vacancies || ""}
                    onChange={handleMetadataChange}
                  />
                </div>

                <div 
                  style={{ 
                    padding: '12px', 
                    borderRadius: '16px', 
                    background: isOverLimit ? 'var(--accent-danger-bg)' : 'white',
                    border: `1px solid ${isOverLimit ? 'var(--accent-danger)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.55rem', fontWeight: 900, color: 'var(--text-tertiary)' }}>ALLOCATED</span>
                    {isOverLimit ? <ShieldAlert size={12} color="var(--accent-danger)" /> : <Binary size={12} color="var(--accent-primary)" />}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: isOverLimit ? 'var(--accent-danger)' : 'var(--text-primary)' }}>
                    {totalCategorySum} <span style={{ color: 'var(--text-tertiary)', fontWeight: 500, fontSize: '0.8rem' }}>/ {totalAllowed || 0}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Categorical Breakdown */}
              <div style={{ minHeight: '160px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)' }}>CATEGORICAL DISTRIBUTION</span>
                  <p style={{ fontSize: '0.55rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    Divide seats into specific reservation groups.
                  </p>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {(activeExam.metadata?.category_vacancies || []).map((cv, idx) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={idx} 
                      style={{ 
                        display: "grid", 
                        gridTemplateColumns: "1fr 140px 36px", 
                        gap: "0.6rem", 
                        alignItems: "center",
                        background: 'rgba(255,255,255,0.5)',
                        padding: '4px',
                        borderRadius: '10px'
                      }}
                    >
                      <div className="input-with-icon">
                        <Type size={12} className="icon" />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Category (e.g., UR, OBC...)"
                          style={{ fontSize: "0.8rem", fontWeight: 700, border: 'none', background: 'transparent' }}
                          value={cv.category}
                          onChange={(e) => handleCategoryVacancyChange(idx, "category", e.target.value)}
                        />
                      </div>
                      <div className="input-with-icon">
                        <Hash size={12} className="icon" />
                        <input
                          type="number"
                          className="form-input"
                          placeholder="Count"
                          style={{ fontSize: "0.8rem", fontWeight: 700, textAlign: 'center', border: 'none', background: 'transparent' }}
                          value={cv.count}
                          onChange={(e) => handleCategoryVacancyChange(idx, "count", e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => removeCategoryVacancy(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-tertiary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        className="hover-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}

                  <button
                    className="btn"
                    style={{
                      marginTop: '0.5rem',
                      padding: '10px 14px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      background: 'white',
                      color: 'var(--accent-primary)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-sm)',
                      width: 'fit-content',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '12px'
                    }}
                    onClick={addCategoryVacancy}
                  >
                    <Plus size={14} />
                    Add Category
                  </button>
                </div>

                {isOverLimit && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      marginTop: '1rem', 
                      padding: '10px', 
                      background: 'var(--accent-danger-bg)', 
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: 'var(--accent-danger)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      border: '1px solid var(--accent-danger-subtle)'
                    }}
                  >
                    <AlertTriangle size={14} />
                    <span>Sum of categories ({totalCategorySum}) exceeds Advertised Vacancies ({totalAllowed}).</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div
            className="card"
            style={{
              padding: "1rem",
              border: "1px solid var(--border-subtle)",
              background: "white",
              borderRadius: "20px",
            }}
          >
            <label
              className="form-label"
              style={{
                fontSize: "0.65rem",
                fontWeight: 900,
                color: "var(--accent-primary)",
                marginBottom: "0.25rem",
                display: "block",
                textTransform: 'uppercase'
              }}
            >
              Institutional Logo
            </label>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '0.75rem' }}>
              Upload the official hospital or institute icon for candidate recognition.
            </p>
            <div
              style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "var(--bg-app-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--border-subtle)",
                  overflow: "hidden",
                }}
              >
                {activeExam.metadata?.image_url ? (
                  <img
                    src={activeExam.metadata.image_url}
                    alt="Icon"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Image size={20} color="var(--text-tertiary)" />
                )}
              </div>
              <div
                className="segmented-control"
                style={{ scale: "0.85", transformOrigin: "left" }}
              >
                <button
                  className={`segmented-btn ${logoInputMode === "link" ? "active" : ""}`}
                  onClick={() => setLogoInputMode("link")}
                >
                  Link
                </button>
                <button
                  className={`segmented-btn ${logoInputMode === "upload" ? "active" : ""}`}
                  onClick={() => setLogoInputMode("upload")}
                >
                  Upload
                </button>
              </div>
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              {logoInputMode === "link" ? (
                <div className="input-with-icon">
                  <Link2 size={14} className="icon" />
                  <input
                    className="form-input"
                    placeholder="Icon URL"
                    name="image_url"
                    value={
                      activeExam.metadata?.image_url &&
                      !activeExam.metadata?.image_url?.startsWith("data:")
                        ? activeExam.metadata.image_url
                        : ""
                    }
                    onChange={handleMetadataChange}
                  />
                </div>
              ) : (
                <div className="input-with-icon">
                  <UploadCloud size={14} className="icon" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="form-input"
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: "1rem",
              border: "1px solid var(--border-subtle)",
              background: "white",
              borderRadius: "20px",
            }}
          >
            <label
              className="form-label"
              style={{
                fontSize: "0.65rem",
                fontWeight: 900,
                color: "var(--accent-primary)",
                marginBottom: "0.25rem",
                display: "block",
                textTransform: 'uppercase'
              }}
            >
              Official Notification (PDF)
            </label>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: '0.75rem' }}>
              Attach the original notification here. Student will be able to download the notifcation directly.
            </p>
            <div
              style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "var(--bg-app-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <FileText size={20} color="var(--accent-primary)" />
              </div>
              <div
                className="segmented-control"
                style={{ scale: "0.85", transformOrigin: "left" }}
              >
                <button
                  className={`segmented-btn ${notificationInputMode === "link" ? "active" : ""}`}
                  onClick={() => setNotificationInputMode("link")}
                >
                  Link
                </button>
                <button
                  className={`segmented-btn ${notificationInputMode === "upload" ? "active" : ""}`}
                  onClick={() => setNotificationInputMode("upload")}
                >
                  Upload
                </button>
              </div>
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              {notificationInputMode === "link" ? (
                <div className="input-with-icon">
                  <Link2 size={14} className="icon" />
                  <input
                    type="url"
                    name="notification_url"
                    className="form-input"
                    value={
                      activeExam.metadata?.notification_url &&
                      !activeExam.metadata?.notification_url?.startsWith("data:")
                        ? activeExam.metadata.notification_url
                        : ""
                    }
                    onChange={handleMetadataChange}
                    placeholder="Notification URL"
                  />
                </div>
              ) : (
                <div className="input-with-icon">
                  <UploadCloud size={14} className="icon" />
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="form-input"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderImportantDates = () => (
    <div className="animate-in">
      {renderSectionHeader(
        "Timeline & Schedule",
        "Establish the chronological recruitment events.",
        Clock,
      )}
      <div
        className="milestone-container"
        style={{ 
          position: "relative", 
          marginTop: "1.25rem",
          paddingBottom: "120px" // Iron Dome: Landing Zone for bottom row popovers
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1.2fr 50px 140px 110px 125px 125px 40px",
            gap: "0.5rem",
            padding: "0 1.25rem",
            marginBottom: "0.75rem",
            color: "var(--text-tertiary)",
            fontSize: "0.6rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <div style={{ textAlign: "center" }}>Sort</div>
          <div>Event Sequence</div>
          <div style={{ textAlign: "center" }}>TBA</div>
          <div>Date</div>
          <div style={{ textAlign: "center" }}><Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />Time</div>
          <div style={{ textAlign: "center" }}>Action / CTA</div>
          <div style={{ textAlign: "center" }}>Prep. Resources</div>
          <div style={{ textAlign: "right" }}>X</div>
        </div>
        <Reorder.Group
          axis="y"
          values={activeExam.metadata?.important_dates || []}
          onReorder={reorderImportantDates}
          style={{ padding: 0 }}
        >
          {(activeExam.metadata?.important_dates || []).map((m, i) => (
            <Reorder.Item
              key={m.id || i}
              value={m}
              style={{ 
                listStyle: "none", 
                marginBottom: "0.4rem",
                position: "relative",
                // Iron Dome: Elevate active row and neutralize transform isolation
                zIndex: (m.show_cta_popover || m.show_popover || m.show_time_popover) ? 2000 : 1,
                transform: (m.show_cta_popover || m.show_popover || m.show_time_popover) ? "none" : undefined
              }}
            >
                <motion.div
                  layout
                  className="milestone-node"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1.2fr 50px 140px 110px 125px 125px 40px",
                    gap: "0.5rem",
                    alignItems: "center",
                    padding: "0.4rem 0.75rem",
                    background: "white",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "var(--shadow-sm)",
                    overflow: "visible" // Iron Dome: Ensure popover 'blooms' out
                  }}
                >
                  <div className="milestone-card-accent" />
                  <div
                    style={{
                      cursor: "grab",
                      display: "flex",
                      justifyContent: "center",
                      color: "var(--text-tertiary)",
                      zIndex: 1,
                    }}
                  >
                    <GripVertical size={16} />
                  </div>
                  <div className="input-group" style={{ zIndex: 1, width: '100%', position: 'relative' }}>
                    <textarea
                      rows={1}
                      className="form-input milestone-label-textarea"
                      style={{
                        fontWeight: (m.label && !NURSING_DATE_TEMPLATES.some(t => t.label === m.label)) ? 800 : 600,
                        padding: "6px 10px",
                        fontSize: "0.85rem",
                        border: "1px solid transparent",
                        borderBottom: "1.5px dashed var(--text-tertiary)",
                        background: "transparent",
                        color: (!m.label || NURSING_DATE_TEMPLATES.some(t => t.label === m.label)) ? "var(--text-tertiary)" : "var(--text-primary)",
                        resize: "none",
                        overflow: "hidden",
                        minHeight: "36px",
                        lineHeight: "1.4",
                        width: "100%",
                        fontFamily: "inherit",
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                      }}
                      value={m.label || ""}
                      onChange={(e) => {
                        handleImportantDateChange(i, "label", e.target.value);
                      }}
                      onFocus={(e) => {
                        e.target.style.background = "white";
                        e.target.style.borderColor = "var(--border-strong)";
                        e.target.style.borderBottomStyle = "solid";
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      onBlur={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.borderColor = "transparent";
                        e.target.style.borderBottomStyle = "dashed";
                      }}
                      onMouseEnter={(e) => {
                        if (document.activeElement !== e.target) {
                          e.target.style.background = "var(--bg-surface-hover)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (document.activeElement !== e.target) {
                          e.target.style.background = "transparent";
                        }
                      }}
                      placeholder={m.template_label || m.label || "Enter Event..."}
                    />


                  </div>
                  
                  {/* Dedicated TBA Column */}
                  <div style={{ display: "flex", justifyContent: "center", zIndex: 1 }}>
                    <input 
                      type="checkbox" 
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      checked={m.is_tentative || false}
                      onChange={(e) => handleImportantDateChange(i, "is_tentative", e.target.checked)}
                    /> 
                  </div>

                  {/* Dedicated Date Column */}
                  <div style={{ zIndex: 1 }}>
                    {m.is_tentative ? (
                       <div style={{ 
                        padding: "6px 8px", 
                        fontSize: "0.62rem", 
                        fontWeight: 900,
                        textAlign: "center",
                        background: "var(--bg-app-subtle)",
                        color: "var(--accent-primary)",
                        borderRadius: "8px",
                        border: "1px dashed var(--accent-primary)",
                        width: "100%",
                        height: "30.5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textTransform: "uppercase",
                        letterSpacing: "0.02em"
                      }}>
                        TBA (To Be Announced)
                      </div>
                    ) : (
                      <input
                        type="date"
                        className="form-input"
                        style={{ 
                          padding: "6px 8px", 
                          fontSize: "0.75rem", 
                          fontWeight: 700,
                          width: "100%",
                          border: "1px solid var(--border-subtle)",
                          background: "white",
                        }}
                        value={m.date || ""}
                        onChange={(e) =>
                          handleImportantDateChange(i, "date", e.target.value)
                        }
                      />
                    )}
                  </div>

                  {/* High-Precision Time Column */}
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <button
                      className={`action-pellet ${m.has_time_limit ? 'active' : ''}`}
                      disabled={m.is_tentative}
                      style={{ 
                        width: '100%', 
                        justifyContent: 'center',
                        background: m.is_tentative ? 'var(--bg-app-subtle)' : (m.has_time_limit ? 'rgba(79, 70, 229, 0.08)' : 'var(--bg-app-subtle)'),
                        border: m.has_time_limit ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        opacity: m.is_tentative ? 0.4 : 1,
                        cursor: m.is_tentative ? "not-allowed" : "pointer"
                      }}
                      onClick={() => {
                        if (m.is_tentative) return;
                        const isOpening = activeTimelineHud.index !== i || activeTimelineHud.type !== 'time';
                        setActiveTimelineHud(isOpening ? { index: i, type: 'time' } : { index: null, type: null });
                        if (isOpening) {
                          handleImportantDateChange(i, "has_time_limit", true);
                        }
                      }}
                    >
                      {m.has_time_limit && m.start_time ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-primary)' }}>
                          <Clock size={10} />
                          <span>{m.start_time}</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.6 }}>
                          <Clock size={10} />
                          <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>+ Set Time</span>
                        </div>
                      )}
                    </button>
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <button
                      className={`action-pellet ${m.cta_text && m.action_url ? 'active' : ''}`}
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        const isOpening = activeTimelineHud.index !== i || activeTimelineHud.type !== 'cta';
                        setActiveTimelineHud(isOpening ? { index: i, type: 'cta' } : { index: null, type: null });
                      }}
                    >
                      {m.cta_text && m.action_url ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '120px', overflow: 'hidden' }}>
                          <CheckCircle2 size={10} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.cta_text}</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Plus size={10} />
                          <span>Action / CTA</span>
                        </div>
                      )}
                    </button>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <button
                      className={`action-pellet ${m.resources?.video?.url ? 'active' : ''}`}
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        const isOpening = activeTimelineHud.index !== i || activeTimelineHud.type !== 'video';
                        setActiveTimelineHud(isOpening ? { index: i, type: 'video' } : { index: null, type: null });
                      }}
                    >
                      {m.resources?.video?.url && m.resources?.video?.title ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '120px', overflow: 'hidden' }}>
                          <Video size={10} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.resources.video.title}</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Plus size={10} />
                          <span>Video</span>
                        </div>
                      )}
                    </button>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => removeImportantDate(i)}
                      style={{
                        padding: "8px",
                        color: "var(--accent-danger)",
                        border: "none",
                        background: "var(--bg-app-subtle)",
                        borderRadius: "8px",
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>

                {/* --- INLINE HUD EXPANSION --- */}
                <AnimatePresence>
                  {activeTimelineHud.index === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      style={{ 
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.4)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-subtle)',
                        padding: '12px'
                      }}
                    >
                      {activeTimelineHud.type === 'time' && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Clock size={14} color="var(--accent-primary)" />
                              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>Temporal Settings</span>
                            </div>
                            <button onClick={() => setActiveTimelineHud({ index: null, type: null })} className="hover-bg-subtle" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}>
                              <X size={14} />
                            </button>
                          </div>
                          
                          <div>
                            <label className="form-label" style={{ fontSize: '0.7rem' }}>Event Time</label>
                            <input 
                              type="time" 
                              className="form-input" 
                              style={{ fontWeight: 800, fontSize: '0.9rem' }}
                              value={m.start_time || ""} 
                              onChange={(e) => {
                                handleImportantDateChange(i, "start_time", e.target.value);
                                if (!m.has_time_limit) handleImportantDateChange(i, "has_time_limit", true);
                              }} 
                            />
                            <p style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                              Set the specific hour/minute for this event.
                            </p>
                          </div>
                        </div>
                      )}

                      {activeTimelineHud.type === 'cta' && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <ExternalLink size={14} color="var(--accent-primary)" />
                              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>Configuration Action</span>
                            </div>
                            <button onClick={() => setActiveTimelineHud({ index: null, type: null })} className="hover-bg-subtle" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}>
                              <X size={14} />
                            </button>
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.6rem' }}>Button Text</label>
                            <input className="form-input" placeholder="e.g. Apply Now" value={m.cta_text || ""} onChange={(e) => handleImportantDateChange(i, "cta_text", e.target.value)} />
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.6rem' }}>URL</label>
                            <input className="form-input" placeholder="https://..." value={m.action_url || ""} onChange={(e) => handleImportantDateChange(i, "action_url", e.target.value)} />
                          </div>
                        </div>
                      )}

                      {activeTimelineHud.type === 'video' && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Video size={14} color="var(--accent-primary)" />
                              <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>Video Asset</span>
                            </div>
                            <button onClick={() => setActiveTimelineHud({ index: null, type: null })} className="hover-bg-subtle" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}>
                              <X size={14} />
                            </button>
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.6rem' }}>Title</label>
                            <input className="form-input" placeholder="e.g. Strategy Guide" value={m.resources?.video?.title || ""} onChange={(e) => handleImportantDateChange(i, "resources.video.title", e.target.value)} />
                          </div>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.6rem' }}>YouTube Link</label>
                            <input className="form-input" placeholder="https://..." value={m.resources?.video?.url || ""} onChange={(e) => handleImportantDateChange(i, "resources.video.url", e.target.value)} />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reorder.Item>
          ))}
        </Reorder.Group>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "1.5rem",
            gap: "0.75rem",
          }}
        >
          <button
            className="btn btn-primary"
            style={{ padding: "0.6rem 2rem", borderRadius: "30px" }}
            onClick={() => addImportantDate()}
          >
            <Plus size={16} /> Add Date
          </button>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            {["Result", "Physical Test", "Interview", "Admit Card", "Exam Date", "Answer Key", "Merit List"].map((pill) => (
              <button
                key={pill}
                className="btn"
                style={{
                  height: "26px",
                  padding: "0 0.75rem",
                  fontSize: "0.65rem",
                  borderRadius: "20px",
                  background: "var(--bg-app-subtle)",
                  border: "1px solid var(--border-subtle)",
                }}
                onClick={() => addImportantDate(pill)}
              >
                + {pill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const UNIVERSAL_DEGREES = [
    { id: "bsc_nursing", label: "B.Sc. (Hons.) Nursing / B.Sc. Nursing" },
    { id: "post_basic_bsc", label: "B.Sc. (Post-Certificate) / Post-Basic B.Sc. Nursing" },
    { id: "gnm", label: "Diploma in General Nursing and Midwifery (G.N.M.)" },
    { id: "diploma_psychiatry", label: "Diploma in Psychiatry" }
  ];

  const renderEducation = () => (
    <div className="animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        {renderSectionHeader(
          "Academic & Clinical Matrix",
          "Universal drawer protocol ensuring zero-ambiguity.",
          GraduationCap,
        )}
      </div>

      <div style={{ 
        background: "white", 
        padding: "1rem 1.25rem", 
        borderRadius: "14px", 
        border: "1px solid var(--border-subtle)", 
        display: "flex", 
        justifyContent: "flex-start", 
        gap: "4rem", 
        alignItems: "center", 
        marginBottom: "1.5rem",
        boxShadow: "var(--shadow-sm)"
      }}>
        <div style={{ minWidth: "180px" }}>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 800, marginBottom: "0.15rem" }}>Academic Baseline</h3>
          <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>Minimum institutional schooling.</p>
        </div>
        
        <select 
          value={activeExam.hs_science_required ? '12th_science' : (activeExam.academic_baseline || '12th')}
          onChange={(e) => {
            const val = e.target.value;
            updateExamData(p => ({ 
              ...p, 
              academic_baseline: val, 
              hs_science_required: val === '12th_science'
            }));
          }}
          style={{ 
            padding: "8px 12px", 
            borderRadius: "10px", 
            border: "1.5px solid var(--border-strong)", 
            fontSize: "0.85rem", 
            fontWeight: 700, 
            background: "var(--bg-app)",
            color: "var(--text-primary)",
            cursor: "pointer",
            outline: "none",
            minWidth: "220px"
          }}
        >
          <option value="10th">Matriculation (Standard 10th)</option>
          <option value="12th">Standard 10+2 (Higher Secondary)</option>
          <option value="12th_science">10+2 with Science (PCB Required)</option>
        </select>
      </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {UNIVERSAL_DEGREES.map((degMeta, idx) => {
            const d = degMeta.id;
            const isAuth = !!activeExam.degrees?.[d]?.allowed;
            return (
              <motion.div
                layout
                key={d}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02, translateY: -5 }}
                onClick={(e) => { 
                  if (isAuth) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setSelectedDegree({ id: d, rect }); 
                  } else {
                    handleDegreeChange(d, "allowed", true);
                  }
                }}
                className="premium-glass"
                style={{
                  padding: "1.15rem 1.4rem", 
                  cursor: "pointer",
                  borderRadius: "20px",
                  border: "none",
                  background: isAuth ? "white" : "rgba(255, 255, 255, 0.3)", 
                  boxShadow: isAuth ? "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)" : "var(--shadow-sm)",
                  display: "flex", 
                  flexDirection: "column",
                  gap: "0.85rem",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  minHeight: "140px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "12px", 
                    background: isAuth ? "var(--accent-primary-bg)" : "var(--bg-app-subtle)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    color: isAuth ? "var(--accent-primary)" : "var(--text-tertiary)",
                    transition: "all 0.2s"
                  }}>
                    <GraduationCap size={20} />
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                      <span style={{ fontSize: "0.5rem", fontWeight: 900, color: isAuth ? "var(--accent-primary)" : "var(--text-tertiary)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        {isAuth ? "Authorized" : "Disabled"}
                      </span>
                    </div>
                    {/* Integrated Toggle Visual */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDegreeChange(d, "allowed", !isAuth);
                      }}
                      style={{ 
                        width: "34px", 
                        height: "19px", 
                        borderRadius: "20px", 
                        background: isAuth ? "var(--accent-primary)" : "var(--text-tertiary)", 
                        position: "relative",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        opacity: isAuth ? 1 : 0.4,
                        cursor: "pointer"
                      }}
                    >
                      <motion.div 
                        animate={{ x: isAuth ? 16 : 2 }}
                        style={{ 
                          width: "15px", 
                          height: "15px", 
                          borderRadius: "50%", 
                          background: "white", 
                          position: "absolute", 
                          top: "2px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                        }} 
                      />
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: "0.92rem", fontWeight: 800, lineHeight: 1.3, color: isAuth ? "var(--text-primary)" : "var(--text-tertiary)" }}>
                    {degMeta.label}
                  </h4>
                  {isAuth ? (
                    <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: 'flex', flexWrap: "wrap", gap: "6px", alignItems: 'center' }}>
                        {/* Non-interactive Status Tag */}
                        <div style={{ 
                          fontSize: "0.55rem", 
                          padding: "3px 8px",
                          background: "var(--bg-app-subtle)",
                          color: "var(--text-secondary)",
                          borderRadius: "6px",
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          <Map size={9} /> {activeExam.degrees[d]?.registration_protocol?.scope === 'specific' ? activeExam.degrees[d]?.registration_protocol?.state : "National"}
                        </div>
                        {activeExam.degrees[d]?.requires_experience && (
                          <div style={{ 
                            fontSize: "0.55rem", 
                            padding: "3px 8px", 
                            background: "var(--accent-success-bg)", 
                            color: "var(--accent-success)", 
                            borderRadius: "6px",
                            fontWeight: 700,
                            textTransform: 'uppercase' 
                          }}>
                             {activeExam.degrees[d]?.req_exp_months}m Clin. Exp
                          </div>
                        )}
                      </div>
                      
                      {/* Primary Action Button */}
                      <motion.div 
                        whileHover={{ scale: 1.02, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: '8px', 
                          fontSize: '0.7rem', 
                          fontWeight: 800, 
                          color: 'white',
                          background: 'var(--accent-primary)',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginTop: '4px',
                          boxShadow: 'var(--shadow-glow)',
                          cursor: 'pointer'
                        }}>
                        <Settings size={14} fill="currentColor" />
                        Set Eligibility Rules
                      </motion.div>
                    </div>
                  ) : (
                    <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: "0.4rem", fontStyle: "italic", lineHeight: 1.4 }}>Enable this qualification to configure rules.</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      <AnimatePresence>{selectedDegree && renderEducationRuleDrawer()}</AnimatePresence>
    </div>
  );

  const renderEducationRuleDrawer = () => {
    const d = selectedDegree?.id;
    const deg = activeExam.degrees?.[d] || {};
    const degMeta = UNIVERSAL_DEGREES.find(x => x.id === d);
    
    if (!d || !deg || !degMeta) return null;

    const popupWidth = 480;

    return createPortal(
      <AnimatePresence>
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 100000, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          padding: "20px"
        }}>
          {/* Click-Outside Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDegree(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(12px)",
              zIndex: 100001
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            style={{ 
              position: "relative", 
              width: "100%",
              maxWidth: `${popupWidth}px`, 
              maxHeight: "85vh", 
              background: "white", 
              zIndex: 100002, 
              boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.45)", 
              padding: "2.5rem", 
              display: "flex", 
              flexDirection: "column", 
              borderRadius: "32px",
              border: "1px solid var(--border-subtle)",
              overflow: "hidden"
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "var(--accent-primary-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-primary)" }}>
                  <Settings size={20}/>
                </div>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: "1.1rem", lineHeight: 1.2 }}>{degMeta.label}</h3>
                  <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "1px" }}>Rule Configuration</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDegree(null)} 
                style={{ background: "var(--bg-app)", border: "none", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}
                className="hover-bg-subtle"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ overflowY: "auto", paddingRight: "4px" }} className="custom-scrollbar">
              {/* BLOCK A: Registration Council */}
              <div style={{ marginBottom: "2rem", padding: "1.25rem", background: "var(--bg-app-subtle)", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
                <h5 style={{ fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Shield size={12}/> Registration Mandate
                </h5>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "10px", background: deg.registration_protocol?.scope !== 'specific' ? "white" : "transparent", borderRadius: "10px", border: "1px solid", borderColor: deg.registration_protocol?.scope !== 'specific' ? "var(--accent-primary)" : "transparent", transition: "all 0.2s" }}>
                    <input type="radio" checked={deg.registration_protocol?.scope !== 'specific'} onChange={() => handleRegistrationProtocolChange(d, "scope", "any")} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Any State Council / INC</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "10px", background: deg.registration_protocol?.scope === 'specific' ? "white" : "transparent", borderRadius: "10px", border: "1px solid", borderColor: deg.registration_protocol?.scope === 'specific' ? "var(--accent-primary)" : "transparent", transition: "all 0.2s" }}>
                    <input type="radio" checked={deg.registration_protocol?.scope === 'specific'} onChange={() => handleRegistrationProtocolChange(d, "scope", "specific")} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>Restrict to Specific State</span>
                  </label>
                </div>

                {deg.registration_protocol?.scope === 'specific' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px dashed var(--border-subtle)" }}>
                    <label className="form-label" style={{ fontSize: "0.65rem", fontWeight: 900 }}>CHOOSE STATE BOARD</label>
                    <select className="form-select" value={deg.registration_protocol?.state || ""} onChange={(e) => handleRegistrationProtocolChange(d, "state", e.target.value)} style={{ marginTop: "4px" }}>
                      <option value="">Select Board</option>
                      {COMMON_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    
                    <div style={{ marginTop: "0.75rem" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input type="checkbox" checked={deg.registration_protocol?.allow_inc_suitability || false} onChange={(e) => handleRegistrationProtocolChange(d, "allow_inc_suitability", e.target.checked)} />
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)" }}>Enable INC Suitability Exemption</span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* BLOCK B: Conditional Experience */}
              <div style={{ padding: "1.25rem", background: "rgba(79, 70, 229, 0.03)", borderRadius: "16px", border: "1px solid rgba(79, 70, 229, 0.1)" }}>
                <h5 style={{ fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase", color: "var(--accent-primary)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Briefcase size={12}/> Clinical Experience
                </h5>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", background: deg.requires_experience ? "white" : "transparent", padding: "12px", borderRadius: "12px", cursor: "pointer", border: "1px solid", borderColor: deg.requires_experience ? "var(--accent-primary)" : "var(--border-subtle)", transition: "all 0.2s" }}>
                  <input type="checkbox" checked={deg.requires_experience || false} onChange={(e) => handleDegreeChange(d, "requires_experience", e.target.checked)} style={{ width: "18px", height: "18px" }}/>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800 }}>Mandate Clinical Experience</span>
                </label>

                {deg.requires_experience && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                    <div>
                        <label className="form-label" style={{ fontSize: "0.65rem" }}>Months Required</label>
                        <input type="number" className="form-input" style={{ fontSize: "0.9rem", fontWeight: 800 }} value={deg.req_exp_months || ""} onChange={(e) => handleDegreeChange(d, "req_exp_months", e.target.value)} placeholder="e.g. 24" />
                    </div>
                    <div>
                        <label className="form-label" style={{ fontSize: "0.65rem" }}>Min. Beds</label>
                        <input type="number" className="form-input" style={{ fontSize: "0.9rem", fontWeight: 800 }} value={deg.req_min_hospital_beds || ""} onChange={(e) => handleDegreeChange(d, "req_min_hospital_beds", e.target.value)} placeholder="e.g. 50" />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer Action */}
            <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
               <button 
                 onClick={() => setSelectedDegree(null)} 
                 className="btn btn-primary" 
                 style={{ width: "100%", height: "48px", borderRadius: "14px", fontWeight: 800, fontSize: "0.9rem" }}
               >
                 Save & Apply Rules
               </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>,
      document.body
    );
  };

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
    return (
      <div
        className="animate-in"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {/* High-Densitity Header (Nav-Aligned) */}
        {renderSectionHeader(
          "Age Eligibility Matrix",
          "Institutional benchmarks and precision gate-logic.",
          Users,
        )}

        <div className="bento-grid">
          {/* Module 1: MASTER PARAMETERS (Span 12) - Grouped for High Density */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="premium-glass"
            style={{
              gridColumn: "span 12",
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            {/* Part A: Pivot Date (The Master Reference) */}
            <div
              style={{
                gridColumn: "span 4",
                borderRight: "1px solid var(--border-subtle)",
                paddingRight: "2rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  top: "-1rem",
                  fontSize: "3.5rem",
                  fontWeight: 800,
                  color: "var(--accent-institutional)",
                  opacity: 0.04,
                  pointerEvents: "none",
                }}
              >
                {activeExam.as_on_date?.split("-")[0] || "REF"}
              </div>
              <div className="label-premium">Age as on (Cut-off)</div>
              <input
                type="date"
                name="as_on_date"
                className="input-glass"
                style={{
                  width: "100%",
                  fontWeight: 700,
                  padding: "0.6rem 0.75rem",
                }}
                value={activeExam.as_on_date || ""}
                onChange={handleTextChange}
              />
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-tertiary)",
                  marginTop: "0.75rem",
                  fontWeight: 500,
                }}
              >
                Gazette Pivot Date
              </p>
            </div>

            {/* Part B: Basic Thresholds (Universal & Male Engine) */}
            <div style={{ gridColumn: "span 8", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  right: "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "4rem",
                  fontWeight: 800,
                  color: "var(--accent-primary)",
                  opacity: 0.03,
                  pointerEvents: "none",
                }}
              >
                {activeExam.base_age_min || 18}-
                {activeExam.base_age_max_male || 35}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <div className="label-premium" style={{ margin: 0 }}>
                  Threshold Configuration
                </div>
                <div
                  onClick={() =>
                    updateExamData((p) => ({
                      ...p,
                      has_female_specific_age: !p.has_female_specific_age,
                    }))
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "4px 8px",
                    background: "var(--accent-primary-bg)",
                    borderRadius: "50px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.55rem",
                      fontWeight: 900,
                      color: activeExam.has_female_specific_age
                        ? "var(--accent-primary)"
                        : "var(--text-tertiary)",
                    }}
                  >
                    FEMALE OVERRIDE
                  </span>
                  <div
                    style={{
                      width: "24px",
                      height: "12px",
                      background: activeExam.has_female_specific_age
                        ? "var(--accent-primary)"
                        : "rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      position: "relative",
                    }}
                  >
                    <motion.div
                      animate={{
                        x: activeExam.has_female_specific_age ? 12 : 2,
                      }}
                      style={{
                        width: "8px",
                        height: "8px",
                        background: "white",
                        borderRadius: "50%",
                        position: "absolute",
                        top: "2px",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: activeExam.has_female_specific_age
                    ? "repeat(4, 1fr)"
                    : "repeat(2, 1fr)",
                  gap: "1rem",
                }}
              >
                <div>
                  <div
                    className="label-premium"
                    style={{ fontSize: "0.5rem", opacity: 0.5 }}
                  >
                    Min. Age (BASE)
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      name="base_age_min"
                      className="input-glass"
                      style={{ width: "100%", fontWeight: 700, paddingRight: '30px' }}
                      value={activeExam.base_age_min ?? ""}
                      onChange={handleNumberChange}
                    />
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', pointerEvents: 'none', textTransform: 'uppercase' }}>Yrs</span>
                  </div>
                </div>
                <div>
                  <div
                    className="label-premium"
                    style={{ fontSize: "0.5rem", opacity: 0.5 }}
                  >
                    Max. Age (BASE)
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      name="base_age_max_male"
                      className="input-glass"
                      style={{ width: "100%", fontWeight: 700, paddingRight: '30px' }}
                      value={activeExam.base_age_max_male ?? ""}
                      onChange={handleNumberChange}
                    />
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', pointerEvents: 'none', textTransform: 'uppercase' }}>Yrs</span>
                  </div>
                </div>
                {activeExam.has_female_specific_age && (
                  <>
                    <div>
                      <div
                        className="label-premium"
                        style={{
                          fontSize: "0.5rem",
                          color: "var(--accent-primary)",
                        }}
                      >
                        Min. Age (FEMALE)
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          name="base_age_min_female"
                          className="input-glass"
                          style={{
                            width: "100%",
                            fontWeight: 700,
                            borderColor: "var(--accent-primary)",
                            paddingRight: '30px'
                          }}
                          placeholder={activeExam.base_age_min}
                          value={activeExam.base_age_min_female ?? ""}
                          onChange={handleNumberChange}
                        />
                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent-primary)', opacity: 0.8, pointerEvents: 'none', textTransform: 'uppercase' }}>Yrs</span>
                      </div>
                    </div>
                    <div>
                      <div
                        className="label-premium"
                        style={{
                          fontSize: "0.5rem",
                          color: "var(--accent-primary)",
                        }}
                      >
                        Max. Age (FEMALE)
                      </div>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          name="base_age_max_female"
                          className="input-glass"
                          style={{
                            width: "100%",
                            fontWeight: 700,
                            borderColor: "var(--accent-primary)",
                            paddingRight: '30px'
                          }}
                          placeholder={activeExam.base_age_max_male}
                          value={activeExam.base_age_max_female ?? ""}
                          onChange={handleNumberChange}
                        />
                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent-primary)', opacity: 0.8, pointerEvents: 'none', textTransform: 'uppercase' }}>Yrs</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Module 2: RELAXATION MATRIX (Span 7) - Combined High-Densitity Matrix */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="premium-glass"
            style={{ gridColumn: "span 7" }}
          >
            <div className="label-premium">
              Relaxation Matrix: Category & PwBD
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "2rem",
                marginTop: "1rem",
              }}
            >
              {/* Category Vertical Stack */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                {["OBC", "SC", "ST"].map((cat) => (
                  <div
                    key={cat}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 12px",
                      background: "rgba(15, 23, 42, 0.02)",
                      borderRadius: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {cat} Benefit
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        style={{
                          width: "30px",
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid var(--border-strong)",
                          textAlign: "right",
                          fontWeight: 800,
                          color: "var(--accent-primary)",
                          fontSize: "0.85rem",
                        }}
                        value={activeExam.category_relaxations?.[cat] ?? ""}
                        onChange={(e) =>
                          handleCategoryRelaxation(cat, e.target.value)
                        }
                      />
                      <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Yrs</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* PwBD Vertical Stack */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                {["UR", "OBC", "SC"].map((pCat) => (
                  <div
                    key={pCat}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "6px 12px",
                      background: "rgba(15, 23, 42, 0.02)",
                      borderRadius: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                      }}
                    >
                      PwBD ({pCat})
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        style={{
                          width: "30px",
                          background: "transparent",
                          border: "none",
                          borderBottom: "1px solid var(--border-strong)",
                          textAlign: "right",
                          fontWeight: 800,
                          color: "var(--accent-primary)",
                          fontSize: "0.85rem",
                        }}
                        value={activeExam.pwbd_relaxations?.[pCat] ?? ""}
                        onChange={(e) =>
                          updateExamData((p) => ({
                            ...p,
                            pwbd_relaxations: {
                              ...p.pwbd_relaxations,
                              [pCat]: Number(e.target.value),
                              ...(pCat === "SC"
                                ? { ST: Number(e.target.value) }
                                : {}),
                            },
                          }))
                        }
                      />
                      <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Yrs</span>
                    </div>
                  </div>
                ))}
                
                {/* Statutory PwBD Ceiling Entry */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    marginTop: "8px",
                    background: "var(--accent-primary-bg)",
                    borderRadius: "8px",
                    border: "1px dashed var(--accent-primary-subtle)"
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 900, color: "var(--accent-primary)", textTransform: 'uppercase' }}>Maximum Age Cap (PwBD)</span>
                    <span style={{ fontSize: "0.5rem", color: "var(--text-tertiary)" }}>Absolute upper limit after all relaxations</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="number"
                      style={{
                        width: "35px",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1.5px solid var(--accent-primary)",
                        textAlign: "right",
                        fontWeight: 900,
                        color: "var(--accent-primary)",
                        fontSize: "0.9rem",
                      }}
                      placeholder="56"
                      value={activeExam.pwbd_max_age_ceiling ?? ""}
                      onChange={(e) =>
                        updateExamData((p) => ({
                          ...p,
                          pwbd_max_age_ceiling: e.target.value === "" ? "" : Number(e.target.value)
                        }))
                      }
                    />
                    <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Yrs</span>
                  </div>
                </div>
              </div>
            </div>
            <p
              style={{
                fontSize: "0.6rem",
                color: "var(--text-tertiary)",
                marginTop: "1rem",
                fontWeight: 500,
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              Inclusive grace periods as per gazette guidelines.
            </p>
          </motion.div>

          {/* Module 3: ENGINE WRAPPERS (Span 5) - ESM & Other Overrides */}
          <div
            style={{
              gridColumn: "span 5",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Compact ESM Module */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="premium-glass"
              style={{ flex: 1, position: "relative" }}
            >
              <div
                style={{
                  position: "absolute",
                  right: "-5px",
                  bottom: "-5px",
                  opacity: 0.04,
                  pointerEvents: "none",
                }}
              >
                <Shield
                  size={60}
                  color="var(--accent-institutional)"
                  strokeWidth={3}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <div className="label-premium" style={{ margin: 0 }}>
                  Ex-Servicemen
                </div>
                <div
                  onClick={() =>
                    updateExamData((p) => ({
                      ...p,
                      has_esm_relaxation: !p.has_esm_relaxation,
                    }))
                  }
                  style={{
                    width: "24px",
                    height: "12px",
                    background: activeExam.has_esm_relaxation
                      ? "var(--accent-primary)"
                      : "rgba(0,0,0,0.1)",
                    borderRadius: "10px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <motion.div
                    animate={{ x: activeExam.has_esm_relaxation ? 14 : 2 }}
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "white",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                    }}
                  />
                </div>
              </div>
              {activeExam.has_esm_relaxation ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      flex: 1,
                      background: "rgba(255,255,255,0.6)",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span
                      className="label-premium"
                      style={{
                        fontSize: "0.45rem",
                        opacity: 0.5,
                        marginBottom: "2px",
                      }}
                    >
                      Grace
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="number"
                        style={{
                          width: "42px",
                          background: "transparent",
                          border: "none",
                          fontSize: "1rem",
                          fontWeight: 800,
                          padding: 0,
                          textAlign: 'center'
                        }}
                        placeholder="0"
                        value={activeExam.esm_grace_period ?? ""}
                        onChange={(e) =>
                          updateExamData((p) => ({
                            ...p,
                            esm_grace_period: e.target.value === "" ? "" : Number(e.target.value),
                          }))
                        }
                      />
                      <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Yrs</span>
                    </div>
                  </div>

                  {/* ESM Max Age Cap */}
                  <div
                    style={{
                      flex: 1,
                      background: "var(--accent-primary-bg)",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px dashed var(--accent-primary-subtle)",
                    }}
                  >
                    <span
                      className="label-premium"
                      style={{
                        fontSize: "0.45rem",
                        color: "var(--accent-primary)",
                        fontWeight: 900,
                        marginBottom: "2px",
                        textTransform: 'uppercase'
                      }}
                    >
                      Maximum Cap
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="number"
                        style={{
                          width: "42px",
                          background: "transparent",
                          border: "none",
                          fontSize: "1rem",
                          fontWeight: 900,
                          color: "var(--accent-primary)",
                          padding: 0,
                          textAlign: 'center'
                        }}
                        placeholder="50"
                        value={activeExam.esm_max_age_ceiling ?? ""}
                        onChange={(e) =>
                          updateExamData((p) => ({
                            ...p,
                            esm_max_age_ceiling: e.target.value === "" ? "" : Number(e.target.value)
                          }))
                        }
                      />
                      <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Yrs</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 900,
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.05em",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ESM BYPASS ENABLED
                </div>
              )}
            </motion.div>

            {/* Govt Job Caution Toggle (Regulatory Module) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="premium-glass"
              style={{ flex: 1, position: "relative" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div className="label-premium" style={{ margin: 0 }}>
                    Govt. Employee Logic
                  </div>
                  <p
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--text-tertiary)",
                      fontWeight: 600,
                      marginTop: "2px",
                    }}
                  >
                    Enable Soft-Warning Caution
                  </p>
                </div>
                <div
                  onClick={() =>
                    updateExamData((p) => ({
                      ...p,
                      show_govt_caution: !p.show_govt_caution,
                    }))
                  }
                  style={{
                    width: "24px",
                    height: "12px",
                    background: activeExam.show_govt_caution
                      ? "var(--accent-institutional)"
                      : "rgba(0,0,0,0.1)",
                    borderRadius: "10px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <motion.div
                    animate={{ x: activeExam.show_govt_caution ? 14 : 2 }}
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "white",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Compact Institutional Rules */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="premium-glass"
              style={{ flex: 1 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <div className="label-premium" style={{ margin: 0 }}>
                  Marital Institutional Ruling
                </div>
                <div
                  onClick={() =>
                    updateExamData((p) => ({
                      ...p,
                      has_marital_restriction: !p.has_marital_restriction,
                    }))
                  }
                  style={{
                    width: "24px",
                    height: "12px",
                    background: activeExam.has_marital_restriction
                      ? "var(--accent-primary)"
                      : "rgba(0,0,0,0.1)",
                    borderRadius: "10px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <motion.div
                    animate={{ x: activeExam.has_marital_restriction ? 14 : 2 }}
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "white",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {["Unmarried", "Married", "Widow"].map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleMaritalStatus(s)}
                    style={{
                      fontSize: "0.6rem",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-subtle)",
                      background: activeExam.allowed_marital_statuses?.includes(
                        s,
                      )
                        ? "var(--accent-primary)"
                        : activeExam.has_marital_restriction
                          ? "white"
                          : "var(--bg-app-subtle)",
                      color: activeExam.allowed_marital_statuses?.includes(s)
                        ? "white"
                        : "var(--text-secondary)",
                      fontWeight: 700,
                      pointerEvents: activeExam.has_marital_restriction
                        ? "auto"
                        : "none",
                      opacity: activeExam.has_marital_restriction ? 1 : 0.4,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  };

  const renderJobTypeSection = () => (
    <div className="animate-in">
      {renderSectionHeader(
        "Job Domicile & Language",
        "Set the residency and language barriers exactly as per the official notification.",
        Briefcase,
      )}

      <div
        className="card"
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "24px",
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
            marginBottom: "1rem",
            display: "block",
          }}
        >
          RECRUITMENT TYPE
        </label>
        <div
          className="segmented-control"
          style={{ marginBottom: "2rem", maxWidth: "300px" }}
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
            CENTRAL GOVT.
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
            STATE GOVT.
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeExam.is_state_exam ? (
            <motion.div
              key="state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
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
                  <label className="form-label">Who can apply? (Competition Scope)</label>
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
                  <p style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", marginTop: "0.5rem" }}>
                    This setting determines if applicants from other states will be automatically blocked.
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  background: "var(--bg-app-subtle)",
                  padding: "1.25rem",
                  borderRadius: "16px",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
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
                      Regional Language Req.
                    </label>
                    <p
                      style={{
                        fontSize: "0.65rem",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      Mandatory fluency in local state language.
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
                      NOT REQ.
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
                      MANDATORY
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
                padding: "2rem",
                textAlign: "center",
                background: "var(--bg-app)",
                borderRadius: "16px",
                border: "1px dashed var(--border-strong)",
              }}
            >
              <ShieldAlert
                size={32}
                color="var(--accent-primary)"
                style={{ marginBottom: "1rem" }}
              />
              <h3 style={{ fontWeight: 800 }}>National Protocol Active</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                Competition is open to all Indian citizens. No domicile or
                language restrictions enforced by default.
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

    return (
      <div className="animate-in">
        {renderSectionHeader(
          "Exam Pattern",
          "Configure the structural tiers, negative marking, and format.",
          FileText
        )}
        <div className="card" style={{ background: "white", padding: "1.5rem", borderRadius: "24px", border: "1px solid var(--border-subtle)", marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "1rem" }}>{stageType === "prelims_mains" ? "STAGE 1: PRELIMS" : "EXAM STRUCTURE"}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label className="form-label" style={{ fontSize: "0.7rem" }}>Format</label>
              <select className="form-select" value="objective" disabled><option value="objective">Objective (MCQ)</option></select>
            </div>
            <div>
              <label className="form-label" style={{ fontSize: "0.7rem" }}>Negative Marking</label>
              <select className="form-select" value={activeExam.exam_pattern?.stage1_negative || "0.33"} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_negative: e.target.value } }))}>
                <option value="none">None</option>
                <option value="0.25">1/4 (-0.25)</option>
                <option value="0.33">1/3 (-0.33)</option>
                <option value="0.20">1/5 (-0.20)</option>
              </select>
            </div>
            <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Total Questions</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage1_qs || ""} readOnly={activeExam.exam_pattern?.stage1_sectional_enabled} style={{ opacity: activeExam.exam_pattern?.stage1_sectional_enabled ? 0.6 : 1, background: activeExam.exam_pattern?.stage1_sectional_enabled ? 'var(--bg-app-subtle)' : 'white' }} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_qs: Number(e.target.value) || 0 } }))} /></div>
            <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Total Marks</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage1_marks || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_marks: Number(e.target.value) || 0 } }))} /></div>
            <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Duration (Mins)</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage1_duration || ""} readOnly={activeExam.exam_pattern?.stage1_sectional_enabled} style={{ opacity: activeExam.exam_pattern?.stage1_sectional_enabled ? 0.6 : 1, background: activeExam.exam_pattern?.stage1_sectional_enabled ? 'var(--bg-app-subtle)' : 'white' }} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_duration: Number(e.target.value) || 0 } }))} /></div>
          </div>

          {/* New: Stage 1 Sectional Breakdown */}
          <div style={{ 
            marginTop: "1.25rem", 
            padding: "1rem", 
            background: activeExam.exam_pattern?.stage1_sectional_enabled ? "var(--accent-primary-bg)" : "var(--bg-app-subtle)", 
            borderRadius: "16px",
            border: activeExam.exam_pattern?.stage1_sectional_enabled ? "1px dashed var(--accent-primary-subtle)" : "1px solid var(--border-subtle)",
            transition: "all 0.3s ease"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <LayoutGrid style={{ color: "var(--accent-primary)" }} size={14} />
                <span style={{ fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase" }}>Sectional Breakup (Sequential)</span>
              </div>
              <div
                onClick={() =>
                  updateExamData((p) => ({
                    ...p,
                    exam_pattern: { ...p.exam_pattern, stage1_sectional_enabled: !p.exam_pattern?.stage1_sectional_enabled }
                  }))
                }
                style={{
                  width: "28px",
                  height: "14px",
                  background: activeExam.exam_pattern?.stage1_sectional_enabled
                    ? "var(--accent-primary)"
                    : "rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <motion.div
                  animate={{ x: activeExam.exam_pattern?.stage1_sectional_enabled ? 16 : 2 }}
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "white",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "2px",
                  }}
                />
              </div>
            </div>

            {activeExam.exam_pattern?.stage1_sectional_enabled && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--text-tertiary)", display: "block", marginBottom: "4px" }}>No. of Sections</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ fontSize: "0.8rem", padding: "6px" }}
                    placeholder="e.g. 5"
                    value={activeExam.exam_pattern?.stage1_sections_count || ""}
                    onChange={e => {
                      const count = Number(e.target.value);
                      const qps = activeExam.exam_pattern?.stage1_q_per_section || 0;
                      const dps = activeExam.exam_pattern?.stage1_d_per_section || 0;
                      updateExamData(p => ({ 
                        ...p, 
                        exam_pattern: { 
                          ...p.exam_pattern, 
                          stage1_sections_count: count,
                          stage1_qs: count * qps,
                          stage1_duration: count * dps
                        } 
                      }));
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--text-tertiary)", display: "block", marginBottom: "4px" }}>Qs per Section</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ fontSize: "0.8rem", padding: "6px" }}
                    placeholder="e.g. 20"
                    value={activeExam.exam_pattern?.stage1_q_per_section || ""}
                    onChange={e => {
                      const qps = Number(e.target.value);
                      const count = activeExam.exam_pattern?.stage1_sections_count || 0;
                      updateExamData(p => ({ 
                        ...p, 
                        exam_pattern: { 
                          ...p.exam_pattern, 
                          stage1_q_per_section: qps,
                          stage1_qs: count * qps
                        } 
                      }));
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--text-tertiary)", display: "block", marginBottom: "4px" }}>Time / Section (m)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ fontSize: "0.8rem", padding: "6px" }}
                    placeholder="e.g. 18"
                    value={activeExam.exam_pattern?.stage1_d_per_section || ""}
                    onChange={e => {
                      const dps = Number(e.target.value);
                      const count = activeExam.exam_pattern?.stage1_sections_count || 0;
                      updateExamData(p => ({ 
                        ...p, 
                        exam_pattern: { 
                          ...p.exam_pattern, 
                          stage1_d_per_section: dps,
                          stage1_duration: count * dps
                        } 
                      }));
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
            <label className="form-label" style={{ fontSize: "0.7rem" }}>Question Paper Language</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", maxWidth: "600px" }}>
              <select className="form-select" value={activeExam.exam_pattern?.question_language || "english"} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, question_language: e.target.value, regional_language: e.target.value === "english_state" ? p.exam_pattern?.regional_language || "" : "" } }))}>
                <option value="english">Only English</option>
                <option value="english_hindi">English + Hindi</option>
                <option value="english_state">English + State Language</option>
              </select>
              {activeExam.exam_pattern?.question_language === "english_state" && (
                <select 
                  className="form-select" 
                  value={activeExam.exam_pattern?.regional_language || ""} 
                  onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, regional_language: e.target.value } }))}
                >
                  <option value="">Select Language</option>
                  {NURSING_LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                  <option value="Assamese">Assamese</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "10px", background: "white", padding: "16px", borderRadius: "16px", cursor: "pointer", border: stageType === 'prelims_mains' ? "1px solid var(--accent-primary)" : "1px solid var(--border-subtle)", marginBottom: "1.5rem" }}>
          <input type="checkbox" checked={stageType === 'prelims_mains'} onChange={(e) => setStageType(e.target.checked ? "prelims_mains" : "single")} style={{ width: "20px", height: "20px" }}/>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 900, color: stageType === 'prelims_mains' ? "var(--accent-primary)" : "var(--text-primary)" }}>Enable Stage 2 (Mains)</div>
            <div style={{ fontSize: "0.7rem", opacity: 0.8 }}>Does this exam feature a secondary descriptive or clinical phase?</div>
          </div>
        </label>

        {stageType === "prelims_mains" && (
          <div className="card" style={{ background: "white", padding: "1.5rem", borderRadius: "24px", border: "1px dashed var(--accent-primary)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "1rem", color: "var(--accent-primary)" }}>STAGE 2: MAINS</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label className="form-label" style={{ fontSize: "0.7rem" }}>Format</label>
                <select className="form-select" value={activeExam.exam_pattern?.stage2_format || "descriptive"} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_format: e.target.value } }))}>
                  <option value="descriptive">Descriptive (Written)</option>
                  <option value="objective">Objective (MCQ)</option>
                </select>
              </div>
              {activeExam.exam_pattern?.stage2_format !== "descriptive" && (
                <div>
                  <label className="form-label" style={{ fontSize: "0.7rem" }}>Negative Marking</label>
                  <select className="form-select" value={activeExam.exam_pattern?.stage2_negative || "0.33"} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_negative: e.target.value } }))}>
                    <option value="none">None</option><option value="0.25">1/4 (-0.25)</option><option value="0.33">1/3 (-0.33)</option>
                  </select>
                </div>
              )}
              <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Total Questions</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage2_qs || ""} readOnly={activeExam.exam_pattern?.stage2_sectional_enabled} style={{ opacity: activeExam.exam_pattern?.stage2_sectional_enabled ? 0.6 : 1, background: activeExam.exam_pattern?.stage2_sectional_enabled ? 'var(--bg-app-subtle)' : 'white' }} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_qs: Number(e.target.value) || 0 } }))} /></div>
              <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Total Marks</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage2_marks || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_marks: Number(e.target.value) || 0 } }))} /></div>
              <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Duration (Mins)</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage2_duration || ""} readOnly={activeExam.exam_pattern?.stage2_sectional_enabled} style={{ opacity: activeExam.exam_pattern?.stage2_sectional_enabled ? 0.6 : 1, background: activeExam.exam_pattern?.stage2_sectional_enabled ? 'var(--bg-app-subtle)' : 'white' }} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_duration: Number(e.target.value) || 0 } }))} /></div>
            </div>

            {/* New: Stage 2 Sectional Breakdown */}
            <div style={{ 
              marginTop: "1.25rem", 
              padding: "1rem", 
              background: activeExam.exam_pattern?.stage2_sectional_enabled ? "rgba(79, 70, 229, 0.05)" : "rgba(0,0,0,0.02)", 
              borderRadius: "16px",
              border: activeExam.exam_pattern?.stage2_sectional_enabled ? "1px dashed var(--accent-primary)" : "1px solid rgba(0,0,0,0.05)",
              transition: "all 0.3s ease"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <LayoutGrid style={{ color: "var(--accent-primary)" }} size={14} />
                  <span style={{ fontSize: "0.7rem", fontWeight: 900, textTransform: "uppercase" }}>Stage 2 Sectional Breakup</span>
                </div>
                <div
                  onClick={() =>
                    updateExamData((p) => ({
                      ...p,
                      exam_pattern: { ...p.exam_pattern, stage2_sectional_enabled: !p.exam_pattern?.stage2_sectional_enabled }
                    }))
                  }
                  style={{
                    width: "28px",
                    height: "14px",
                    background: activeExam.exam_pattern?.stage2_sectional_enabled
                      ? "var(--accent-primary)"
                      : "rgba(0,0,0,0.1)",
                    borderRadius: "10px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <motion.div
                    animate={{ x: activeExam.exam_pattern?.stage2_sectional_enabled ? 16 : 2 }}
                    style={{
                      width: "10px",
                      height: "10px",
                      background: "white",
                      borderRadius: "50%",
                      position: "absolute",
                      top: "2px",
                    }}
                  />
                </div>
              </div>

              {activeExam.exam_pattern?.stage2_sectional_enabled && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--text-tertiary)", display: "block", marginBottom: "4px" }}>No. of Sections</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ fontSize: "0.8rem", padding: "6px" }}
                      placeholder="e.g. 4"
                      value={activeExam.exam_pattern?.stage2_sections_count || ""}
                      onChange={e => {
                        const count = Number(e.target.value);
                        const qps = activeExam.exam_pattern?.stage2_q_per_section || 0;
                        const dps = activeExam.exam_pattern?.stage2_d_per_section || 0;
                        updateExamData(p => ({ 
                          ...p, 
                          exam_pattern: { 
                            ...p.exam_pattern, 
                            stage2_sections_count: count,
                            stage2_qs: count * qps,
                            stage2_duration: count * dps
                          } 
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--text-tertiary)", display: "block", marginBottom: "4px" }}>Qs per Section</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ fontSize: "0.8rem", padding: "6px" }}
                      placeholder="e.g. 40"
                      value={activeExam.exam_pattern?.stage2_q_per_section || ""}
                      onChange={e => {
                        const qps = Number(e.target.value);
                        const count = activeExam.exam_pattern?.stage2_sections_count || 0;
                        updateExamData(p => ({ 
                          ...p, 
                          exam_pattern: { 
                            ...p.exam_pattern, 
                            stage2_q_per_section: qps,
                            stage2_qs: count * qps
                          } 
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.6rem", fontWeight: 800, color: "var(--text-tertiary)", display: "block", marginBottom: "4px" }}>Time / Section (m)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ fontSize: "0.8rem", padding: "6px" }}
                      placeholder="e.g. 45"
                      value={activeExam.exam_pattern?.stage2_d_per_section || ""}
                      onChange={e => {
                        const dps = Number(e.target.value);
                        const count = activeExam.exam_pattern?.stage2_sections_count || 0;
                        updateExamData(p => ({ 
                          ...p, 
                          exam_pattern: { 
                            ...p.exam_pattern, 
                            stage2_d_per_section: dps,
                            stage2_duration: count * dps
                          } 
                        }));
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(79, 70, 229, 0.1)" }}>
              <label className="form-label" style={{ fontSize: "0.7rem", color: "var(--accent-primary)" }}>Stage 2 Question Paper Language</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", maxWidth: "600px" }}>
                <select className="form-select" value={activeExam.exam_pattern?.stage2_question_language || "english"} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_question_language: e.target.value, stage2_regional_language: e.target.value === "english_state" ? p.exam_pattern?.stage2_regional_language || "" : "" } }))}>
                  <option value="english">Only English</option>
                  <option value="english_hindi">English + Hindi</option>
                  <option value="english_state">English + State Language</option>
                </select>
                {activeExam.exam_pattern?.stage2_question_language === "english_state" && (
                  <select 
                    className="form-select" 
                    value={activeExam.exam_pattern?.stage2_regional_language || ""} 
                    onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_regional_language: e.target.value } }))}
                  >
                    <option value="">Select Language</option>
                    {NURSING_LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
          <label className="label-premium" style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--accent-primary)", display: "block", marginBottom: "0.75rem" }}>
            EXAM PATTERN DESCRIPTION
          </label>
          <textarea 
            className="form-input" 
            style={{ 
              width: "100%", 
              minHeight: "120px", 
              fontSize: "0.85rem", 
              lineHeight: "1.6", 
              padding: "1rem", 
              borderRadius: "16px",
              background: "rgba(0,0,0,0.01)",
              border: "1px solid var(--border-subtle)",
              resize: "vertical"
            }}
            placeholder="Describe the overall pattern, marking nuances, or special instructions for candidates..."
            value={activeExam.exam_pattern?.description || ""}
            onChange={e => updateExamData(p => ({ 
              ...p, 
              exam_pattern: { ...p.exam_pattern, description: e.target.value } 
            }))}
          />
        </div>
      </div>
    );
  };

  const renderSyllabusSplit = () => {
    const corePercent = activeExam.syllabus?.core_percentage ?? 100;
    const nonCorePercent = activeExam.syllabus?.non_core_percentage ?? (100 - corePercent);
    
    return (
      <div className="animate-in">
        {renderSectionHeader(
          "Exam Syllabus",
          "Define the ratio between core nursing science and general aptitude.",
          BookOpen
        )}
        <div className="premium-glass" style={{ padding: "1.5rem", borderRadius: "24px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <label className="label-premium" style={{ fontSize: "0.75rem", fontWeight: 800, marginBottom: "1rem", display: "block" }}>MASTER SPLIT</label>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ background: "rgba(0,0,0,0.02)", padding: "1.25rem", borderRadius: "20px", border: "none" }}>
              <label className="label-premium" style={{ fontSize: "0.75rem", margin: 0, color: "var(--text-primary)" }}>Nursing Syllabus (%)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input 
                  type="number" 
                  className="form-input" 
                  min="0"
                  max="100"
                  value={activeExam.syllabus?.core_percentage ?? ""} 
                  onChange={e => {
                    const val = e.target.value === "" ? 0 : Math.max(0, Math.min(100, Number(e.target.value)));
                    updateExamData(p => ({ 
                      ...p, 
                      syllabus: { 
                        ...p.syllabus, 
                        core_percentage: val,
                        non_core_percentage: 100 - val
                      } 
                    }));
                  }}
                  placeholder="e.g. 50"
                  style={{ fontSize: "1.1rem", fontWeight: 800, padding: "0.75rem" }}
                />
              </div>
            </div>

            <div style={{ background: "rgba(0,0,0,0.02)", padding: "1.25rem", borderRadius: "20px", border: "none" }}>
              <label className="label-premium" style={{ fontSize: "0.75rem", margin: 0, color: "var(--text-primary)" }}>Non-Nursing Aptitude (%)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input 
                  type="number" 
                  className="form-input" 
                  min="0"
                  max="100"
                  value={activeExam.syllabus?.non_core_percentage ?? ""} 
                  onChange={e => {
                    const val = e.target.value === "" ? 0 : Math.max(0, Math.min(100, Number(e.target.value)));
                    updateExamData(p => ({ 
                      ...p, 
                      syllabus: { 
                        ...p.syllabus, 
                        non_core_percentage: val,
                        core_percentage: 100 - val
                      } 
                    }));
                  }}
                  placeholder="e.g. 50"
                  style={{ fontSize: "1.1rem", fontWeight: 800, padding: "0.75rem" }}
                />
              </div>
            </div>
          </div>

          <div className="premium-glass" style={{ padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h5 style={{ fontSize: "0.85rem", fontWeight: 800 }}>Non-Nursing Subject Breakdown</h5>
                <p style={{ fontSize: "0.65rem", color: "var(--text-tertiary)" }}>Divide the aptitude portion into specific subjects.</p>
              </div>
              <button className="btn btn-primary" style={{ fontSize: "0.7rem", padding: "6px 12px", borderRadius: "8px" }} onClick={() => updateExamData(p => ({ ...p, syllabus: { ...p.syllabus, non_core_subjects: [...(p.syllabus?.non_core_subjects || []), { name: "" }] } }))}>
                + Add Subject
              </button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {(activeExam.syllabus?.non_core_subjects || []).map((sub, idx) => (
                <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "center", background: "white", padding: "12px 20px", borderRadius: "16px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                  <input type="text" className="form-input" style={{ flex: 1, background: "transparent", border: "none", boxShadow: "none", padding: "0", fontWeight: 700 }} placeholder="Subject Name e.g. General Knowledge" value={sub.name} onChange={e => {
                    const newSubs = [...activeExam.syllabus.non_core_subjects];
                    newSubs[idx].name = e.target.value;
                    updateExamData(p => ({...p, syllabus: {...p.syllabus, non_core_subjects: newSubs}}));
                  }}/>
                  <button className="btn icon-btn" style={{ color: "var(--accent-warning)", background: "var(--accent-warning-bg)", width: "32px", height: "32px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => updateExamData(p => ({...p, syllabus: {...p.syllabus, non_core_subjects: p.syllabus.non_core_subjects.filter((_, i) => i !== idx)}}))}><Trash2 size={16}/></button>
                </div>
              ))}
              {(!activeExam.syllabus?.non_core_subjects || activeExam.syllabus?.non_core_subjects.length === 0) && (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-tertiary)", fontSize: "0.8rem", fontWeight: 600 }}>
                  No subjects added yet. Click "+ Add Subject" to begin.
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
            <label className="label-premium" style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--accent-primary)", display: "block", marginBottom: "0.75rem" }}>
              SYLLABUS DESCRIPTION
            </label>
            <textarea 
              className="form-input" 
              style={{ 
                width: "100%", 
                minHeight: "120px", 
                fontSize: "0.85rem", 
                lineHeight: "1.6", 
                padding: "1rem", 
                borderRadius: "16px",
                background: "rgba(0,0,0,0.01)",
                border: "1px solid rgba(0,0,0,0.05)",
                resize: "vertical"
              }}
              placeholder="List detailed sub-topics, reference books, or specific syllabus context for candidates..."
              value={activeExam.syllabus?.description || ""}
              onChange={e => updateExamData(p => ({ 
                ...p, 
                syllabus: { ...p.syllabus, description: e.target.value } 
              }))}
            />
          </div>
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
      <div className="animate-in">
        {renderSectionHeader(
          "Exam Fees",
          "Set exact financial burdens or waivers per category. Add custom rows for state-specific pools.",
          IndianRupee
        )}
        
        <label style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--accent-warning-bg)", padding: "16px", borderRadius: "16px", cursor: "pointer", border: "1px solid var(--accent-warning)", marginBottom: "2rem" }}>
          <input 
            type="checkbox" 
            checked={activeExam.fee_matrix?.enforce_domicile_wall || false} 
            onChange={(e) => updateExamData(p => ({ ...p, fee_matrix: { ...p.fee_matrix, enforce_domicile_wall: e.target.checked } }))} 
            style={{ width: "20px", height: "20px" }}
          />
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 900, color: "var(--accent-warning)" }}>Force full UR fee for ALL Out-of-State Candidates</div>
            <div style={{ fontSize: "0.7rem", opacity: 0.8 }}>Ignores reserve status if candidate applies across borders (MP/UP Rule).</div>
          </div>
        </label>

        <div className="premium-glass" style={{ borderRadius: "24px", border: "none", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 2fr 1fr 1fr 60px", padding: "16px 20px", background: "rgba(0,0,0,0.02)", borderBottom: "1px solid rgba(0,0,0,0.05)", fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            <div>Active</div>
            <div>Category Name</div>
            <div>Amount (₹)</div>
            <div>Waiver</div>
            <div style={{ textAlign: "center" }}>Del</div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column" }}>
            {categories.map((c, i) => (
              <div 
                key={c.id} 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "60px 2fr 1fr 1fr 60px", 
                  padding: "16px 20px", 
                  borderBottom: i === categories.length - 1 ? "none" : "1px solid rgba(0,0,0,0.04)", 
                  alignItems: "center",
                  opacity: c.active ? 1 : 0.4,
                  background: c.active ? "transparent" : "rgba(0,0,0,0.02)",
                  transition: "all 0.2s"
                }}
              >
                {/* 1. SELECT / DESELECT TOGGLE */}
                <div>
                   <input 
                    type="checkbox" 
                    checked={c.active} 
                    onChange={(e) => handleUpdateFeeCategory(c.id, "active", e.target.checked)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                   />
                </div>

                {/* 2. CATEGORY LABEL (ALWAYS EDITABLE) */}
                <div>
                  <input 
                    className="form-input" 
                    style={{ fontSize: "0.85rem", fontWeight: 800, padding: "4px 8px" }}
                    value={c.label}
                    onChange={(e) => handleUpdateFeeCategory(c.id, "label", e.target.value)}
                    placeholder="Category Title"
                  />
                </div>

                {/* 3. FEE AMOUNT */}
                <div>
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ 
                      width: "100px", fontSize: "1rem", fontWeight: 800, 
                      background: (c.waived || !c.active) ? "var(--bg-app)" : "white" 
                    }} 
                    placeholder="0" 
                    disabled={c.waived || !c.active} 
                    value={c.amount} 
                    onChange={(e) => handleUpdateFeeCategory(c.id, "amount", e.target.value)} 
                  />
                </div>

                {/* 4. WAIVER STATUS */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                   <div 
                    onClick={() => c.active && handleUpdateFeeCategory(c.id, "waived", !c.waived)}
                    style={{ 
                      display: "flex", alignItems: "center", gap: "10px", 
                      cursor: c.active ? "pointer" : "not-allowed",
                      opacity: c.waived ? 1 : 0.4
                    }}
                  >
                    <div style={{ 
                      width: "32px", height: "18px", borderRadius: "12px", 
                      background: c.waived ? "var(--accent-primary)" : "var(--text-tertiary)", 
                      position: "relative", transition: "all 0.3s"
                    }}>
                      <div style={{ 
                        width: "14px", height: "14px", borderRadius: "50%", background: "white", 
                        position: "absolute", top: "2px", 
                        left: c.waived ? "16px" : "2px", transition: "all 0.3s",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
                      }} />
                    </div>
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, opacity: c.waived ? 1 : 0.3 }}>{c.waived ? "WAIVED" : "PAYING"}</span>
                </div>

                {/* 5. DELETE ACTION (NOW FOR ALL ROWS) */}
                <div style={{ textAlign: "center" }}>
                  <button 
                    onClick={() => handleRemoveFeeCategory(c.id)}
                    className="btn-icon" 
                    style={{ color: "var(--accent-danger)", padding: "4px" }}
                    title={`Delete ${c.label}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADD NEW ROW ACTION */}
        <button 
          onClick={handleAddFeeCategory}
          style={{ 
            display: "flex", alignItems: "center", gap: "8px", 
            padding: "12px 20px", borderRadius: "12px",
            background: "white", border: "1px dashed var(--accent-primary)",
            color: "var(--accent-primary)", fontWeight: 700, fontSize: "0.85rem",
            cursor: "pointer", transition: "all 0.2s",
            width: "fit-content"
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "var(--accent-primary-bg)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "white")}
        >
          <Plus size={18} /> Add Custom Fee Category
        </button>
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
            <h1 style={{ fontWeight: 900 }}>Recruitment Hub</h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Manage eligibility engines.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={createNewExam}
            style={{ borderRadius: "30px", padding: "0.75rem 2rem" }}
          >
            <PlusCircle size={20} /> New Engine
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
                      fontSize: "0.65rem",
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
    { id: "identity", label: "Recruitment Details", icon: LayoutGrid },
    { id: "job_type", label: "Job Domicile & Language", icon: Briefcase },
    { id: "dates", label: "Timeline", icon: Clock },
    { id: "age", label: "Age Limits", icon: Users },
    { id: "edu", label: "Education", icon: GraduationCap },
    { id: "marking", label: "Exam Pattern", icon: FileText },
    { id: "syllabus", label: "Exam Syllabus", icon: BookOpen },
    { id: "fees", label: "Exam Fees", icon: IndianRupee },
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
          width: "280px",
          background: "white",
          borderRight: "1px solid var(--border-subtle)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "10px 0 30px rgba(0,0,0,0.02)",
        }}
      >
        <div
          style={{
            padding: "1.5rem 1.25rem",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                background: "var(--accent-primary)",
                color: "white",
                padding: "8px",
                borderRadius: "10px",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <Settings size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  lineHeight: 1.2,
                }}
              >
                {activeExam?.metadata?.exam_name || "Exam name"}
              </h2>
            </div>
            {isDirty && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  width: "10px",
                  height: "10px",
                  background: "var(--accent-warning)",
                  borderRadius: "50%",
                  boxShadow: "0 0 10px var(--accent-warning)",
                }}
                title="Unsaved Changes"
              />
            )}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
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
                gap: "14px",
                padding: "1rem 1.25rem",
                borderRadius: "14px",
                border: "none",
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
                fontWeight: activeSection === s.id ? 800 : 500,
                transition: "all 200ms ease",
              }}
            >
              <s.icon size={20} />
              <span>{s.label}</span>
              {activeSection === s.id && (
                <ChevronRight size={14} style={{ marginLeft: "auto" }} />
              )}
            </button>
          ))}
        </div>
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <button
            className={`btn ${showGlobalPreview ? "btn-primary" : ""}`}
            style={{
              padding: "0.6rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.75rem",
              fontWeight: 800,
              borderRadius: "10px",
              boxShadow: showGlobalPreview ? "var(--shadow-md)" : "none",
              background: showGlobalPreview ? "var(--accent-primary)" : "white",
              border: showGlobalPreview ? "none" : "1px solid var(--border-subtle)"
            }}
            onClick={() => setShowGlobalPreview(!showGlobalPreview)}
          >
            {showGlobalPreview ? (
              <CheckCircle2 size={16} color="white" />
            ) : (
              <BarChart3 size={16} />
            )}
            {showGlobalPreview ? "Hide Live Preview" : "Show HUD Preview"}
          </button>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn"
              onClick={discardChanges}
              style={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.75rem",
                flex: 1,
                borderRadius: "10px",
              }}
            >
              Discard
            </button>
            <button
              className={`btn btn-primary ${isSaved ? "success" : ""}`}
              onClick={saveConfig}
              style={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.75rem",
                flex: 1.5,
                borderRadius: "10px",
              }}
            >
              {isSaved ? "Saved" : "Deploy Engine"}
            </button>
          </div>
          <button
            onClick={handleExit}
            className="btn"
            style={{
              width: "100%",
              justifyContent: "center",
              color: "var(--text-tertiary)",
              fontSize: "0.75rem",
              fontWeight: 600,
              padding: "0.5rem",
            }}
          >
            <ChevronLeft size={16} /> Hub Matrix
          </button>
        </div>
      </div>
      <div
        className="admin-main"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2.5rem 4rem",
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
