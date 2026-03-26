const fs = require('fs');

let admin = fs.readFileSync('src/pages/Admin.jsx', 'utf8');
const adminFind = `            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }}>
                  <input type="checkbox" name="hs_science_required" checked={activeExam.hs_science_required} onChange={handleCheckbox} style={{ width: '1.2rem', height: '1.2rem' }} />
                  High School Science is a strict prerequisite
              </label>
            </div>`;
const adminRep = `            <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }}>
                  <input type="checkbox" name="hs_science_required" checked={activeExam.hs_science_required} onChange={handleCheckbox} style={{ width: '1.2rem', height: '1.2rem' }} />
                  High School Science is a strict prerequisite
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }}>
                  <input type="checkbox" name="requires_recognized_institute" checked={activeExam.requires_recognized_institute || false} onChange={handleCheckbox} style={{ width: '1.2rem', height: '1.2rem' }} />
                  Reject Degrees from Institutes without active INC / State Nursing Council recognition
              </label>
            </div>`;
admin = admin.replace(adminFind, adminRep);
fs.writeFileSync('src/pages/Admin.jsx', admin);


let student = fs.readFileSync('src/pages/Student.jsx', 'utf8');
const studentFind = `                     </select>
                  </div>
               </div>

               <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)' }}>`;
const studentRep = `                     </select>
                  </div>
               </div>

               <div style={{ padding: '1rem', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                   <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                      <input type="checkbox" name="is_institute_recognized" checked={profile.is_institute_recognized} onChange={handleInputChange} style={{ width: '1.1rem', height: '1.1rem' }} />
                      My College/Institute was recognized by the INC or a State Nursing Council
                   </label>
               </div>

               <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-body)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)' }}>`;
student = student.replace(studentFind, studentRep);
fs.writeFileSync('src/pages/Student.jsx', student);

console.log("Successfully spliced strings into Admin and Student.");
