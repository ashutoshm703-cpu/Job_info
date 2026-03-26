const fs = require('fs');

// --- ADMIN.JSX MODIFICATIONS ---
let admin = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

// 1. Add Custom Degree State & Handler
const adminHandlerTarget = `  const handleDegreeChange = (degree, field, value) => {`;
const adminHandlerInject = `  const [customDegreeName, setCustomDegreeName] = useState('');

  const handleAddCustomDegree = () => {
    if(!customDegreeName.trim()) return;
    const formatted = customDegreeName.trim().replace(/\\s+/g, '_');
    updateExamData(prev => ({
       ...prev,
       degrees: {
         ...prev.degrees,
         [formatted]: { allowed: true, req_exp_months: 0, req_min_hospital_beds: 0 }
       }
    }));
    setCustomDegreeName('');
  };

  const handleRemoveDegree = (degree) => {
    if(Object.keys(activeExam.degrees).length <= 1) {
       alert("Cannot remove the last remaining degree rule.");
       return;
    }
    updateExamData(prev => {
       const clone = { ...prev.degrees };
       delete clone[degree];
       return { ...prev, degrees: clone };
    });
  };

  const handleDegreeChange = (degree, field, value) => {`;
admin = admin.replace(adminHandlerTarget, adminHandlerInject);

// 2. Replace hardcoded Degree array with Object.keys() and add Remove button
const adminMapTarget = `{['B.Sc_Nursing', 'Post_Basic_BSc', 'MSc_Nursing', 'GNM'].map(deg => (
                   <div key={deg} style={{ padding: '1.5rem', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                         <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{deg.replace(/_/g, ' ')} Configuration</h4>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                            <input type="checkbox" checked={activeExam.degrees[deg]?.allowed || false} onChange={(e) => handleDegreeChange(deg, 'allowed', e.target.checked)} style={{ width: '1.2rem', height: '1.2rem' }} />
                            Degree Eligible
                         </label>
                      </div>`;
const adminMapInject = `{Object.keys(activeExam.degrees || {}).map(deg => (
                   <div key={deg} style={{ padding: '1.5rem', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{deg.replace(/_/g, ' ')} Configuration</h4>
                            <button onClick={() => handleRemoveDegree(deg)} title="Remove Degree entirely" style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                               <Trash2 size={16} />
                            </button>
                         </div>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                            <input type="checkbox" checked={activeExam.degrees[deg]?.allowed || false} onChange={(e) => handleDegreeChange(deg, 'allowed', e.target.checked)} style={{ width: '1.2rem', height: '1.2rem' }} />
                            Degree Eligible
                         </label>
                      </div>`;
admin = admin.replace(adminMapTarget, adminMapInject);

// 3. Add Custom Degree Injector UI at the bottom of the array mapping
const adminInjectUiTarget = `                ))}
            </div>
         </div>`;
const adminInjectUiInject = `                ))}
               
               <div style={{ padding: '1.5rem', border: '1px dashed var(--accent-primary)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-primary-bg)', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                     <label className="form-label" style={{ color: 'var(--accent-primary)' }}>Dynamically Inject Custom Degree / Route</label>
                     <input type="text" className="form-input" placeholder="e.g. ANM, BAMS, Medical Staff" value={customDegreeName} onChange={e => setCustomDegreeName(e.target.value)} style={{ borderColor: 'var(--accent-primary)' }} />
                  </div>
                  <button onClick={handleAddCustomDegree} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem' }}>
                     + Add Route
                  </button>
               </div>

            </div>
         </div>`;
admin = admin.replace(adminInjectUiTarget, adminInjectUiInject);

fs.writeFileSync('src/pages/Admin.jsx', admin);


// --- STUDENT.JSX MODIFICATIONS ---
let student = fs.readFileSync('src/pages/Student.jsx', 'utf8');

// 1. Update onChange handler for Exam selection to sync the first valid degree
const studentSelectTarget = `onChange={(e) => { setSelectedExamId(e.target.value); setResult(null); }}`;
const studentSelectInject = `onChange={(e) => { 
               const targetId = e.target.value;
               setSelectedExamId(targetId); 
               setResult(null); 
               const ex = availableExams.find(x => x.id === targetId);
               if(ex && ex.degrees) {
                  setProfile(p => ({ ...p, degree: Object.keys(ex.degrees)[0] }));
               }
            }}`;
student = student.replace(studentSelectTarget, studentSelectInject);

// 2. Remove hardcoded options and use mapped targetedExam.degrees
const studentDropdownTarget = `                     <select name="degree" className="form-select" value={profile.degree} onChange={handleInputChange}>
                        <option value="MSc_Nursing">Master of Science in Nursing (M.Sc)</option>
                        <option value="B.Sc_Nursing">Bachelor of Science in Nursing (B.Sc)</option>
                        <option value="Post_Basic_BSc">Post-Basic B.Sc Nursing</option>
                        <option value="GNM">Diploma in GNM</option>
                     </select>`;
const studentDropdownInject = `                     <select name="degree" className="form-select" value={profile.degree} onChange={handleInputChange}>
                        {targetedExam && Object.keys(targetedExam.degrees || {}).map(deg => (
                           <option key={deg} value={deg}>{deg.replace(/_/g, ' ')}</option>
                        ))}
                     </select>`;
student = student.replace(studentDropdownTarget, studentDropdownInject);

// 3. Add Live Hint Box for Clinical Experience Tracking
const studentStatusTarget = `                  <div>
                     <label className="form-label">Degree Status</label>
                     <select name="degree_status" className="form-select" value={profile.degree_status} onChange={handleInputChange}>
                        <option value="Passout">Passout (Certificate Held)</option>
                        <option value="Final_Year_Appearing">Final Year (Appearing)</option>
                     </select>
                  </div>
               </div>`;
const studentStatusInject = `                  <div>
                     <label className="form-label">Degree Status</label>
                     <select name="degree_status" className="form-select" value={profile.degree_status} onChange={handleInputChange}>
                        <option value="Passout">Passout (Certificate Held)</option>
                        <option value="Final_Year_Appearing">Final Year (Appearing)</option>
                     </select>
                  </div>
               </div>
               
               {targetedExam && targetedExam.degrees && targetedExam.degrees[profile.degree] && (
                  <div style={{ marginBottom: '1.5rem', padding: '1rem', borderLeft: '4px solid var(--accent-secondary)', backgroundColor: 'var(--bg-app)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                     <strong>Live Requirement:</strong> Based on the exam rules, candidates with a <strong>{profile.degree.replace(/_/g, ' ')}</strong> degree must possess exactly <strong>{targetedExam.degrees[profile.degree].req_exp_months} months</strong> of clinical experience in a minimum <strong>{targetedExam.degrees[profile.degree].req_min_hospital_beds}-bed</strong> facility.
                  </div>
               )}`;
student = student.replace(studentStatusTarget, studentStatusInject);

fs.writeFileSync('src/pages/Student.jsx', student);

console.log("Dynamically Scalable Degrees successfully implemented!");
