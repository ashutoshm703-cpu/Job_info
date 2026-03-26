import React, { useState, useEffect } from 'react';
import { getStoredExams, saveExams } from '../data/configDatabase';
import templateSchema from '../data/masterSchema.json';
import { Save, AlertCircle, Settings, ShieldAlert, GraduationCap, Link2, PlusCircle, LayoutList, CalendarPlus, Trash2, Briefcase, IndianRupee, UploadCloud, Link } from 'lucide-react';

export default function AdminDashboard() {
  const [exams, setExams] = useState([]);
  const [activeExamId, setActiveExamId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [notificationInputMode, setNotificationInputMode] = useState('link');
  const [previewDob, setPreviewDob] = useState('');
  const [customDegreeName, setCustomDegreeName] = useState('');

  useEffect(() => { setExams(getStoredExams()); }, []);
  const activeExam = exams.find(e => e.id === activeExamId);

  useEffect(() => {
     if(activeExam?.metadata?.notification_url?.startsWith('data:')) setNotificationInputMode('upload');
     else setNotificationInputMode('link');
  }, [activeExamId]);

  const updateExamData = (updaterFn) => {
    setExams(exams.map(e => e.id === activeExamId ? updaterFn(e) : e));
    setIsSaved(false); setUploadError('');
  };

  const createNewExam = () => {
    const newId = `exam-${Date.now()}`;
    const newExam = JSON.parse(JSON.stringify(templateSchema));
    newExam.id = newId; setExams([...exams, newExam]); setActiveExamId(newId);
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    const val = name === 'total_vacancies' ? (value === '' ? '' : Math.max(0, Number(value))) : value;
    updateExamData(prev => ({ ...prev, metadata: { ...prev.metadata, [name]: val } }));
  };

  const handleFileUpload = (e) => {
     const file = e.target.files[0];
     if (!file) return;
     if (file.size > 4000000) { setUploadError("File is too large! Please compress or use Link."); return; }
     const reader = new FileReader();
     reader.onloadend = () => {
         updateExamData(prev => ({ ...prev, metadata: { ...prev.metadata, notification_url: reader.result } }));
     };
     reader.readAsDataURL(file);
  };

  const handleImportantDateChange = (index, field, value) => {
    updateExamData(prev => {
       const dates = [...(prev.metadata.important_dates || [])];
       dates[index] = { ...dates[index], [field]: value };
       return { ...prev, metadata: { ...prev.metadata, important_dates: dates } };
    });
  };

  const addImportantDate = () => updateExamData(prev => ({ ...prev, metadata: { ...prev.metadata, important_dates: [...(prev.metadata.important_dates || []), { label: '', date: '', action_url: '', cta_text: '' }] } }));
  const removeImportantDate = (index) => updateExamData(prev => ({ ...prev, metadata: { ...prev.metadata, important_dates: prev.metadata.important_dates.filter((_, i) => i !== index) } }));
  const handleTextChange = (e) => updateExamData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleNumberChange = (e) => updateExamData(prev => ({ ...prev, [e.target.name]: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)) }));
  const handleCheckbox = (e) => updateExamData(prev => ({ ...prev, [e.target.name]: e.target.checked }));

  const handleCategoryRelaxation = (category, value) => {
    const val = value === '' ? '' : Math.max(0, Number(value));
    updateExamData(prev => ({ ...prev, category_relaxations: { ...prev.category_relaxations, [category]: val } }));
  };

  const handleAddCustomDegree = () => {
    if(!customDegreeName.trim()) return;
    const formatted = customDegreeName.trim().replace(/\s+/g, '_');
    updateExamData(prev => ({ ...prev, degrees: { ...prev.degrees, [formatted]: { allowed: true, req_exp_months: 0, req_min_hospital_beds: 0 } } }));
    setCustomDegreeName('');
  };

  const handleRemoveDegree = (degree) => {
    if(Object.keys(activeExam.degrees).length <= 1) { alert("Cannot remove last degree rule."); return; }
    updateExamData(prev => { const clone = { ...prev.degrees }; delete clone[degree]; return { ...prev, degrees: clone }; });
  };

  const handleDegreeChange = (degree, field, value) => {
    const val = field === 'allowed' ? value : (value === '' ? '' : Math.max(0, Number(value)));
    updateExamData(prev => ({ ...prev, degrees: { ...prev.degrees, [degree]: { ...prev.degrees[degree], [field]: val } } }));
  };

  const calculatePreviewAge = (dob, cutoff) => {
    if (!dob || !cutoff) return null;
    const b = new Date(dob), t = new Date(cutoff);
    if (isNaN(b.getTime()) || isNaN(t.getTime())) return null;
    let y = t.getFullYear() - b.getFullYear(), m = t.getMonth() - b.getMonth(), d = t.getDate() - b.getDate();
    if (d < 0) { m--; d += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return { y, m, d };
  };

  const saveConfig = () => {
    try { saveExams(exams); setIsSaved(true); setTimeout(() => setIsSaved(false), 3000); }
    catch (err) { setUploadError("Failed to save: " + err.message); }
  };

  if (!activeExam) {
     return (
        <div className="animate-in">
           <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div><h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Exam Dashboard</h1><p style={{ color: 'var(--text-secondary)' }}>Select or create an exam.</p></div>
              <button className="btn btn-primary" onClick={createNewExam}><PlusCircle size={18} /> Create New Exam</button>
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {exams.map(e => (
                 <div key={e.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setActiveExamId(e.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                       {e.metadata?.image_url ? <img src={e.metadata.image_url} style={{ width: '32px', height: '32px', objectFit: 'contain' }}/> : <LayoutList color="var(--accent-primary)" />}
                       <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{e.metadata?.exam_name || "Unnamed"}</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem' }}>Vacancies: {e.metadata?.total_vacancies || 'TBD'} | State: {e.exam_state || 'Central'}</p>
                 </div>
              ))}
           </div>
        </div>
     );
  }

  return (
    <div className="animate-in" style={{ paddingBottom: '4rem' }}>
      <button onClick={() => { saveConfig(); setActiveExamId(null); }} className="btn" style={{ marginBottom: '1rem' }}>← Back to Hub</button>
      {uploadError && <div className="card" style={{ backgroundColor: 'var(--accent-danger)', color: 'white' }}>{uploadError}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
         <div><h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Editing: {activeExam.metadata?.exam_name}</h1></div>
         <button className="btn btn-primary" onClick={saveConfig}><Save size={18} /> {isSaved ? "Saved!" : "Publish Updates"}</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
         {/* SECTION 0: METADATA */}
         <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>0. Exam Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
               <input type="text" name="exam_name" className="form-input" placeholder="Exam Title" value={activeExam.metadata?.exam_name || ''} onChange={handleMetadataChange} />
               <input type="url" name="image_url" className="form-input" placeholder="Logo URL" value={activeExam.metadata?.image_url || ''} onChange={handleMetadataChange} />
               <input type="number" name="total_vacancies" className="form-input" placeholder="Vacancies" value={activeExam.metadata?.total_vacancies || ''} onChange={handleMetadataChange} />
               <input type="text" name="salary_range" className="form-input" placeholder="Salary Range" value={activeExam.metadata?.salary_range || ''} onChange={handleMetadataChange} />
            </div>
            <div style={{ marginTop: '1rem' }}>
               <label className="form-label">Notification PDF Source</label>
               <div style={{ display: 'flex', gap: '1rem', margin: '0.5rem 0' }}>
                  <button className="btn" onClick={() => setNotificationInputMode('link')}>Link</button>
                  <button className="btn" onClick={() => setNotificationInputMode('upload')}>Upload</button>
               </div>
               {notificationInputMode === 'link' ? 
                  <input type="url" name="notification_url" className="form-input" value={activeExam.metadata?.notification_url && !activeExam.metadata.notification_url.startsWith('data:') ? activeExam.metadata.notification_url : ''} onChange={handleMetadataChange} placeholder="PDF Link" />
                  : <input type="file" accept="application/pdf" onChange={handleFileUpload} className="form-input" />}
            </div>
            <div style={{ marginTop: '1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}><h4>Timeline</h4><button className="btn" onClick={addImportantDate}>+ Add Row</button></div>
               {(activeExam.metadata?.important_dates || []).map((m, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', gap: '0.5rem', marginTop: '0.5rem' }}>
                     <input className="form-input" value={m.label || ''} onChange={e => handleImportantDateChange(i, 'label', e.target.value)} placeholder="Event" />
                     <input type="date" className="form-input" value={m.date || ''} onChange={e => handleImportantDateChange(i, 'date', e.target.value)} />
                     <input className="form-input" value={m.action_url || ''} onChange={e => handleImportantDateChange(i, 'action_url', e.target.value)} placeholder="URL" />
                     <input className="form-input" value={m.cta_text || ''} onChange={e => handleImportantDateChange(i, 'cta_text', e.target.value)} placeholder="Button Text" />
                     <button className="btn" onClick={() => removeImportantDate(i)}>×</button>
                  </div>
               ))}
            </div>
         </div>

         {/* SECTION 1: AGE */}
         <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>1. Age Limits</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginTop: '1rem' }}>
               <div><label className="form-label">As-On Date</label><input type="date" name="as_on_date" className="form-input" value={activeExam.as_on_date || ''} onChange={handleTextChange} /></div>
               <div style={{ padding: '0.5rem', background: 'var(--bg-app)' }}><label>Preview Age:</label>
                  <input type="date" className="form-input" value={previewDob} onChange={e => setPreviewDob(e.target.value)} />
                  {previewDob && activeExam.as_on_date && <p style={{ fontWeight: 700 }}>{calculatePreviewAge(previewDob, activeExam.as_on_date)?.y} Years</p>}
               </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
               <div><label>Min Age</label><input type="number" name="base_age_min" className="form-input" value={activeExam.base_age_min ?? ''} onChange={handleNumberChange} /></div>
               <div><label>Max Age (Male)</label><input type="number" name="base_age_max_male" className="form-input" value={activeExam.base_age_max_male ?? ''} onChange={handleNumberChange} /></div>
               <div><label>Gender Rule</label><select name="gender_restriction" className="form-select" value={activeExam.gender_restriction || 'Both'} onChange={handleTextChange}><option value="Both">Both</option><option value="Female">Female Only</option><option value="Male">Male Only</option></select></div>
            </div>
            <div style={{ marginTop: '1rem' }}>
               <label><input type="checkbox" name="has_female_specific_age" checked={activeExam.has_female_specific_age || false} onChange={handleCheckbox} /> Specific Female Age Limits</label>
               {activeExam.has_female_specific_age && <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <input type="number" name="base_age_min_female" className="form-input" placeholder="Min" value={activeExam.base_age_min_female ?? ''} onChange={handleNumberChange} />
                  <input type="number" name="base_age_max_female" className="form-input" placeholder="Max" value={activeExam.base_age_max_female ?? ''} onChange={handleNumberChange} />
               </div>}
            </div>
            <div style={{ marginTop: '1rem' }}>
               <h4>Category Relaxations (+Yrs)</h4>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  {['OBC', 'SC', 'ST', 'EWS'].map(c => <div key={c}><label>{c}</label><input type="number" className="form-input" value={activeExam.category_relaxations?.[c] ?? ''} onChange={e => handleCategoryRelaxation(c, e.target.value)} /></div>)}
               </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
               <h4>Military / ESM Bonus</h4>
               <input type="number" name="esm_relaxation" className="form-input" value={activeExam.esm_relaxation ?? ''} onChange={handleNumberChange} placeholder="Bonus Years (e.g. 3)" />
            </div>
         </div>

         {/* SECTION 2: STATE RULES */}
         <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>2. State-Specific Rules</h2>
            <div style={{ margin: '1rem 0' }}><label><input type="radio" checked={!!activeExam.is_state_exam} onChange={() => updateExamData(prev => ({ ...prev, is_state_exam: true }))} /> State Exam</label> <label><input type="radio" checked={!activeExam.is_state_exam} onChange={() => updateExamData(prev => ({ ...prev, is_state_exam: false, exam_state: '' }))} /> Central Exam</label></div>
            {activeExam.is_state_exam && <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <select name="exam_state" className="form-select" value={activeExam.exam_state || ''} onChange={handleTextChange}><option value="">Select State</option>{['Bihar', 'UP', 'UK', 'Rajasthan'].map(s => <option key={s} value={s}>{s}</option>)}</select>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="card"><h4>Residency</h4>
                     <select name="domicile_type" className="form-select" value={activeExam.domicile_type || 'none'} onChange={handleTextChange}><option value="none">None</option><option value="reservation_only">Reservation Only</option><option value="hard_mandatory">Hard Mandatory</option></select>
                     <input type="text" name="language_requirement" className="form-input" placeholder="Language Requirement" value={activeExam.language_requirement || ''} onChange={handleTextChange} />
                  </div>
                  <div className="card"><h4>Council Registration</h4>
                     <select name="registration_accepted_scope" className="form-select" value={activeExam.registration_accepted_scope || 'Any State'} onChange={handleTextChange}><option value="Any State">Any INC</option><option value="Bihar">Bihar Only</option><option value="UP">UP Only</option></select>
                     <label><input type="checkbox" name="provisional_council_allowed" checked={activeExam.provisional_council_allowed || false} onChange={handleCheckbox} /> Allow Provisional</label>
                  </div>
               </div>
               <div className="card"><h4>Practitioner Types</h4>
                  <label><input type="checkbox" name="bams_eligible" checked={activeExam.bams_eligible || false} onChange={handleCheckbox} /> BAMS Eligible</label>
                  <label><input type="checkbox" name="cch_required" checked={activeExam.cch_required || false} onChange={handleCheckbox} /> CCH Mandatory</label>
               </div>
               <select name="category_benefits_locked_to_state" className="form-select" value={activeExam.category_benefits_locked_to_state || ''} onChange={handleTextChange}><option value="">All States Honored</option><option value="Bihar">Locked to Bihar</option><option value="UP">Locked to UP</option></select>
            </div>}
            {!activeExam.is_state_exam && <div className="card"><label><input type="checkbox" name="requires_permanent_registration" checked={activeExam.requires_permanent_registration || false} onChange={handleCheckbox} /> Reject Provis. Registrations</label></div>}
         </div>

         {/* SECTION 3: EDUCATION */}
         <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>3. Education & Clinical</h2>
            <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
               <label><input type="checkbox" name="hs_science_required" checked={activeExam.hs_science_required || false} onChange={handleCheckbox} /> 12th Sci Req</label>
               <label><input type="checkbox" name="requires_recognized_institute" checked={activeExam.requires_recognized_institute || false} onChange={handleCheckbox} /> INC Recog Only</label>
            </div>
            {Object.keys(activeExam.degrees || {}).map(d => (
               <div key={d} className="card" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><h4>{d} Config</h4><button onClick={() => handleRemoveDegree(d)}>×</button></div>
                  <label><input type="checkbox" checked={activeExam.degrees[d]?.allowed || false} onChange={e => handleDegreeChange(d, 'allowed', e.target.checked)} /> Eligible</label>
                  {activeExam.degrees[d]?.allowed && <div style={{ display: 'flex', gap: '1rem' }}>
                     <input type="number" className="form-input" placeholder="Exp (Months)" value={activeExam.degrees[d]?.req_exp_months ?? ''} onChange={e => handleDegreeChange(d, 'req_exp_months', e.target.value)} />
                     <input type="number" className="form-input" placeholder="Min Beds" value={activeExam.degrees[d]?.req_min_hospital_beds ?? ''} onChange={e => handleDegreeChange(d, 'req_min_hospital_beds', e.target.value)} />
                  </div>}
               </div>
            ))}
            <div style={{ display: 'flex', gap: '1rem' }}><input className="form-input" placeholder="New Degree" value={customDegreeName} onChange={e => setCustomDegreeName(e.target.value)} /><button className="btn" onClick={handleAddCustomDegree}>Add Route</button></div>
         </div>

         {/* SECTION 4: EXAM PATTERN */}
         <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>4. Exam Pattern</h2>
            <select className="form-select" value={activeExam.exam_pattern?.stage_type || 'single'} onChange={e => updateExamData(p => ({...p, exam_pattern: {...p.exam_pattern, stage_type: e.target.value}}))}>
               <option value="single">Single Stage</option><option value="prelims_mains">Prelims + Mains</option>
            </select>
            <div className="card" style={{ marginTop: '1rem' }}>
               <h4>{activeExam.exam_pattern?.stage_type === 'prelims_mains' ? "Prelims" : "Pattern"}</h4>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <select className="form-select" value={activeExam.exam_pattern?.prelims?.question_type || ''} onChange={e => updateExamData(p => ({...p, exam_pattern: {...p.exam_pattern, prelims: {...p.exam_pattern.prelims, question_type: e.target.value}}}))}><option value="Objective">Objective</option><option value="Subjective">Subjective</option></select>
                  <input type="number" className="form-input" placeholder="Questions" value={activeExam.exam_pattern?.prelims?.total_questions || ''} onChange={e => updateExamData(p => ({...p, exam_pattern: {...p.exam_pattern, prelims: {...p.exam_pattern.prelims, total_questions: Number(e.target.value)}}}))} />
                  <input type="number" step="0.25" className="form-input" placeholder="Marks/Correct" value={activeExam.exam_pattern?.prelims?.marks_per_correct || ''} onChange={e => updateExamData(p => ({...p, exam_pattern: {...p.exam_pattern, prelims: {...p.exam_pattern.prelims, marks_per_correct: Number(e.target.value)}}}))} />
               </div>
            </div>
            {activeExam.exam_pattern?.stage_type === 'prelims_mains' && <div className="card" style={{ marginTop: '1rem' }}>
               <h4>Mains</h4>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <select className="form-select" value={activeExam.exam_pattern?.mains?.question_type || ''} onChange={e => updateExamData(p => ({...p, exam_pattern: {...p.exam_pattern, mains: {...p.exam_pattern.mains, question_type: e.target.value}}}))}><option value="Descriptive">Descriptive</option><option value="Mixed">Mixed</option></select>
                  <input type="number" className="form-input" placeholder="Total Marks" value={activeExam.exam_pattern?.mains?.total_marks || ''} onChange={e => updateExamData(p => ({...p, exam_pattern: {...p.exam_pattern, mains: {...p.exam_pattern.mains, total_marks: Number(e.target.value)}}}))} />
                  <input className="form-input" placeholder="Notes" value={activeExam.exam_pattern?.mains?.notes || ''} onChange={e => updateExamData(p => ({...p, exam_pattern: {...p.exam_pattern, mains: {...p.exam_pattern.mains, notes: e.target.value}}}))} />
               </div>
            </div>}
         </div>

         {/* SECTION 5: CONTENT WEIGHTAGE */}
         <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>5. Content Weightage</h2>
               <div><label>Nursing %</label><input type="number" className="form-input" value={activeExam.content_weightage?.nursing_percent || ''} onChange={e => updateExamData(p => ({...p, content_weightage: {...p.content_weightage, nursing_percent: Number(e.target.value)}}))} /></div>
               {(activeExam.content_weightage?.other_sections || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                     <input className="form-input" value={s.label || ''} onChange={e => { const updated = [...activeExam.content_weightage.other_sections]; updated[i].label = e.target.value; updateExamData(p => ({...p, content_weightage: {...p.content_weightage, other_sections: updated}})); }} placeholder="Label" />
                     <input type="number" className="form-input" value={s.percent ?? ''} onChange={e => { const updated = [...activeExam.content_weightage.other_sections]; updated[i].percent = Number(e.target.value); updateExamData(p => ({...p, content_weightage: {...p.content_weightage, other_sections: updated}})); }} placeholder="%" />
                     <button className="btn" onClick={() => { const updated = activeExam.content_weightage.other_sections.filter((_, idx) => idx !== i); updateExamData(p => ({...p, content_weightage: {...p.content_weightage, other_sections: updated}})); }}>×</button>
                  </div>
               ))}
               <button className="btn" onClick={() => updateExamData(p => ({...p, content_weightage: {...p.content_weightage, other_sections: [...(p.content_weightage.other_sections || []), {label:'', percent:0}]}}))}>+ Add Section</button>
         </div>

         {/* SECTION 6: FEES */}
         <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>6. Application Fees (₹)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
               {['UR', 'OBC', 'SC_ST', 'EWS', 'PwBD'].map(k => <div key={k}><label>{k}</label><input type="number" className="form-input" value={activeExam.application_fees?.[k] ?? ''} onChange={e => updateExamData(p => ({...p, application_fees: {...p.application_fees, [k]: Number(e.target.value)}}))} /></div>)}
            </div>
         </div>
      </div>
    </div>
  );
}
