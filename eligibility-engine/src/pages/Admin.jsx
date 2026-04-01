import React, { useState, useEffect } from "react";
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
  LayoutGrid,
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

export default function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [activeExamId, setActiveExamId] = useState(null);
  const [activeSection, setActiveSection] = useState("identity");
  const [isSaved, setIsSaved] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [notificationInputMode, setNotificationInputMode] = useState("link");
  const [logoInputMode, setLogoInputMode] = useState("link");
  const [previewDob, setPreviewDob] = useState("");
  const [customDegreeName, setCustomDegreeName] = useState("");
  const [lastSavedExams, setLastSavedExams] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [showGlobalPreview, setShowGlobalPreview] = useState(false);
  const [educationVariant, setEducationVariant] = useState("universal");

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
    setExams(exams.map((e) => (e.id === activeExamId ? updaterFn(e) : e)));
    setIsSaved(false);
    setUploadError("");
  };

  const createNewExam = () => {
    const newId = `exam-${Date.now()}`;
    const newExam = JSON.parse(JSON.stringify(templateSchema));
    newExam.id = newId;

    newExam.metadata.important_dates = NURSING_DATE_TEMPLATES.map((t, idx) => ({
      ...t,
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
            label: label || "New Event",
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
    updateExamData((prev) => ({
      ...prev,
      degrees: {
        ...prev.degrees,
        [degree]: {
          ...prev.degrees[degree],
          [field]: value,
          registration_protocol: prev.degrees[degree]
            ?.registration_protocol || {
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

  // --- RESTORED PREMIUM COMPONENT: EDUCATION CARD GRID ---

  const renderEducationGrid = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "0.75rem",
      }}
    >
      {Object.keys(activeExam.degrees || {}).map((d) => {
        const deg = activeExam.degrees[d];
        const isAuth = deg.allowed;
        return (
          <motion.div
            whileHover={{ scale: 1.02, translateY: -4 }}
            key={d}
            onClick={() => setSelectedDegree(d)}
            className={`card ${isAuth ? "active-premium" : ""}`}
            style={{
              padding: "1rem",
              cursor: "pointer",
              border: isAuth
                ? "1px solid var(--accent-primary)"
                : "1px solid var(--border-subtle)",
              background: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: "16px",
              minHeight: "140px",
              boxShadow: isAuth ? "var(--shadow-md)" : "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: isAuth
                      ? "var(--accent-primary-bg)"
                      : "var(--bg-app-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isAuth
                      ? "var(--accent-primary)"
                      : "var(--text-tertiary)",
                  }}
                >
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      textTransform: "capitalize",
                      color: "var(--text-primary)",
                    }}
                  >
                    {d.replace(/_/g, " ")}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--text-tertiary)",
                      fontWeight: 600,
                    }}
                  >
                    Protocol Active
                  </p>
                </div>
              </div>
              <button
                className="btn icon-btn"
                style={{ padding: "6px", opacity: 0.3 }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  type="checkbox"
                  style={{ width: "14px", height: "14px" }}
                  checked={isAuth}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleDegreeChange(d, "allowed", e.target.checked);
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: isAuth
                      ? "var(--text-primary)"
                      : "var(--text-tertiary)",
                  }}
                >
                  Allow Route
                </span>
              </div>

              {isAuth && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginTop: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.6rem",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "var(--bg-app)",
                      color: "var(--text-secondary)",
                      fontWeight: 800,
                    }}
                  >
                    {deg.registration_protocol?.scope === "any"
                      ? "INC/All India"
                      : deg.registration_protocol?.state || "State"}
                  </span>
                  {deg.req_exp_months > 0 && (
                    <span
                      style={{
                        fontSize: "0.6rem",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        background: "rgba(79, 70, 229, 0.08)",
                        color: "var(--accent-primary)",
                        fontWeight: 800,
                      }}
                    >
                      {deg.req_exp_months}m Exp
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      <div
        className="card"
        style={{
          border: "1px dashed var(--border-strong)",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          borderRadius: "16px",
          background: "var(--bg-app-subtle)",
        }}
      >
        <input
          className="form-input"
          style={{ fontSize: "0.75rem", padding: "6px 10px" }}
          placeholder="Custom Qualification..."
          value={customDegreeName}
          onChange={(e) => setCustomDegreeName(e.target.value)}
        />
        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "6px", fontSize: "0.75rem" }}
          onClick={() => {
            if (customDegreeName) {
              handleDegreeChange(
                customDegreeName.toLowerCase().replace(/\s+/g, "_"),
                "allowed",
                true,
              );
              setCustomDegreeName("");
            }
          }}
        >
          <Plus size={14} /> Add Degree
        </button>
      </div>
    </div>
  );

  const renderRuleDrawer = () => {
    const d = selectedDegree;
    const deg = activeExam.degrees[d];
    if (!deg) return null;
    return (
      <motion.div
        initial={{ x: "100vw" }}
        animate={{ x: 0 }}
        exit={{ x: "100vw" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "450px",
          height: "100vh",
          background: "white",
          zIndex: 1000,
          boxShadow: "-10px 0 50px rgba(0,0,0,0.15)",
          padding: "2.5rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                background: "var(--accent-primary)",
                color: "white",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <GraduationCap size={20} />
            </div>
            <div>
              <h3
                style={{
                  textTransform: "capitalize",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                }}
              >
                {d.replace(/_/g, " ")}
              </h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                Registration & Clinical Protocol
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedDegree(null)}
            className="btn icon-btn"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            <h5
              style={{
                fontSize: "0.75rem",
                fontWeight: 900,
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                marginBottom: "1.25rem",
              }}
            >
              Clinical Merit Rules
            </h5>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label className="form-label" style={{ fontSize: "0.7rem" }}>
                    Exp. Required (Months)
                  </label>
                  {deg.req_exp_months > 0 && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        color: "var(--accent-primary)",
                      }}
                    >
                      {(deg.req_exp_months / 12).toFixed(1)} y
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  className="form-input"
                  style={{ fontSize: "1rem", fontWeight: 800 }}
                  value={deg.req_exp_months ?? ""}
                  onChange={(e) =>
                    handleDegreeChange(d, "req_exp_months", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: "0.7rem" }}>
                  Min. Bed Capacity
                </label>
                <input
                  type="number"
                  className="form-input"
                  style={{ fontSize: "1rem", fontWeight: 800 }}
                  value={deg.req_min_hospital_beds ?? ""}
                  onChange={(e) =>
                    handleDegreeChange(
                      d,
                      "req_min_hospital_beds",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div>
            <h5
              style={{
                fontSize: "0.7rem",
                fontWeight: 900,
                textTransform: "uppercase",
                color: "var(--text-tertiary)",
                marginBottom: "1rem",
              }}
            >
              Nursing Council Mandate
            </h5>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}
              >
                <div style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: "0.65rem" }}>
                    Acceptance Scope
                  </label>
                  <select
                    className="form-select"
                    value={deg.registration_protocol?.scope || "any"}
                    onChange={(e) =>
                      handleRegistrationProtocolChange(
                        d,
                        "scope",
                        e.target.value,
                      )
                    }
                  >
                    <option value="any">Any Registered Nurse / INC</option>
                    <option value="specific">
                      Mandatory Specific State Only
                    </option>
                  </select>
                </div>
                {deg.registration_protocol?.scope === "specific" && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ flex: 1 }}
                  >
                    <label
                      className="form-label"
                      style={{ fontSize: "0.65rem" }}
                    >
                      Mandatory Board
                    </label>
                    <select
                      className="form-select"
                      value={deg.registration_protocol?.state || ""}
                      onChange={(e) =>
                        handleRegistrationProtocolChange(
                          d,
                          "state",
                          e.target.value,
                        )
                      }
                    >
                      <option value="">Select Board</option>
                      {COMMON_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "var(--bg-app)",
                  padding: "12px",
                  borderRadius: "12px",
                }}
              >
                <input
                  type="checkbox"
                  style={{ width: "16px", height: "16px" }}
                  checked={deg.registration_protocol?.permanent_only}
                  onChange={(e) =>
                    handleRegistrationProtocolChange(
                      d,
                      "permanent_only",
                      e.target.checked,
                    )
                  }
                />
                <div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      display: "block",
                    }}
                  >
                    Permanent Registration Only
                  </span>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    Rejects provisional or slips.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setSelectedDegree(null)}
          className="btn btn-primary"
          style={{ marginTop: "2rem", width: "100%", padding: "1rem" }}
        >
          Update Protocol
        </button>
      </motion.div>
    );
  };

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
      <button
        className={`btn ${showGlobalPreview ? "btn-primary" : ""}`}
        style={{
          borderRadius: "14px",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.85rem",
          boxShadow: showGlobalPreview ? "var(--shadow-md)" : "none",
        }}
        onClick={() => setShowGlobalPreview(!showGlobalPreview)}
      >
        {showGlobalPreview ? (
          <CheckCircle2 size={18} />
        ) : (
          <BarChart3 size={18} />
        )}
        {showGlobalPreview ? "Hide Preview" : "Card Preview"}
      </button>
    </div>
  );

  const renderIdentityHub = () => (
    <div className="animate-in">
      {renderSectionHeader(
        "Identity & Branding",
        "Establish the professional footprint of this recruitment engine.",
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
          <label
            className="form-label"
            style={{
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              marginBottom: "1rem",
              display: "block",
            }}
          >
            Primary Recruitment Identity
          </label>
          <div className="input-with-icon" style={{ marginBottom: "1rem" }}>
            <Type size={16} className="icon" />
            <input
              type="text"
              name="exam_name"
              className="form-input"
              style={{ fontSize: "1.25rem", fontWeight: 800 }}
              placeholder="Exam Title (e.g., AIIMS NORCET 8.0)"
              value={activeExam.metadata?.exam_name || ""}
              onChange={handleMetadataChange}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label className="form-label" style={{ fontSize: "0.65rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase" }}>Notification Status</label>
            <div className="segmented-control" style={{ width: "100%" }}>
              <button
                className={`segmented-btn ${activeExam.metadata?.notification_status !== "short" ? "active" : ""}`}
                onClick={() => updateExamData(prev => ({ ...prev, metadata: { ...prev.metadata, notification_status: "detailed" } }))}
              >
                Detailed / Active
              </button>
              <button
                className={`segmented-btn ${activeExam.metadata?.notification_status === "short" ? "active" : ""}`}
                onClick={() => updateExamData(prev => ({ ...prev, metadata: { ...prev.metadata, notification_status: "short" } }))}
              >
                Short / Tentative
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="input-with-icon">
              <IndianRupee size={14} className="icon" />
              <input
                type="text"
                name="salary_range"
                className="form-input"
                style={{ fontWeight: 700 }}
                placeholder="e.g., 12-13 Lakhs per Annum"
                value={activeExam.metadata?.salary_range || ""}
                onChange={handleMetadataChange}
              />
            </div>
            <div className="input-with-icon">
              <Users size={14} className="icon" />
              <input
                type="number"
                name="total_vacancies"
                className="form-input"
                placeholder="Total Vacancies"
                value={activeExam.metadata?.total_vacancies || ""}
                onChange={handleMetadataChange}
              />
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
                fontWeight: 800,
                color: "var(--text-tertiary)",
                marginBottom: "0.75rem",
                display: "block",
              }}
            >
              INSTITUTION ICON
            </label>
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
                fontWeight: 800,
                color: "var(--text-tertiary)",
                marginBottom: "0.75rem",
                display: "block",
              }}
            >
              OFFICIAL NOTIFICATION (PDF)
            </label>
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
            gridTemplateColumns: "40px 1.2fr 115px 1.4fr 0.8fr 115px 40px",
            gap: "0.5rem",
            padding: "0 0.75rem",
            marginBottom: "0.5rem",
            color: "var(--text-tertiary)",
            fontSize: "0.6rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          <div style={{ textAlign: "center" }}>Sort</div>
          <div>Event Name</div>
          <div>Official Date</div>
          <div>Primary CTA</div>
          <div>URL</div>
          <div style={{ textAlign: "center" }}>
            <Video size={10} /> Resources
          </div>
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
              style={{ listStyle: "none", marginBottom: "0.4rem" }}
            >
              <motion.div
                layout
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "40px 1.2fr 115px 1.4fr 0.8fr 115px 40px",
                  gap: "0.5rem",
                  alignItems: "center",
                  padding: "0.5rem 0.75rem",
                  background: "white",
                  borderRadius: "12px",
                  border: "1px solid var(--border-subtle)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    cursor: "grab",
                    display: "flex",
                    justifyContent: "center",
                    color: "var(--text-tertiary)",
                  }}
                >
                  <GripVertical size={16} />
                </div>
                <div className="input-group">
                  <input
                    list={`milestones-list-${i}`}
                    className="form-input"
                    style={{
                      fontWeight: 600,
                      padding: "4px 8px",
                      fontSize: "0.85rem",
                    }}
                    value={m.label || ""}
                    onChange={(e) =>
                      handleImportantDateChange(i, "label", e.target.value)
                    }
                    placeholder="Event"
                  />
                  <datalist id={`milestones-list-${i}`}>
                    {NURSING_DATE_TEMPLATES.map((t) => (
                      <option key={t.label} value={t.label} />
                    ))}
                  </datalist>
                </div>
                {activeExam.metadata?.notification_status === "short" ? (
                  <div
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      background: "var(--bg-app-subtle)",
                      border: "1px dashed var(--border-strong)",
                      borderRadius: "6px",
                      textAlign: "center",
                      color: "var(--text-tertiary)"
                    }}
                  >
                    T B A
                  </div>
                ) : (
                  <input
                    type="date"
                    className="form-input"
                    style={{ padding: "4px 8px", fontSize: "0.7rem" }}
                    value={m.date || ""}
                    onChange={(e) =>
                      handleImportantDateChange(i, "date", e.target.value)
                    }
                  />
                )}
                <input
                  className="form-input"
                  maxLength={12}
                  placeholder={activeExam.metadata?.notification_status === "short" ? "NOTIFY ME" : "Button Text"}
                  style={{ fontSize: "0.7rem", padding: "4px 8px", color: activeExam.metadata?.notification_status === "short" ? "var(--accent-primary)" : "inherit" }}
                  value={activeExam.metadata?.notification_status === "short" ? "NOTIFY ME" : m.cta_text || ""}
                  onChange={(e) =>
                    handleImportantDateChange(i, "cta_text", e.target.value)
                  }
                  disabled={activeExam.metadata?.notification_status === "short"}
                />
                <input
                  className="form-input"
                  placeholder="URL"
                  style={{ fontSize: "0.7rem", padding: "4px 8px" }}
                  value={m.action_url || ""}
                  onChange={(e) =>
                    handleImportantDateChange(i, "action_url", e.target.value)
                  }
                />
                <button
                  className="btn"
                  style={{
                    height: "30px",
                    fontSize: "0.6rem",
                    padding: "0 6px",
                    background: m.resources?.video?.url
                      ? "var(--accent-primary-subtle)"
                      : "var(--bg-app-subtle)",
                    border: "1px solid var(--border-subtle)",
                    color: m.resources?.video?.url
                      ? "var(--accent-primary)"
                      : "var(--text-secondary)",
                  }}
                  onClick={() =>
                    handleImportantDateChange(
                      i,
                      "show_popover",
                      !m.show_popover,
                    )
                  }
                >
                  {m.resources?.video?.url ? "Attached" : "+ Video"}
                </button>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => removeImportantDate(i)}
                    style={{
                      padding: "4px",
                      color: "var(--accent-danger)",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {m.show_popover && (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      marginTop: "0.4rem",
                      background: "var(--bg-app-subtle)",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      border: "1px solid var(--border-subtle)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Video size={12} color="var(--accent-primary)" />
                    <input
                      className="form-input"
                      placeholder="Video Title"
                      style={{
                        fontSize: "0.7rem",
                        padding: "4px 8px",
                        width: "30%",
                      }}
                      value={m.resources?.video?.title || ""}
                      onChange={(e) =>
                        handleImportantDateChange(
                          i,
                          "resources.video.title",
                          e.target.value,
                        )
                      }
                    />
                    <input
                      className="form-input"
                      placeholder="URL"
                      style={{
                        fontSize: "0.7rem",
                        padding: "4px 8px",
                        flex: 1,
                      }}
                      value={m.resources?.video?.url || ""}
                      onChange={(e) =>
                        handleImportantDateChange(
                          i,
                          "resources.video.url",
                          e.target.value,
                        )
                      }
                    />
                    <button
                      className="btn btn-primary"
                      style={{ height: "26px", fontSize: "0.65rem" }}
                      onClick={() =>
                        handleImportantDateChange(i, "show_popover", false)
                      }
                    >
                      Apply
                    </button>
                  </div>
                )}
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
            {["Result", "Physical Test", "Interview"].map((pill) => (
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

  const renderUniversalEducation = () => (
    <div className="animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
        {renderSectionHeader(
          "Academic & Clinical Matrix",
          "Universal drawer protocol ensuring zero-ambiguity.",
          GraduationCap,
        )}
      </div>

      {/* Foundational Schooling Component */}
      <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border-subtle)", marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.25rem" }}>Academic Baseline</h3>
        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "1rem" }}>Minimum secondary education required.</p>
        
        <div style={{ display: "flex", gap: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", background: !activeExam.hs_science_required ? "var(--bg-app)" : "transparent", padding: "8px 16px", borderRadius: "8px" }}>
            <input type="radio" checked={!activeExam.hs_science_required} onChange={() => updateExamData(p => ({ ...p, hs_science_required: false }))} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Matriculation / Standard 10+2</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", background: activeExam.hs_science_required ? "var(--bg-app)" : "transparent", padding: "8px 16px", borderRadius: "8px" }}>
            <input type="radio" checked={activeExam.hs_science_required} onChange={() => updateExamData(p => ({ ...p, hs_science_required: true }))} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>10+2 with Science (PCB)</span>
          </label>
        </div>
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
              onClick={() => { if(isAuth) setSelectedDegree(d); }}
              style={{
                padding: "1rem", borderRadius: "16px", cursor: isAuth ? "pointer" : "default",
                border: isAuth ? "2px solid var(--accent-primary)" : "1px solid var(--border-subtle)",
                background: "white", display: "flex", flexDirection: "column",
                boxShadow: isAuth ? "var(--shadow-md)" : "var(--shadow-sm)", transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                   <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: isAuth ? "var(--accent-primary-bg)" : "var(--bg-app-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: isAuth ? "var(--accent-primary)" : "var(--text-tertiary)" }}><GraduationCap size={16} /></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 800, color: isAuth ? "var(--accent-primary)" : "var(--text-tertiary)" }}>{isAuth ? "ACTIVE" : "INACTIVE"}</span>
                  <input type="checkbox" checked={!!isAuth} onChange={(e) => { e.stopPropagation(); handleDegreeChange(d, "allowed", e.target.checked); }} style={{ width: "16px", height: "16px" }}/>
                </div>
              </div>
              <h4 style={{ fontSize: "0.85rem", fontWeight: 800, lineHeight: 1.3, color: "var(--text-primary)" }}>{degMeta.label}</h4>
              
              {isAuth && (
                <div style={{ marginTop: "1rem", fontSize: "0.7rem", color: "var(--text-tertiary)", display: "flex", gap: "8px" }}>
                   <span style={{ background: "var(--bg-app)", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>{activeExam.degrees[d]?.registration_protocol?.scope === 'specific' ? activeExam.degrees[d]?.registration_protocol?.state : "National Portability"}</span>
                   {activeExam.degrees[d]?.requires_experience && <span style={{ background: "rgba(79, 70, 229, 0.08)", color: "var(--accent-primary)", padding: "2px 8px", borderRadius: "4px", fontWeight: 800 }}>{activeExam.degrees[d]?.req_exp_months}m Exp</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence>{selectedDegree && educationVariant === "universal" && renderUniversalRuleDrawer()}</AnimatePresence>
    </div>
  );

  const renderUniversalRuleDrawer = () => {
    const d = selectedDegree;
    const deg = activeExam.degrees[d] || {};
    const degMeta = UNIVERSAL_DEGREES.find(x => x.id === d);
    if (!deg || !degMeta) return null;

    return (
      <motion.div
        initial={{ x: "100vw" }} animate={{ x: 0 }} exit={{ x: "100vw" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{ position: "fixed", top: 0, right: 0, width: "450px", height: "100vh", background: "white", zIndex: 1000, boxShadow: "-10px 0 50px rgba(0,0,0,0.15)", padding: "2.5rem", display: "flex", flexDirection: "column", overflowY: "auto" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "inline-flex", padding: "6px 12px", background: "var(--bg-app)", borderRadius: "20px", fontSize: "0.65rem", fontWeight: 800, color: "var(--text-tertiary)", letterSpacing: "1px", marginBottom: "12px", alignItems: "center", gap: "6px" }}><Settings size={12}/> UNIVERSAL RULE DRAWER</div>
            <h3 style={{ fontWeight: 800, fontSize: "1.2rem", lineHeight: 1.3 }}>{degMeta.label}</h3>
          </div>
          <button onClick={() => setSelectedDegree(null)} className="btn icon-btn"><ChevronLeft size={20} /></button>
        </div>

        {/* BLOCK A: Registration Council */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h5 style={{ fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "0.25rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>WHERE MUST THEY BE REGISTERED?</h5>
          <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginBottom: "1.25rem" }}>Choose if candidates can apply from any state, or only a specific one.</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input type="radio" checked={deg.registration_protocol?.scope !== 'specific'} onChange={() => handleRegistrationProtocolChange(d, "scope", "any")} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Any State Nursing Council / INC</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <input type="radio" checked={deg.registration_protocol?.scope === 'specific'} onChange={() => handleRegistrationProtocolChange(d, "scope", "specific")} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Restrict to a specific state council</span>
            </label>
          </div>

          {deg.registration_protocol?.scope === 'specific' && (
            <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--bg-app-subtle)", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
              <label className="form-label" style={{ fontSize: "0.7rem", textTransform: "uppercase", fontWeight: 900 }}>SELECT STATE BOARD</label>
              <select className="form-select" value={deg.registration_protocol?.state || ""} onChange={(e) => handleRegistrationProtocolChange(d, "state", e.target.value)} style={{ marginBottom: "1rem", marginTop: "4px" }}>
                <option value="">Select Board</option>
                {COMMON_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="checkbox" checked={deg.registration_protocol?.allow_inc_suitability || false} onChange={(e) => handleRegistrationProtocolChange(d, "allow_inc_suitability", e.target.checked)} />
                <span style={{ fontSize: "0.7rem", fontWeight: 700 }}>Enable INC Suitability Exemption</span>
              </label>
            </div>
          )}
        </div>

        {/* BLOCK B: Conditional Experience */}
        <div>
          <h5 style={{ fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase", color: "var(--text-primary)", marginBottom: "0.25rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>EXPERIENCE PREREQUISITES</h5>
          <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginBottom: "1.25rem" }}>Set minimum clinical experience requirement.</p>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--bg-app)", padding: "12px", borderRadius: "12px", cursor: "pointer", border: deg.requires_experience ? "1px solid var(--accent-primary)" : "1px solid transparent" }}>
            <input type="checkbox" checked={deg.requires_experience || false} onChange={(e) => handleDegreeChange(d, "requires_experience", e.target.checked)} style={{ width: "18px", height: "18px" }}/>
            <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>Yes, applicants require active hospital experience</span>
          </label>

          {deg.requires_experience && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
               <div>
                  <label className="form-label" style={{ fontSize: "0.7rem" }}>Duration (Months)</label>
                  <input type="number" className="form-input" style={{ fontSize: "1rem", fontWeight: 800 }} value={deg.req_exp_months || ""} onChange={(e) => handleDegreeChange(d, "req_exp_months", e.target.value)} placeholder="e.g. 24" />
               </div>
               <div>
                  <label className="form-label" style={{ fontSize: "0.7rem" }}>Min. Bed Capacity</label>
                  <input type="number" className="form-input" style={{ fontSize: "1rem", fontWeight: 800 }} value={deg.req_min_hospital_beds || ""} onChange={(e) => handleDegreeChange(d, "req_min_hospital_beds", e.target.value)} placeholder="e.g. 50" />
               </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderEducation = () => (
    <div className="animate-in">
      <div style={{ display: "flex", background: "var(--bg-app)", padding: "4px", borderRadius: "8px", alignSelf: "flex-start", marginBottom: "2rem", width: "fit-content" }}>
        <button className="btn" style={{ padding: "6px 16px", background: educationVariant === "universal" ? "white" : "transparent", boxShadow: educationVariant === "universal" ? "var(--shadow-sm)" : "none", fontWeight: educationVariant === "universal" ? 800 : 500, color: educationVariant === "universal" ? "var(--text-primary)" : "var(--text-tertiary)", fontSize: "0.75rem", borderRadius: "6px", border: "none" }} onClick={() => setEducationVariant("universal")}>Universal Drawer (V2)</button>
        <button className="btn" style={{ padding: "6px 16px", background: educationVariant === "legacy" ? "white" : "transparent", boxShadow: educationVariant === "legacy" ? "var(--shadow-sm)" : "none", fontWeight: educationVariant === "legacy" ? 800 : 500, color: educationVariant === "legacy" ? "var(--text-primary)" : "var(--text-tertiary)", fontSize: "0.75rem", borderRadius: "6px", border: "none" }} onClick={() => setEducationVariant("legacy")}>Legacy Layout (V1)</button>
      </div>
      
      {educationVariant === "universal" ? renderUniversalEducation() : (
      <>
        {renderSectionHeader(
          "Academic & Clinical Routes",
          "Define experience mapping per qualification.",
          GraduationCap,
        )}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            marginBottom: "1.25rem",
            padding: "0.5rem",
            background: "white",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "var(--bg-app)",
              borderRadius: "20px",
            }}
          >
            <input
              type="checkbox"
              checked={activeExam.hs_science_required || false}
              onChange={() =>
                updateExamData((p) => ({
                  ...p,
                  hs_science_required: !p.hs_science_required,
                }))
              }
            />
            <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>
              12th PCB Mandatory
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "var(--bg-app)",
              borderRadius: "20px",
            }}
          >
            <input
              type="checkbox"
              checked={activeExam.requires_recognized_institute || false}
              onChange={() =>
                updateExamData((p) => ({
                  ...p,
                  requires_recognized_institute: !p.requires_recognized_institute,
                }))
              }
            />
            <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>
              INC/State Recognized Only
            </span>
          </div>
        </div>
        {renderEducationGrid()}
        <AnimatePresence>{selectedDegree && educationVariant === "legacy" && renderRuleDrawer()}</AnimatePresence>
      </>
      )}
    </div>
  );

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
                  <input
                    type="number"
                    name="base_age_min"
                    className="input-glass"
                    style={{ width: "100%", fontWeight: 700 }}
                    value={activeExam.base_age_min ?? ""}
                    onChange={handleNumberChange}
                  />
                </div>
                <div>
                  <div
                    className="label-premium"
                    style={{ fontSize: "0.5rem", opacity: 0.5 }}
                  >
                    Max. Age (BASE)
                  </div>
                  <input
                    type="number"
                    name="base_age_max_male"
                    className="input-glass"
                    style={{ width: "100%", fontWeight: 700 }}
                    value={activeExam.base_age_max_male ?? ""}
                    onChange={handleNumberChange}
                  />
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
                      <input
                        type="number"
                        name="base_age_min_female"
                        className="input-glass"
                        style={{
                          width: "100%",
                          fontWeight: 700,
                          borderColor: "var(--accent-primary)",
                        }}
                        placeholder={activeExam.base_age_min}
                        value={activeExam.base_age_min_female ?? ""}
                        onChange={handleNumberChange}
                      />
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
                      <input
                        type="number"
                        name="base_age_max_female"
                        className="input-glass"
                        style={{
                          width: "100%",
                          fontWeight: 700,
                          borderColor: "var(--accent-primary)",
                        }}
                        placeholder={activeExam.base_age_max_male}
                        value={activeExam.base_age_max_female ?? ""}
                        onChange={handleNumberChange}
                      />
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
                    <input
                      type="number"
                      style={{
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        fontSize: "1rem",
                        fontWeight: 800,
                        padding: 0,
                      }}
                      value={activeExam.esm_grace_period ?? 3}
                      onChange={(e) =>
                        updateExamData((p) => ({
                          ...p,
                          esm_grace_period: Number(e.target.value),
                        }))
                      }
                    />
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
        "Job Type Configuration",
        "Define recruitment jurisdiction, domicile, and language protocols.",
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
          RECRUITMENT JURISDICTION
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
            Central Job
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
            State Specific
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
                  <label className="form-label">Target State</label>
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
                  <label className="form-label">Competition Scope</label>
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
                    <option value="true">Open India (All Citizens)</option>
                    <option value="false">
                      Restricted (State Residents Only)
                    </option>
                  </select>
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
                      No
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
                      Yes
                    </button>
                  </div>
                </div>

                {activeExam.req_regional_language && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <label className="form-label">Specify Language</label>
                    <input
                      type="text"
                      name="target_language"
                      className="form-input"
                      placeholder="e.g. Marathi / Bengali / Tamil"
                      value={activeExam.target_language || ""}
                      onChange={handleTextChange}
                    />
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
                  <option value="Marathi">Marathi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Odia">Odia</option>
                  <option value="Punjabi">Punjabi</option>
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
    { id: "identity", label: "Identity & Branding", icon: LayoutGrid },
    { id: "job_type", label: "Job Type", icon: Briefcase },
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
              <div
                style={{
                  fontSize: "0.6rem",
                  color: "var(--accent-primary)",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                PRO COCKPIT v3.5
              </div>
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
      </div>
    </div>
  );
}
