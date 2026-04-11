import os
import re

file_path = r'c:\Users\Owner\Desktop\Job Portal\eligibility-engine\src\pages\Admin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern for the entire renderAgeLimits function
pattern = r'const renderAgeLimits = \(\) => \{[\s\S]*?\);\s*?};\s*?(?=\s*const renderJobTypeSection)'

replacement = """const renderAgeLimits = () => {
    if (!activeExam) return null;
    
    const allowedArr = activeExam.allowed_marital_statuses || ["Unmarried", "Married", "Widow", "Divorced / Separated"];
    const hasMaritalExemption = allowedArr.includes("Widow") || allowedArr.includes("Divorced / Separated");

    const toggleMaritalExemption = (val) => {
      const baseline = ["Unmarried", "Married"];
      const updated = val 
        ? [...baseline, "Widow", "Divorced / Separated"] 
        : baseline;
      updateExamData((p) => ({ ...p, allowed_marital_statuses: updated }));
    };

    const renderPremiumInput = (label, value, onChange, suffix = "Yrs", placeholder = "", color = "var(--accent-primary)") => (
      <div style={{ flex: 1 }}>
        <div className="label-premium" style={{ fontSize: "0.55rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
        <div style={{ position: 'relative', background: "white", borderRadius: "8px", border: "1.5px solid var(--border-subtle)", transition: "all 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
          <input 
            type="number" 
            className="input-glass" 
            style={{ width: "100%", fontWeight: 800, color: "#0F172A", border: "none", background: "transparent", padding: "0.5rem 0.75rem", paddingRight: "45px" }} 
            placeholder={placeholder}
            value={value ?? ""} 
            onChange={onChange} 
          />
          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.55rem', fontWeight: 900, color: color, opacity: 0.8, pointerEvents: 'none', textTransform: 'uppercase' }}>{suffix}</span>
        </div>
      </div>
    );

    return (
      <div
        className="animate-in"
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        {renderSectionHeader(
          "Age Eligibility Rules",
          "Set the standard age limits and relaxation criteria precisely as per the notification.",
          Users,
        )}

        <div className="bento-grid" style={{ alignItems: "stretch" }}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="premium-glass"
            style={{
              gridColumn: "span 12",
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: "2.5rem",
              alignItems: "center",
              padding: "1.5rem 2rem"
            }}
          >
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
                  top: "-1.25rem",
                  fontSize: "3.5rem",
                  fontWeight: 800,
                  color: "var(--accent-institutional)",
                  opacity: 0.05,
                  pointerEvents: "none",
                }}
              >
                {activeExam.as_on_date?.split("-")[0] || "REF"}
              </div>
              <div className="label-premium" style={{ fontWeight: 800, color: "#0F172A", letterSpacing: "0.02em" }}>AGE AS ON (CUT-OFF)</div>
              <input
                type="date"
                name="as_on_date"
                className="input-glass"
                style={{
                  width: "100%",
                  fontWeight: 800,
                  color: "#0F172A",
                  padding: "0.6rem 0.75rem",
                  marginTop: "8px",
                  border: "1.5px solid var(--border-strong)"
                }}
                value={activeExam.as_on_date || ""}
                onChange={handleTextChange}
              />
              <p style={{ fontSize: "0.65rem", color: "#475569", marginTop: "1rem", fontWeight: 600 }}>Age calculation pivot date</p>
            </div>

            <div style={{ gridColumn: "span 8", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  right: "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "5rem",
                  fontWeight: 800,
                  color: "var(--accent-primary)",
                  opacity: 0.03,
                  pointerEvents: "none",
                }}
              >
                {activeExam.base_age_min || 18}-{activeExam.base_age_max_male || 35}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <div className="label-premium" style={{ margin: 0, fontWeight: 800, color: "#0F172A" }}>Standard Age Limits</div>
                <div
                  onClick={() => updateExamData((p) => ({ ...p, has_female_specific_age: !p.has_female_specific_age }))}
                  style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "6px 12px", background: activeExam.has_female_specific_age ? "var(--accent-primary-bg)" : "rgba(15, 23, 42, 0.05)", borderRadius: "50px", border: activeExam.has_female_specific_age ? "1px solid var(--accent-primary-subtle)" : "1px solid transparent" }}
                >
                  <span style={{ fontSize: "0.55rem", fontWeight: 900, color: activeExam.has_female_specific_age ? "var(--accent-primary)" : "#64748b" }}>SET SEPARATE LIMITS FOR FEMALES</span>
                  <div style={{ width: "26px", height: "14px", background: activeExam.has_female_specific_age ? "var(--accent-primary)" : "#cbd5e1", borderRadius: "10px", position: "relative" }}>
                    <motion.div animate={{ x: activeExam.has_female_specific_age ? 14 : 2 }} style={{ width: "10px", height: "10px", background: "white", borderRadius: "50%", position: "absolute", top: "2px" }} />
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: activeExam.has_female_specific_age ? "repeat(4, 1fr)" : "repeat(2, 1fr)", gap: "1.25rem" }}>
                {renderPremiumInput("Minimum Age", activeExam.base_age_min, handleNumberChange, "Yrs", "", "var(--text-tertiary)")}
                {renderPremiumInput("Maximum Age", activeExam.base_age_max_male, handleNumberChange, "Yrs", "", "var(--text-tertiary)")}
                {activeExam.has_female_specific_age && (
                  <>
                    {renderPremiumInput("Min (Female)", activeExam.base_age_min_female, handleNumberChange, "Yrs", activeExam.base_age_min, "var(--accent-primary)")}
                    {renderPremiumInput("Max (Female)", activeExam.base_age_max_female, handleNumberChange, "Yrs", activeExam.base_age_max_male, "var(--accent-primary)")}
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <div style={{ gridColumn: "span 12", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.25rem", alignItems: "stretch" }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="premium-glass"
              style={{ gridColumn: "span 7", display: "flex", flexDirection: "column" }}
            >
              <div className="label-premium" style={{ fontWeight: 800, color: "#0F172A", marginBottom: "1.5rem" }}>Category-Wise Age Relaxations</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {["OBC", "SC", "ST"].map((cat) => (
                    <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(15, 23, 42, 0.03)", borderRadius: "10px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>{cat} Category</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: "white", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>GRACE</span>
                        <input type="number" style={{ width: "32px", background: "transparent", border: "none", textAlign: "right", fontWeight: 800, color: "var(--accent-primary)", fontSize: "0.9rem", outline: "none", padding: 0 }} value={activeExam.category_relaxations?.[cat] ?? ""} onChange={(e) => handleCategoryRelaxation(cat, e.target.value)} />
                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: '#94a3b8' }}>YRS</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {["UR", "OBC", "SC", "ST"].map((pCat) => (
                    <div key={pCat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(15, 23, 42, 0.03)", borderRadius: "10px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#334155" }}>PwBD ({pCat})</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: "white", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border-subtle)" }}>
                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>BENEFIT</span>
                        <input type="number" style={{ width: "32px", background: "transparent", border: "none", textAlign: "right", fontWeight: 800, color: "var(--accent-primary)", fontSize: "0.9rem", outline: "none", padding: 0 }} value={activeExam.pwbd_relaxations?.[pCat] ?? ""} onChange={(e) => handlePwBDRelaxation(pCat, e.target.value)} />
                        <span style={{ fontSize: '0.45rem', fontWeight: 900, color: '#94a3b8' }}>YRS</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: "0.65rem", color: "#475569", marginTop: "1.5rem", fontWeight: 600, textAlign: "center", background: "var(--bg-app-subtle)", padding: "6px", borderRadius: "6px" }}>Extra years allowed beyond the standard maximum age limit.</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="premium-glass"
              style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}
            >
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.6)" }}>
                <div className="label-premium" style={{ margin: 0, color: "#0F172A", fontWeight: 800 }}>Specific Group Relaxations</div>
                <p style={{ fontSize: "0.55rem", color: "#475569", marginTop: "4px", fontWeight: 700 }}>Additional rules for Military, Govt, & Widows.</p>
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.25rem 0.75rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: activeExam.has_esm_relaxation ? "var(--accent-primary-bg)" : "var(--bg-app-subtle)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                        <Shield size={16} color={activeExam.has_esm_relaxation ? "var(--accent-primary)" : "#64748b"} />
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: activeExam.has_esm_relaxation ? "#0F172A" : "#64748b" }}>Ex-Servicemen (ESM)</span>
                    </div>
                    <div onClick={() => updateExamData((p) => ({ ...p, has_esm_relaxation: !p.has_esm_relaxation }))} style={{ width: "32px", height: "16px", background: activeExam.has_esm_relaxation ? "var(--accent-primary)" : "#cbd5e1", borderRadius: "10px", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                      <motion.div animate={{ x: activeExam.has_esm_relaxation ? 18 : 2 }} style={{ width: "12px", height: "12px", background: "white", borderRadius: "50%", position: "absolute", top: "2px" }} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {activeExam.has_esm_relaxation && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", background: "var(--bg-app-subtle)", margin: "0 1.25rem 1rem 1.25rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                        <div style={{ padding: "1rem", display: "flex", gap: "1.5rem" }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: "0.5rem", color: "#64748b", fontWeight: 900, textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Grace Period (Yrs)</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                              <input type="number" style={{ width: "100%", background: "transparent", border: "none", fontSize: "0.9rem", fontWeight: 800, padding: 0, color: "#0F172A", outline: "none" }} value={activeExam.esm_grace_period ?? 3} onChange={(e) => updateExamData((p) => ({ ...p, esm_grace_period: Number(e.target.value) }))} />
                              <span style={{ fontSize: "0.5rem", fontWeight: 900, color: "#94a3b8" }}>YRS</span>
                            </div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: "0.5rem", color: "#64748b", fontWeight: 900, textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Max Ceiling</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                              <input type="number" style={{ width: "100%", background: "transparent", border: "none", fontSize: "0.9rem", fontWeight: 800, padding: 0, color: "var(--accent-primary)", outline: "none" }} placeholder="Nil" value={activeExam.esm_max_age ?? ""} onChange={(e) => updateExamData((p) => ({ ...p, esm_max_age: e.target.value ? Number(e.target.value) : "" }))} />
                              <span style={{ fontSize: "0.5rem", fontWeight: 900, color: "#94a3b8" }}>MAX</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.25rem 0.75rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: activeExam.show_govt_caution ? "var(--bg-institutional-soft)" : "var(--bg-app-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Briefcase size={16} color={activeExam.show_govt_caution ? "var(--accent-institutional)" : "#64748b"} />
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: activeExam.show_govt_caution ? "#0F172A" : "#64748b" }}>Govt. Employee Logic</span>
                    </div>
                    <div onClick={() => updateExamData((p) => ({ ...p, show_govt_caution: !p.show_govt_caution }))} style={{ width: "32px", height: "16px", background: activeExam.show_govt_caution ? "var(--accent-institutional)" : "#cbd5e1", borderRadius: "10px", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                      <motion.div animate={{ x: activeExam.show_govt_caution ? 18 : 2 }} style={{ width: "12px", height: "12px", background: "white", borderRadius: "50%", position: "absolute", top: "2px" }} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {activeExam.show_govt_caution && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", background: "var(--bg-app-subtle)", margin: "0 1.25rem 1rem 1.25rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                        <div style={{ padding: "1rem" }}>
                          <label style={{ fontSize: "0.5rem", color: "#64748b", fontWeight: 900, textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Absolute Age Ceiling (State Rules)</label>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "white", padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                            <input type="number" style={{ width: "80px", background: "transparent", border: "none", fontSize: "0.95rem", fontWeight: 800, padding: 0, color: "#0F172A", outline: "none" }} placeholder="No Limit" value={activeExam.absolute_age_ceiling ?? ""} onChange={(e) => updateExamData((p) => ({ ...p, absolute_age_ceiling: e.target.value ? Number(e.target.value) : "" }))} />
                            <p style={{ fontSize: "0.6rem", color: "#475569", fontWeight: 600, margin: 0, borderLeft: "1.5px solid var(--border-subtle)", paddingLeft: "10px" }}>Absolute cap regardless of relaxations.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.25rem 0.75rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: hasMaritalExemption ? "var(--accent-primary-bg)" : "var(--bg-app-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Users size={16} color={hasMaritalExemption ? "var(--accent-primary)" : "#64748b"} />
                      </div>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: hasMaritalExemption ? "#0F172A" : "#64748b" }}>Extend Eligibility (Widow/Divorced)</span>
                    </div>
                    <div onClick={() => toggleMaritalExemption(!hasMaritalExemption)} style={{ width: "32px", height: "16px", background: hasMaritalExemption ? "var(--accent-primary)" : "#cbd5e1", borderRadius: "10px", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                      <motion.div animate={{ x: hasMaritalExemption ? 18 : 2 }} style={{ width: "12px", height: "12px", background: "white", borderRadius: "50%", position: "absolute", top: "2px" }} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {hasMaritalExemption && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", background: "var(--bg-app-subtle)", margin: "0 1.25rem 1rem 1.25rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                        <div style={{ padding: "1rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <p style={{ fontSize: "0.6rem", color: "#475569", fontWeight: 700, margin: 0 }}>Widows & Divorced/Separated women.</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", padding: "6px 12px", borderRadius: "8px", border: "1.5px solid var(--border-subtle)", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                              <span style={{ fontSize: "0.45rem", opacity: 0.6, fontWeight: 900, textTransform: "uppercase" }}>GRACE</span>
                              <input type="number" style={{ width: "32px", background: "transparent", border: "none", fontSize: "0.95rem", fontWeight: 800, padding: 0, textAlign: "right", color: "var(--accent-primary)", outline: "none" }} value={activeExam.marital_grace_period ?? 5} onChange={(e) => updateExamData((p) => ({ ...p, marital_grace_period: Number(e.target.value) }))} />
                              <span style={{ fontSize: "0.45rem", opacity: 0.6, fontWeight: 900 }}>YRS</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  };"""

if re.search(pattern, text):
    new_text = re.sub(pattern, replacement, text)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Successfully overhauled Admin UI with Grid-Equalization and Contrast Boost")
else:
    print("Error: Could not find renderAgeLimits pattern in Admin.jsx")
