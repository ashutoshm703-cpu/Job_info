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
  X,
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

    const finalMax = baseMax + boost;

    // 3. Military Service Deduction (ESM Logic)
    let effectiveAge = age.y;
    if (hudIsEsm && activeExam.has_esm_relaxation) {
      const service = Number(hudEsmService) || 0;
      const grace = activeExam.esm_grace_period || 3;
      effectiveAge = age.y - service - grace;
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

  const renderIdentityHub = () => (
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label className="form-label" style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.4rem', display: 'block' }}>Salary</label>
              <div className="input-with-icon">
                <IndianRupee size={14} className="icon" />
                <input
                  type="text"
                  name="salary_range"
                  className="form-input"
                  style={{ fontWeight: 700 }}
                  placeholder="e.g.,  12- 13 Lakh per Anuum"
                  value={activeExam.metadata?.salary_range || ""}
                  onChange={handleMetadataChange}
                />
              </div>
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.4rem', display: 'block' }}>Advertised Vacancies</label>
              <div className="input-with-icon">
                <Users size={14} className="icon" />
                <input
                  type="number"
                  name="total_vacancies"
                  className="form-input"
                  style={{ fontWeight: 700 }}
                  placeholder="Total number of posts available"
                  value={activeExam.metadata?.total_vacancies || ""}
                  onChange={handleMetadataChange}
                />
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
                      !activeExam.metadata.image_url.startsWith("data:")
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
                      !activeExam.metadata.notification_url.startsWith("data:")
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
    </div>
  );

  const renderImportantDates = () => (
    <div className="animate-in">
      {renderSectionHeader(
        "Timeline & Schedule",
        "Establish the chronological recruitment events.",
        Clock,
      )}
      <div
        className="milestone-container"
        style={{ position: "relative", marginTop: "1.25rem" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 1fr 60px 150px 140px 140px 40px",
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
                zIndex: m.show_cta_popover || m.show_popover ? 1000 : 1 
              }}
            >
                <motion.div
                  layout
                  className="milestone-node"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr 60px 150px 140px 140px 40px",
                    gap: "0.5rem",
                    alignItems: "center",
                    padding: "0.4rem 0.75rem",
                    background: "white",
                    borderRadius: "12px",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "var(--shadow-sm)",
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
                    <input
                      type="date"
                      className="form-input"
                      style={{ 
                        padding: "6px 10px", 
                        fontSize: "0.8rem", 
                        fontWeight: 700,
                        width: "100%",
                        border: m.is_tentative ? "1px dashed var(--accent-primary)" : "1px solid var(--border-subtle)",
                        background: m.is_tentative ? "var(--bg-app-subtle)" : "white",
                        color: m.is_tentative ? "var(--accent-primary)" : "inherit"
                      }}
                      value={m.date || ""}
                      onChange={(e) =>
                        handleImportantDateChange(i, "date", e.target.value)
                      }
                    />
                  </div>
                  
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <button
                      className={`action-pellet ${m.cta_text && m.action_url ? 'active' : ''}`}
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        const isOpening = !m.show_cta_popover;
                        handleImportantDateChange(i, "show_cta_popover", isOpening);
                        if (isOpening) {
                          handleImportantDateChange(i, "show_popover", false);
                          setTimelineErrors(prev => ({ ...prev, [`${i}-cta`]: null }));
                        }
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

                    <AnimatePresence>
                      {m.show_cta_popover && (
                        <>
                          <div 
                            style={{ 
                              position: "fixed", 
                              inset: 0, 
                              zIndex: 80, 
                              cursor: "default",
                              background: "transparent" 
                            }} 
                            onClick={() => handleImportantDateChange(i, "show_cta_popover", false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            style={{
                              position: "absolute",
                              top: "calc(100% + 12px)",
                              right: 0,
                              width: "320px",
                              background: "white",
                              padding: "1rem",
                              borderRadius: "16px",
                              border: "1px solid var(--border-strong)",
                              boxShadow: "var(--shadow-lg)",
                              zIndex: 100,
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              marginBottom: '1rem' 
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ExternalLink size={14} color="var(--accent-primary)" />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Configure Action</span>
                              </div>
                              <button 
                                onClick={() => handleImportantDateChange(i, "show_cta_popover", false)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  padding: '4px',
                                  color: 'var(--text-tertiary)',
                                  cursor: 'pointer',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                className="hover-bg-subtle"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                              <div>
                                <label className="form-label" style={{ fontSize: '0.6rem' }}>Button Text</label>
                                <input
                                  className="form-input"
                                  placeholder="e.g. Apply Now"
                                  style={{ fontSize: "0.75rem" }}
                                  value={m.cta_text || ""}
                                  onChange={(e) =>
                                    handleImportantDateChange(i, "cta_text", e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <label className="form-label" style={{ fontSize: '0.6rem' }}>Destination URL</label>
                                <input
                                  className="form-input"
                                  placeholder="https://..."
                                  type="url"
                                  style={{ fontSize: "0.75rem" }}
                                  value={m.action_url || ""}
                                  onChange={(e) =>
                                    handleImportantDateChange(i, "action_url", e.target.value)
                                  }
                                />
                              </div>
                              {timelineErrors[`${i}-cta`] && (
                                <p style={{ color: 'var(--accent-danger)', fontSize: '0.6rem', marginTop: '0.25rem' }}>
                                  {timelineErrors[`${i}-cta`]}
                                </p>
                              )}
                              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                                <button
                                  className="btn"
                                  style={{ 
                                    height: "36px", 
                                    fontSize: "0.8rem", 
                                    flex: 1, 
                                    background: "transparent", 
                                    border: "1px solid var(--border-strong)",
                                    color: "var(--text-secondary)"
                                  }}
                                  onClick={() => {
                                    handleImportantDateChange(i, "cta_text", "");
                                    handleImportantDateChange(i, "action_url", "");
                                    setTimelineErrors(prev => ({ ...prev, [`${i}-cta`]: null }));
                                  }}
                                >
                                  Clear All
                                </button>
                                <button
                                  className="btn btn-primary"
                                  style={{ height: "36px", fontSize: "0.8rem", flex: 2 }}
                                  onClick={() => {
                                    const isValid = (!!m.cta_text === !!m.action_url);
                                    if (!isValid) {
                                      setTimelineErrors(prev => ({ ...prev, [`${i}-cta`]: "Label and URL both required." }));
                                      return;
                                    }
                                    setTimelineErrors(prev => ({ ...prev, [`${i}-cta`]: null }));
                                    handleImportantDateChange(i, "show_cta_popover", false);
                                  }}
                                >
                                  Done
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <button
                      className={`action-pellet ${m.resources?.video?.url ? 'active' : ''}`}
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => {
                        const isOpening = !m.show_popover;
                        handleImportantDateChange(i, "show_popover", isOpening);
                        if (isOpening) {
                          handleImportantDateChange(i, "show_cta_popover", false);
                          setTimelineErrors(prev => ({ ...prev, [`${i}-video`]: null }));
                        }
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

                    <AnimatePresence>
                      {m.show_popover && (
                        <>
                          <div 
                            style={{ 
                              position: "fixed", 
                              inset: 0, 
                              zIndex: 80, 
                              cursor: "default",
                              background: "transparent" 
                            }} 
                            onClick={() => handleImportantDateChange(i, "show_popover", false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            style={{
                              position: "absolute",
                              top: "calc(100% + 12px)",
                              right: 0,
                              width: "320px",
                              background: "white",
                              padding: "1rem",
                              borderRadius: "16px",
                              border: "1px solid var(--border-strong)",
                              boxShadow: "var(--shadow-lg)",
                              zIndex: 100,
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              marginBottom: '1rem' 
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Video size={14} color="var(--accent-primary)" />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Video Resource</span>
                              </div>
                              <button 
                                onClick={() => handleImportantDateChange(i, "show_popover", false)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  padding: '4px',
                                  color: 'var(--text-tertiary)',
                                  cursor: 'pointer',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                className="hover-bg-subtle"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                              <div>
                                <label className="form-label" style={{ fontSize: '0.6rem' }}>Video Title</label>
                                  <input
                                    className="form-input"
                                    placeholder="e.g. Strategy Guide"
                                    style={{ fontSize: "0.75rem" }}
                                    value={m.resources?.video?.title || ""}
                                    onChange={(e) =>
                                      handleImportantDateChange(i, "resources.video.title", e.target.value)
                                    }
                                  />
                              </div>
                              <div>
                                  <label className="form-label" style={{ fontSize: '0.6rem' }}>YouTube URL</label>
                                  <input
                                    className="form-input"
                                    placeholder="https://youtube..."
                                    type="url"
                                    style={{ fontSize: "0.75rem" }}
                                    value={m.resources?.video?.url || ""}
                                    onChange={(e) =>
                                      handleImportantDateChange(i, "resources.video.url", e.target.value)
                                    }
                                  />
                              </div>
                              {timelineErrors[`${i}-video`] && (
                                <p style={{ color: 'var(--accent-danger)', fontSize: '0.6rem', marginTop: '0.25rem' }}>
                                  {timelineErrors[`${i}-video`]}
                                </p>
                              )}
                              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                                <button
                                  className="btn"
                                  style={{ 
                                    height: "36px", 
                                    fontSize: "0.8rem", 
                                    flex: 1, 
                                    background: "transparent", 
                                    border: "1px solid var(--border-strong)",
                                    color: "var(--text-secondary)"
                                  }}
                                  onClick={() => {
                                    handleImportantDateChange(i, "resources.video.title", "");
                                    handleImportantDateChange(i, "resources.video.url", "");
                                    setTimelineErrors(prev => ({ ...prev, [`${i}-video`]: null }));
                                  }}
                                >
                                  Clear All
                                </button>
                                <button
                                  className="btn btn-primary"
                                  style={{ height: "36px", fontSize: "0.8rem", flex: 2 }}
                                  onClick={() => {
                                    const isValid = (!!m.resources?.video?.title === !!m.resources?.video?.url);
                                    if (!isValid) {
                                      setTimelineErrors(prev => ({ ...prev, [`${i}-video`]: "Title and YouTube URL both required." }));
                                      return;
                                    }
                                    setTimelineErrors(prev => ({ ...prev, [`${i}-video`]: null }));
                                    handleImportantDateChange(i, "show_popover", false);
                                  }}
                                >
                                  Ready
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", zIndex: 1 }}>
                    <button
                      onClick={() => removeImportantDate(i)}
                      style={{
                        padding: "4px",
                        color: "var(--accent-danger)",
                        border: "none",
                        background: "transparent",
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
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

      {/* Degree Block */}
      <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem" }}>Permissible Qualifications</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
        {UNIVERSAL_DEGREES.map((degMeta) => {
          const d = degMeta.id;
          const isAuth = activeExam.degrees?.[d]?.allowed;
          return (
            <div
              key={d}
              onClick={(e) => { 
                if (isAuth) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  if (selectedDegree?.id === d) {
                    setSelectedDegree(null);
                  } else {
                    setSelectedDegree({ id: d, rect }); 
                  }
                }
              }}
              style={{
                padding: "1.25rem", 
                borderRadius: "20px", 
                cursor: "pointer",
                border: isAuth ? "2px solid var(--accent-primary)" : "1.2px solid var(--border-subtle)",
                background: "white", 
                display: "flex", 
                flexDirection: "column",
                boxShadow: isAuth ? "var(--shadow-md)" : "var(--shadow-sm)", 
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden"
              }}
              className="degree-card-hover"
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <input 
                    type="checkbox" 
                    checked={!!isAuth} 
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => { 
                      e.stopPropagation(); 
                      handleDegreeChange(d, "allowed", e.target.checked); 
                    }} 
                    style={{ 
                      width: "24px", 
                      height: "24px", 
                      cursor: "pointer",
                      accentColor: "var(--accent-primary)"
                    }}
                  />
                  <div style={{ 
                    width: "40px", 
                    height: "40px", 
                    borderRadius: "10px", 
                    background: isAuth ? "var(--accent-primary-bg)" : "var(--bg-app-subtle)", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    color: isAuth ? "var(--accent-primary)" : "var(--text-tertiary)",
                    transition: "all 0.2s"
                  }}>
                    <GraduationCap size={20} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "0.6rem", fontWeight: 900, color: isAuth ? "var(--accent-primary)" : "var(--text-tertiary)", letterSpacing: "0.5px" }}>
                    {isAuth ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              </div>
              <h4 style={{ fontSize: "0.9rem", fontWeight: 800, lineHeight: 1.4, color: isAuth ? "var(--text-primary)" : "var(--text-secondary)" }}>
                {degMeta.label}
              </h4>
              
              {isAuth ? (
                <div style={{ marginTop: "1.25rem", fontSize: "0.7rem", color: "var(--text-tertiary)", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                   <span style={{ background: "var(--bg-app)", padding: "4px 10px", borderRadius: "6px", fontWeight: 700 }}>
                     {activeExam.degrees[d]?.registration_protocol?.scope === 'specific' ? activeExam.degrees[d]?.registration_protocol?.state : "National Portability"}
                   </span>
                   {activeExam.degrees[d]?.requires_experience && (
                     <span style={{ background: "rgba(79, 70, 229, 0.08)", color: "var(--accent-primary)", padding: "4px 10px", borderRadius: "6px", fontWeight: 800 }}>
                       {activeExam.degrees[d]?.req_exp_months}m Exp Required
                     </span>
                   )}
                </div>
              ) : (
                <div style={{ marginTop: "1rem", fontSize: "0.65rem", color: "var(--text-tertiary)", fontStyle: "italic" }}>
                  Tap to enable and configure rules.
                </div>
              )}
            </div>
          )
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
                          width: "30px",
                          background: "transparent",
                          border: "none",
                          fontSize: "1rem",
                          fontWeight: 800,
                          padding: 0,
                          textAlign: 'right'
                        }}
                        value={activeExam.esm_grace_period ?? 3}
                        onChange={(e) =>
                          updateExamData((p) => ({
                            ...p,
                            esm_grace_period: Number(e.target.value),
                          }))
                        }
                      />
                      <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Yrs</span>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.55rem",
                      fontWeight: 800,
                      color: "var(--accent-primary)",
                      background: "var(--accent-primary-bg)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    ENGINE ACTIVE
                  </span>
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
            <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Total Questions</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage1_qs || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_qs: Number(e.target.value) } }))} /></div>
            <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Total Marks</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage1_marks || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_marks: Number(e.target.value) } }))} /></div>
            <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Duration (Mins)</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage1_duration || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage1_duration: Number(e.target.value) } }))} /></div>
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
              <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Total Questions</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage2_qs || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_qs: Number(e.target.value) } }))} /></div>
              <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Total Marks</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage2_marks || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_marks: Number(e.target.value) } }))} /></div>
              <div><label className="form-label" style={{ fontSize: "0.7rem" }}>Duration (Mins)</label><input type="number" className="form-input" value={activeExam.exam_pattern?.stage2_duration || ""} onChange={e => updateExamData(p => ({ ...p, exam_pattern: { ...p.exam_pattern, stage2_duration: Number(e.target.value) } }))} /></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSyllabusSplit = () => {
    const corePercent = activeExam.syllabus?.core_percentage || 50;
    const nonCorePercent = activeExam.syllabus?.non_core_percentage ?? (100 - corePercent);
    
    return (
      <div className="animate-in">
        {renderSectionHeader(
          "Exam Syllabus",
          "Define the ratio between core nursing science and general aptitude.",
          BookOpen
        )}
        <div className="card" style={{ background: "white", padding: "1.5rem", borderRadius: "24px", border: "1px solid var(--border-subtle)" }}>
          <label className="form-label" style={{ fontSize: "0.75rem", fontWeight: 800, marginBottom: "1rem", display: "block" }}>MASTER SPLIT</label>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ background: "var(--bg-app-subtle)", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
              <label className="form-label" style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-primary)" }}>Nursing Syllabus (%)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input 
                  type="number" 
                  className="form-input" 
                  value={corePercent} 
                  onChange={e => updateExamData(p => ({ 
                    ...p, 
                    syllabus: { 
                      ...p.syllabus, 
                      core_percentage: Number(e.target.value),
                      non_core_percentage: 100 - Number(e.target.value)
                    } 
                  }))} 
                  placeholder="e.g. 50"
                  style={{ fontSize: "1.1rem", fontWeight: 800, padding: "0.75rem" }}
                />
              </div>
            </div>

            <div style={{ background: "var(--bg-app-subtle)", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
              <label className="form-label" style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--text-primary)" }}>Non-Nursing Aptitude (%)</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input 
                  type="number" 
                  className="form-input" 
                  value={nonCorePercent} 
                  onChange={e => updateExamData(p => ({ 
                    ...p, 
                    syllabus: { 
                      ...p.syllabus, 
                      non_core_percentage: Number(e.target.value),
                      core_percentage: 100 - Number(e.target.value)
                    } 
                  }))} 
                  placeholder="e.g. 50"
                  style={{ fontSize: "1.1rem", fontWeight: 800, padding: "0.75rem" }}
                />
              </div>
            </div>
          </div>

          {nonCorePercent > 0 && (
            <div style={{ background: "var(--bg-app)", padding: "1.5rem", borderRadius: "16px", border: "1px dashed var(--border-strong)" }}>
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
                  <div key={idx} style={{ display: "flex", gap: "1rem", alignItems: "center", background: "white", padding: "10px 16px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
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
          )}
        </div>
      </div>
    );
  };

  const renderFeeStructure = () => {
    const categories = [
      { id: "UR", label: "Unreserved (UR)" },
      { id: "OBC", label: "OBC" },
      { id: "EWS", label: "EWS" },
      { id: "SC_ST", label: "SC / ST" },
      { id: "Women", label: "Women (All Cats)" },
      { id: "PwBD", label: "PwBD (Disability)" },
      { id: "ESM", label: "Ex-Servicemen" }
    ];

    const getFee = (id) => activeExam.fee_matrix?.[id]?.amount ?? "";
    const getWaived = (id) => activeExam.fee_matrix?.[id]?.waived ?? false;
    
    const setFee = (id, amount) => updateExamData(p => ({ ...p, fee_matrix: { ...p.fee_matrix, [id]: { ...p.fee_matrix?.[id], amount: Number(amount), waived: false } } }));
    const setWaived = (id, waived) => updateExamData(p => ({ ...p, fee_matrix: { ...p.fee_matrix, [id]: { ...p.fee_matrix?.[id], amount: "", waived } } }));

    return (
      <div className="animate-in">
        {renderSectionHeader(
          "Exam Fees",
          "Set exact financial burdens or waivers per category. Overrides apply chronologically.",
          IndianRupee
        )}
        
        <label style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--accent-warning-bg)", padding: "16px", borderRadius: "16px", cursor: "pointer", border: "1px solid var(--accent-warning)", marginBottom: "2rem" }}>
          <input type="checkbox" checked={activeExam.fee_matrix?.enforce_domicile_wall || false} onChange={(e) => updateExamData(p => ({ ...p, fee_matrix: { ...p.fee_matrix, enforce_domicile_wall: e.target.checked } }))} style={{ width: "20px", height: "20px" }}/>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 900, color: "var(--accent-warning)" }}>Force full UR fee for ALL Out-of-State Candidates</div>
            <div style={{ fontSize: "0.7rem", opacity: 0.8 }}>Ignores reserve status if candidate applies across borders (MP/UP Rule).</div>
          </div>
        </label>

        <div className="card" style={{ background: "white", borderRadius: "24px", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", padding: "12px 20px", background: "var(--bg-app-subtle)", borderBottom: "1px solid var(--border-subtle)", fontSize: "0.65rem", fontWeight: 900, textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            <div>Applicant Category</div>
            <div>Fee Amount (₹)</div>
            <div>Total Exemption</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {categories.map((c, i) => (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", padding: "16px 20px", borderBottom: i === categories.length - 1 ? "none" : "1px solid var(--border-subtle)", alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{c.label}</div>
                <div>
                  <input type="number" className="form-input" style={{ width: "100px", fontSize: "1rem", fontWeight: 800, background: getWaived(c.id) ? "var(--bg-app)" : "white" }} placeholder="0" disabled={getWaived(c.id)} value={getFee(c.id)} onChange={(e) => setFee(c.id, e.target.value)} />
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input type="checkbox" checked={getWaived(c.id)} onChange={(e) => setWaived(c.id, e.target.checked)} style={{ width: "18px", height: "18px" }}/>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: getWaived(c.id) ? "var(--text-primary)" : "var(--text-tertiary)" }}>Waived</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
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

        {activeSection === "fees" && renderFeeStructure()}
        {showGlobalPreview && renderLiveStudentCardHUD()}
        {renderEducationRuleDrawer()}
      </div>
    </div>
  );
}
