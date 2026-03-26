import React, { useState, useEffect } from 'react';
import EvaluationEngine from '../engine/eligibilityEngine';
import { getStoredExams } from '../data/configDatabase';
import { CheckCircle2, XCircle, AlertTriangle, Calendar, Building2, MapPin, GraduationCap, Briefcase, ChevronRight, User, ExternalLink, IndianRupee } from 'lucide-react';

export default function StudentPortal() {
  const [availableExams, setAvailableExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [profile, setProfile] = useState({
    dob: '1998-05-15',
    gender: 'Female',
    category: 'UR',
    is_pwbd: false,
    is_esm: false,
    is_govt_employee: false,
    is_contractual: false,
    contractual_years: '',
    degree: 'B.Sc_Nursing',
    degree_status: 'Passout',
    exp_years: '',
    exp_months: '',
    hospital_beds: '',
    high_school_state: 'Delhi',
    nursing_council_state: 'Delhi',
    employment_exchange_state: 'Delhi',
    is_permanent_registration: true,
    has_multiple_spouses: false,
    is_institute_recognized: true
  });
  
  const [result, setResult] = useState(null);

  useEffect(() => {
    setAvailableExams(getStoredExams());
  }, []);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;
    if (type === 'number') finalValue = value === '' ? '' : Math.max(0, Number(value));
    setProfile(prev => ({ ...prev, [name]: finalValue }));
  };

  const evaluate = () => {
    if (!selectedExamId) {
      alert("Please select a target exam first.");
      return;
    }
    const targetConfig = availableExams.find(e => e.id === selectedExamId);
    if (!targetConfig) return;
    
    const engine = new EvaluationEngine(targetConfig, profile);
    setResult(engine.evaluate());
  };

  const statesList = ["Delhi", "Uttar Pradesh", "Uttarakhand", "Bihar", "Rajasthan", "Madhya Pradesh", "Haryana"];
  const targetedExam = availableExams.find(e => e.id === selectedExamId);

  return (
    <div className="animate-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
         <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
           Check Your Eligibility
         </h1>
         <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
           Select an exam and fill in your details to instantly check if you're eligible.
         </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'var(--accent-primary-bg)', border: '1px solid var(--accent-primary)' }}>
         <label style={{ display: 'block', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
           Select Target Examination
         </label>
         <select 
            className="form-select" 
            style={{ fontSize: '1.05rem', padding: '0.75rem', borderColor: 'var(--accent-primary)', backgroundColor: 'white' }}
            value={selectedExamId}
            onChange={(e) => { 
               const targetId = e.target.value;
               setSelectedExamId(targetId); 
               setResult(null); 
               const ex = availableExams.find(x => x.id === targetId);
               if(ex && ex.degrees) {
                  setProfile(p => ({ ...p, degree: Object.keys(ex.degrees)[0] }));
               }
            }}
         >
            <option value="">-- Choose an Exam --</option>
            {availableExams.map(ex => (
               <option key={ex.id} value={ex.id}>{ex.metadata?.exam_name || "Unnamed Exam"}</option>
            ))}
         </select>
      </div>

      {targetedExam && (
         <div className="animate-in card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-strong)', marginBottom: '2rem', display: 'flex' }}>
             {targetedExam.metadata?.image_url && (
                <div style={{ width: '150px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', borderRight: '1px solid var(--border-subtle)' }}>
                   <img src={targetedExam.metadata.image_url} alt="Logo" style={{ width: '100%', height: '100px', objectFit: 'contain' }} />
                </div>
             )}
             <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{targetedExam.metadata?.exam_name}</h2>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                       <Briefcase size={18} color="var(--accent-primary)" />
                       <span style={{ fontSize: '1.05rem', fontWeight: 500 }}>{targetedExam.metadata?.total_vacancies ? `${targetedExam.metadata.total_vacancies.toLocaleString()} Vacancies` : 'Vacancies TBD'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                       <IndianRupee size={18} color="var(--accent-success)" />
                       <span style={{ fontSize: '1.05rem', fontWeight: 500 }}>{targetedExam.metadata?.salary_range || 'Salary TBD'}</span>
                    </div>
                </div>
                {targetedExam.metadata?.notification_url && (
                   <div style={{ marginTop: '0.5rem' }}>
                      <a href={targetedExam.metadata.notification_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none', backgroundColor: 'var(--accent-primary-bg)', padding: '0.5rem 1rem', borderRadius: '4px' }}>
                         <ExternalLink size={14} /> Read Official Notification PDF
                      </a>
                   </div>
                )}
             </div>
         </div>
      )}

      {selectedExamId && (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '2rem' }}>
        
        {/* INPUT FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           
           <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                 <User color="var(--accent-primary)" size={20} />
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>1. Basic Details</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                 <div>
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dob" className="form-input" value={profile.dob} onChange={handleInputChange} />
                 </div>
                 <div>
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-select" value={profile.gender} onChange={handleInputChange}>
                       <option value="Female">Female</option>
                       <option value="Male">Male</option>
                    </select>
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                 <div>
                    <label className="form-label">Category</label>
                    <select name="category" className="form-select" value={profile.category} onChange={handleInputChange}>
                       <option value="UR">Unreserved (UR / General)</option>
                       <option value="OBC">OBC (Non-Creamy Layer)</option>
                       <option value="SC">Scheduled Caste (SC)</option>
                       <option value="ST">Scheduled Tribe (ST)</option>
                       <option value="EWS">Economically Weaker Section (EWS)</option>
                    </select>
                 </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-body)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                 <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                    <input type="checkbox" name="is_pwbd" checked={profile.is_pwbd} onChange={handleInputChange} style={{ width: '1.1rem', height: '1.1rem', marginTop: '0.1rem' }} />
                    <span style={{flex: 1}}>Persons with Benchmark Disabilities (PwBD &gt; 40%)</span>
                 </label>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                     <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                        <input type="checkbox" name="is_esm" checked={profile.is_esm} onChange={handleInputChange} style={{ width: '1.1rem', height: '1.1rem', marginTop: '0.1rem' }} />
                        <span>Ex-Servicemen (ESM) / Commissioned Armed Forces</span>
                     </label>
                     {profile.is_esm && (
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                            <span style={{ fontSize: '0.85rem' }}>Years of Active Service:</span>
                            <input type="number" name="esm_years" className="form-input" style={{ width: '80px', padding: '0.25rem' }} value={profile.esm_years ?? ''} onChange={handleInputChange} min="0" placeholder="0" />
                         </div>
                     )}
                 </div>
                 <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                    <input type="checkbox" name="is_govt_employee" checked={profile.is_govt_employee} onChange={handleInputChange} style={{ width: '1.1rem', height: '1.1rem', marginTop: '0.1rem' }} />
                    <span style={{flex: 1}}>Central / State Govt Civilian Employee (3+ Years Continuous Service)</span>
                 </label>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                     <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                        <input type="checkbox" name="is_contractual" checked={profile.is_contractual || false} onChange={handleInputChange} style={{ width: '1.1rem', height: '1.1rem', marginTop: '0.1rem' }} />
                        <span>Contractual State Health Worker (e.g. NHM)</span>
                     </label>
                     {profile.is_contractual && (
                         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                            <span style={{ fontSize: '0.85rem' }}>Years of Service:</span>
                            <input type="number" name="contractual_years" className="form-input" style={{ width: '80px', padding: '0.25rem' }} value={profile.contractual_years ?? ''} onChange={handleInputChange} min="0" placeholder="0" />
                         </div>
                     )}
                 </div>
              </div>
           </div>

           <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                 <MapPin color="var(--accent-primary)" size={20} />
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>2. State & Registration Details</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                 <div>
                    <label className="form-label">State where you completed 10th/12th grade</label>
                    <select name="high_school_state" className="form-select" value={profile.high_school_state} onChange={handleInputChange}>
                       {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="form-label">Nursing Council Registration State</label>
                    <select name="nursing_council_state" className="form-select" value={profile.nursing_council_state} onChange={handleInputChange}>
                       {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="form-label">State where registered with Employment Exchange</label>
                    <select name="employment_exchange_state" className="form-select" value={profile.employment_exchange_state} onChange={handleInputChange}>
                       <option value="Not Enrolled">Not Enrolled</option>
                       {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-body)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                    <input type="checkbox" name="is_permanent_registration" checked={profile.is_permanent_registration} onChange={handleInputChange} style={{ width: '1.1rem', height: '1.1rem' }} />
                    I hold a Permanent Registration (Not Provisional)
                 </label>
                 <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                    <input type="checkbox" name="has_multiple_spouses" checked={profile.has_multiple_spouses} onChange={handleInputChange} style={{ width: '1.1rem', height: '1.1rem' }} />
                    I have more than one living spouse
                 </label>
              </div>
           </div>

           <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                 <GraduationCap color="var(--accent-primary)" size={20} />
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>3. Education & Clinical Credentials</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                 <div>
                    <label className="form-label">Nursing Degree Level</label>
                    <select name="degree" className="form-select" value={profile.degree} onChange={handleInputChange}>
                       <option value="MSc_Nursing">Master of Science in Nursing (M.Sc)</option>
                       <option value="B.Sc_Nursing">Bachelor of Science in Nursing (B.Sc)</option>
                       <option value="Post_Basic_BSc">Post-Basic B.Sc Nursing</option>
                       <option value="GNM">Diploma in GNM</option>
                    </select>
                 </div>
                 <div>
                    <label className="form-label">Degree Status</label>
                    <select name="degree_status" className="form-select" value={profile.degree_status} onChange={handleInputChange}>
                       <option value="Passout">Passout (Certificate Held)</option>
                       <option value="Final_Year_Appearing">Final Year (Appearing)</option>
                    </select>
                 </div>
              </div>

              <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)' }}>
                 <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={16} /> Verified Clinical Experience (Post-Registration)
                 </h4>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                       <label className="form-label">Years</label>
                       <input type="number" name="exp_years" className="form-input" value={profile.exp_years ?? ''} onChange={handleInputChange} min="0" placeholder="0" />
                    </div>
                    <div>
                       <label className="form-label">Months</label>
                       <input type="number" name="exp_months" className="form-input" value={profile.exp_months ?? ''} onChange={handleInputChange} min="0" max="11" placeholder="0" />
                    </div>
                    <div>
                       <label className="form-label">Hospital Bed Scale</label>
                       <input type="number" name="hospital_beds" className="form-input" placeholder="0" value={profile.hospital_beds ?? ''} onChange={handleInputChange} min="0" />
                    </div>
                 </div>
              </div>
              
              <button 
                 onClick={evaluate} 
                 className="btn btn-primary" 
                 style={{ width: '100%', marginTop: '2rem', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
              >
                 <CheckCircle2 size={24} /> Check My Eligibility
              </button>
           </div>
        </div>

        {/* RESULTS HUD */}
        <div style={{ position: 'sticky', top: '2rem', height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
           {!result ? (
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-tertiary)', border: '2px dashed var(--border-strong)', backgroundColor: 'transparent' }}>
                 <AlertTriangle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Ready to Check</h3>
                 <p style={{ maxWidth: '250px', marginTop: '0.5rem', lineHeight: 1.5 }}>
                    Select an exam and click "Check My Eligibility" to generate your mathematical report.
                 </p>
              </div>
           ) : (
              <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}>
                 
                 {/* Primary Decision Banner */}
                 <div style={{ 
                    padding: '2rem 1.5rem', 
                    borderRadius: 'var(--radius-lg)', 
                    backgroundColor: result.isEligible ? (result.warnings.length > 0 ? 'var(--accent-warning-bg)' : 'var(--accent-success-bg)') : 'var(--accent-danger-bg)',
                    border: `2px solid ${result.isEligible ? (result.warnings.length > 0 ? 'var(--accent-warning)' : 'var(--accent-success)') : 'var(--accent-danger)'}`,
                    color: result.isEligible ? (result.warnings.length > 0 ? '#b45309' : '#166534') : '#991b1b',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                 }}>
                    {result.isEligible ? (
                       result.warnings.length > 0 ? <AlertTriangle size={64} style={{ marginBottom: '1rem' }} /> : <CheckCircle2 size={64} style={{ marginBottom: '1rem' }} />
                    ) : (
                       <XCircle size={64} style={{ marginBottom: '1rem' }} />
                    )}
                    
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
                       {result.isEligible ? (result.warnings.length > 0 ? "ELIGIBLE WITH CAUTION" : "FULLY ELIGIBLE") : "INELIGIBLE"}
                    </h2>
                    
                    <p style={{ marginTop: '0.5rem', fontWeight: 500, fontSize: '1.1rem', opacity: 0.9 }}>
                       {result.isEligible 
                          ? `You meet the basic requirements for ${result.targetedExam.metadata.exam_name}.`
                          : `You do not meet the minimum requirements for this exam.`}
                    </p>
                 </div>

                 {/* Timeline / Action Routing */}
                 {result.isEligible && result.targetedExam.metadata?.important_dates?.length > 0 && (
                    <div className="card" style={{ flexShrink: 0, border: '1px solid var(--accent-primary)', backgroundColor: 'var(--accent-primary-bg)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                          <Calendar color="var(--accent-primary)" size={20} />
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary-dark)' }}>Live Exam Timeline & Actions</h3>
                       </div>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {result.targetedExam.metadata.important_dates.map((dateObj, idx) => (
                             <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-primary)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <div>
                                   <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{new Date(dateObj.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})}</div>
                                   <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dateObj.label}</div>
                                </div>
                                {dateObj.action_url && (
                                   <a href={dateObj.action_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                                      {dateObj.cta_text || 'Access Link'} <ExternalLink size={14} />
                                   </a>
                                )}
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
                    
                    {/* Hard Failures Map */}
                    {!result.isEligible && (
                       <div className="card" style={{ borderLeft: '4px solid var(--accent-danger)' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-danger)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             <XCircle size={18} /> Missing Requirements
                          </h3>
                          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                             {result.reasons.map((r, i) => (
                                <li key={i} style={{ lineHeight: 1.5 }}>{r}</li>
                             ))}
                          </ul>
                       </div>
                    )}

                    {/* Verification Cautions Map */}
                    {result.warnings.length > 0 && (
                       <div className="card" style={{ borderLeft: '4px solid var(--accent-warning)', backgroundColor: '#fffbeb' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#92400e', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             <AlertTriangle size={18} /> Important Notices
                          </h3>
                          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                             {result.warnings.map((w, i) => (
                                <li key={i} style={{ lineHeight: 1.5 }}>{w}</li>
                             ))}
                          </ul>
                       </div>
                    )}

                    {/* Evaluation Details */}
                    <div className="card" style={{ backgroundColor: 'var(--bg-app)' }}>
                       <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                          Basis of Evaluation
                       </h3>
                       <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span>Calculated Base Age:</span>
                             <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{result.debugObject.exactAgeCalculated.toFixed(1)} Years</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span>Target Active Config:</span>
                             <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{result.targetedExam.id}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                             <span>Domicile Locked:</span>
                             <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{result.targetedExam.category_benefits_locked_to_state || "False"}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                             <span>Evaluated Status:</span>
                             <span style={{ fontWeight: 600, color: result.isEligible ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                {result.isEligible ? "PASS" : "FAIL_ROUTINE"}
                             </span>
                          </div>
                       </div>
                    </div>
                 </div>

              </div>
           )}
        </div>
      </div>
      )}
    </div>
  );
}
