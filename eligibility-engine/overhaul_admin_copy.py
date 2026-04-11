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

    return (
      <div
        className="animate-in"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {renderSectionHeader(
          "Age Eligibility Rules",
          "Set the exact age limits and relaxation criteria for this notification.",
          Users,
        )}

        <div className="bento-grid">
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
              <div className="label-premium">AGE AS ON (CUT-OFF)</div>
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
              <p style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", marginTop: "0.75rem", fontWeight: 500 }}>Age is calculated as of this date.</p>
            </div>

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
                {activeExam.base_age_min || 18}-{activeExam.base_age_max_male || 35}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div className="label-premium" style={{ margin: 0 }}>Standard Age Limits</div>
                <div
                  onClick={() => updateExamData((p) => ({ ...p, has_female_specific_age: !p.has_female_specific_age }))}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "4px 8px", background: "var(--accent-primary-bg)", borderRadius: "50px" }}
                >
                  <span style={{ fontSize: "0.55rem", fontWeight: 900, color: activeExam.has_female_specific_age ? "var(--accent-primary)" : "var(--text-tertiary)" }}>FEMALE LIMITS</span>
                  <div style={{ width: "24px", height: "12px", background: activeExam.has_female_specific_age ? "var(--accent-primary)" : "rgba(0,0,0,0.1)", borderRadius: "10px", position: "relative" }}>
                    <motion.div animate={{ x: activeExam.has_female_specific_age ? 12 : 2 }} style={{ width: "8px", height: "8px", background: "white", borderRadius: "50%", position: "absolute", top: "2px" }} />
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: activeExam.has_female_specific_age ? "repeat(4, 1fr)" : "repeat(2, 1fr)", gap: "1rem" }}>
                <div>
                  <div className="label-premium" style={{ fontSize: "0.5rem", opacity: 0.5 }}>Minimum Age</div>
                  <div style={{ position: 'relative' }}>
                    <input type="number" name="base_age_min" className="input-glass" style={{ width: "100%", fontWeight: 700, paddingRight: '30px' }} value={activeExam.base_age_min ?? ""} onChange={handleNumberChange} />
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', pointerEvents: 'none', textTransform: 'uppercase' }}>Yrs</span>
                  </div>
                </div>
                <div>
                  <div className="label-premium" style={{ fontSize: "0.5rem", opacity: 0.5 }}>Maximum Age</div>
                  <div style={{ position: 'relative' }}>
                    <input type="number" name="base_age_max_male" className="input-glass" style={{ width: "100%", fontWeight: 700, paddingRight: '30px' }} value={activeExam.base_age_max_male ?? ""} onChange={handleNumberChange} />
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', pointerEvents: 'none', textTransform: 'uppercase' }}>Yrs</span>
                  </div>
                </div>
                {activeExam.has_female_specific_age && (
                  <>
                    <div>
                      <div className="label-premium" style={{ fontSize: "0.5rem", color: "var(--accent-primary)" }}>Min. Age (Female)</div>
                      <div style={{ position: 'relative' }}>
                        <input type="number" name="base_age_min_female" className="input-glass" style={{ width: "100%", fontWeight: 700, borderColor: "var(--accent-primary)", paddingRight: '30px' }} placeholder={activeExam.base_age_min} value={activeExam.base_age_min_female ?? ""} onChange={handleNumberChange} />
                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent-primary)', opacity: 0.8, pointerEvents: 'none', textTransform: 'uppercase' }}>Yrs</span>
                      </div>
                    </div>
                    <div>
                      <div className="label-premium" style={{ fontSize: "0.5rem", color: "var(--accent-primary)" }}>Max. Age (Female)</div>
                      <div style={{ position: 'relative' }}>
                        <input type="number" name="base_age_max_female" className="input-glass" style={{ width: "100%", fontWeight: 700, borderColor: "var(--accent-primary)", paddingRight: '30px' }} placeholder={activeExam.base_age_max_male} value={activeExam.base_age_max_female ?? ""} onChange={handleNumberChange} />
                        <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent-primary)', opacity: 0.8, pointerEvents: 'none', textTransform: 'uppercase' }}>Yrs</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="premium-glass"
            style={{ gridColumn: "span 7" }}
          >
            <div className="label-premium">Category-Wise Age Relaxations</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {["OBC", "SC", "ST"].map((cat) => (
                  <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", background: "rgba(15, 23, 42, 0.02)", borderRadius: "8px" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)" }}>{cat} Category</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input type="number" style={{ width: "45px", background: "transparent", border: "none", borderBottom: "1px solid var(--border-strong)", textAlign: "right", fontWeight: 800, color: "var(--accent-primary)", fontSize: "0.85rem" }} value={activeExam.category_relaxations?.[cat] ?? ""} onChange={(e) => handleCategoryRelaxation(cat, e.target.value)} />
                      <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Yrs</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {["UR", "OBC", "SC", "ST"].map((pCat) => (
                  <div key={pCat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", background: "rgba(15, 23, 42, 0.02)", borderRadius: "8px" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-secondary)" }}>PwBD ({pCat})</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input type="number" style={{ width: "45px", background: "transparent", border: "none", borderBottom: "1px solid var(--border-strong)", textAlign: "right", fontWeight: 800, color: "var(--accent-primary)", fontSize: "0.85rem" }} value={activeExam.pwbd_relaxations?.[pCat] ?? ""} onChange={(e) => handlePwBDRelaxation(pCat, e.target.value)} />
                      <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Yrs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: "0.6rem", color: "var(--text-tertiary)", marginTop: "1rem", fontWeight: 500, fontStyle: "italic", textAlign: "center" }}>Extra years allowed beyond the standard maximum age.</p>
          </motion.div>

          <div style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="premium-glass"
              style={{ display: "flex", flexDirection: "column", padding: 0 }}
            >
              <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-subtle)", background: "rgba(255,255,255,0.4)" }}>
                <div className="label-premium" style={{ margin: 0, color: "var(--text-primary)" }}>Specific Group Relaxations</div>
                <p style={{ fontSize: "0.55rem", color: "var(--text-tertiary)", marginTop: "2px", fontWeight: 600 }}>Additional rules for Military, Govt, & Widows.</p>
              </div>

              <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1rem 0.65rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: activeExam.has_esm_relaxation ? "var(--accent-primary-bg)" : "var(--bg-app-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Shield size={14} color={activeExam.has_esm_relaxation ? "var(--accent-primary)" : "var(--text-tertiary)"} />
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>Ex-Servicemen (ESM)</span>
                  </div>
                  <div onClick={() => updateExamData((p) => ({ ...p, has_esm_relaxation: !p.has_esm_relaxation }))} style={{ width: "28px", height: "14px", background: activeExam.has_esm_relaxation ? "var(--accent-primary)" : "rgba(0,0,0,0.1)", borderRadius: "10px", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                    <motion.div animate={{ x: activeExam.has_esm_relaxation ? 16 : 2 }} style={{ width: "10px", height: "10px", background: "white", borderRadius: "50%", position: "absolute", top: "2px" }} />
                  </div>
                </div>
                <AnimatePresence>
                  {activeExam.has_esm_relaxation && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", background: "var(--bg-app-subtle)", margin: "0 1rem 0.75rem 1rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ padding: "0.75rem", display: "flex", gap: "1.5rem" }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: "0.55rem", color: "var(--text-tertiary)", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Grace Period (Years)</label>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <input type="number" className="form-input" style={{ width: "100%", height: "32px", fontSize: "0.85rem", fontWeight: 800, padding: "0 8px" }} value={activeExam.esm_grace_period ?? 3} onChange={(e) => updateExamData((p) => ({ ...p, esm_grace_period: Number(e.target.value) }))} />
                            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--text-tertiary)" }}>YRS</span>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: "0.55rem", color: "var(--text-tertiary)", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Max Allowable Age</label>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <input type="number" className="form-input" placeholder="Nil" style={{ width: "100%", height: "32px", fontSize: "0.85rem", fontWeight: 800, padding: "0 8px", color: "var(--accent-primary)" }} value={activeExam.esm_max_age ?? ""} onChange={(e) => updateExamData((p) => ({ ...p, esm_max_age: e.target.value ? Number(e.target.value) : "" }))} />
                            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "var(--text-tertiary)" }}>MAX</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1rem 0.65rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: activeExam.show_govt_caution ? "var(--bg-institutional-soft)" : "var(--bg-app-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Briefcase size={14} color={activeExam.show_govt_caution ? "var(--accent-institutional)" : "var(--text-tertiary)"} />
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>Govt. Employee Logic</span>
                  </div>
                  <div onClick={() => updateExamData((p) => ({ ...p, show_govt_caution: !p.show_govt_caution }))} style={{ width: "28px", height: "14px", background: activeExam.show_govt_caution ? "var(--accent-institutional)" : "rgba(0,0,0,0.1)", borderRadius: "10px", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                    <motion.div animate={{ x: activeExam.show_govt_caution ? 16 : 2 }} style={{ width: "10px", height: "10px", background: "white", borderRadius: "50%", position: "absolute", top: "2px" }} />
                  </div>
                </div>
                <AnimatePresence>
                  {activeExam.show_govt_caution && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", background: "var(--bg-app-subtle)", margin: "0 1rem 0.75rem 1rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ padding: "0.75rem" }}>
                        <label style={{ fontSize: "0.55rem", color: "var(--text-tertiary)", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Universal Age Ceiling (Global)</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <input type="number" className="form-input" placeholder="No Limit" style={{ width: "120px", height: "32px", fontSize: "0.85rem", fontWeight: 800, padding: "0 8px", color: "var(--accent-primary)" }} value={activeExam.absolute_age_ceiling ?? ""} onChange={(e) => updateExamData((p) => ({ ...p, absolute_age_ceiling: e.target.value ? Number(e.target.value) : "" }))} />
                          <p style={{ fontSize: "0.6rem", color: "var(--text-tertiary)", fontWeight: 600, margin: 0 }}>This is an absolute cap regardless of any relaxations.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1rem 0.65rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: hasMaritalExemption ? "var(--accent-primary-bg)" : "var(--bg-app-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Users size={14} color={hasMaritalExemption ? "var(--accent-primary)" : "var(--text-tertiary)"} />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", display: "block" }}>Extend Eligibility (Widow/Divorced)</span>
                    </div>
                  </div>
                  <div onClick={() => toggleMaritalExemption(!hasMaritalExemption)} style={{ width: "28px", height: "14px", background: hasMaritalExemption ? "var(--accent-primary)" : "rgba(0,0,0,0.1)", borderRadius: "10px", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                    <motion.div animate={{ x: hasMaritalExemption ? 16 : 2 }} style={{ width: "10px", height: "10px", background: "white", borderRadius: "50%", position: "absolute", top: "2px" }} />
                  </div>
                </div>
                <AnimatePresence>
                  {hasMaritalExemption && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden", background: "var(--bg-app-subtle)", margin: "0 1rem 0.75rem 1rem", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ padding: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <label style={{ fontSize: "0.55rem", color: "var(--text-tertiary)", fontWeight: 800, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Exemption Grace (Years)</label>
                            <p style={{ fontSize: "0.55rem", color: "var(--text-tertiary)", fontWeight: 600, margin: 0 }}>Widows & Divorced/Separated women.</p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", padding: "4px 10px", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                            <span style={{ fontSize: "0.5rem", opacity: 0.6, fontWeight: 800, textTransform: "uppercase" }}>GRACE</span>
                            <input type="number" style={{ width: "40px", background: "transparent", border: "none", fontSize: "0.85rem", fontWeight: 800, padding: 0, textAlign: "right", color: "var(--accent-primary)", outline: "none" }} value={activeExam.marital_grace_period ?? 5} onChange={(e) => updateExamData((p) => ({ ...p, marital_grace_period: Number(e.target.value) }))} />
                            <span style={{ fontSize: "0.5rem", opacity: 0.4, fontWeight: 800 }}>YRS</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
    print("Successfully overhauled Admin Copy with humanized labels")
else:
    print("Error: Could not find renderAgeLimits pattern in Admin.jsx")
