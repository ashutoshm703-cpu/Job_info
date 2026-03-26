const fs = require('fs');

let student = fs.readFileSync('src/pages/Student.jsx', 'utf8');

const target1 = `<option value="MSc_Nursing">Master of Science in Nursing (M.Sc)</option>\r
                        <option value="B.Sc_Nursing">Bachelor of Science in Nursing (B.Sc)</option>\r
                        <option value="Post_Basic_BSc">Post-Basic B.Sc Nursing</option>\r
                        <option value="GNM">Diploma in GNM</option>`;
const target1Alt = `<option value="MSc_Nursing">Master of Science in Nursing (M.Sc)</option>\n                        <option value="B.Sc_Nursing">Bachelor of Science in Nursing (B.Sc)</option>\n                        <option value="Post_Basic_BSc">Post-Basic B.Sc Nursing</option>\n                        <option value="GNM">Diploma in GNM</option>`;

const rep1 = `{targetedExam && Object.keys(targetedExam.degrees || {}).map(deg => (
                           <option key={deg} value={deg}>{deg.replace(/_/g, ' ')}</option>
                        ))}`;

if (student.includes(target1)) {
   student = student.replace(target1, rep1);
} else if (student.includes(target1Alt)) {
   student = student.replace(target1Alt, rep1);
}

const target2 = `</select>\r
                  </div>\r
               </div>`;
const target2Alt = `</select>\n                  </div>\n               </div>`;

const rep2 = `</select>
                  </div>
               </div>
               
               {targetedExam && targetedExam.degrees && targetedExam.degrees[profile.degree] && (
                  <div style={{ marginBottom: '1.5rem', padding: '1rem', borderLeft: '4px solid var(--accent-secondary)', backgroundColor: 'var(--bg-app)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                     <strong>Live Requirement:</strong> Based on the exam rules, candidates with a <strong>{profile.degree.replace(/_/g, ' ')}</strong> degree must possess exactly <strong>{targetedExam.degrees[profile.degree].req_exp_months} months</strong> of clinical experience in a minimum <strong>{targetedExam.degrees[profile.degree].req_min_hospital_beds}-bed</strong> facility.
                  </div>
               )}`;

if (student.includes(target2)) {
    student = student.replace(target2, rep2);
} else if (student.includes(target2Alt)) {
    student = student.replace(target2Alt, rep2);
}

fs.writeFileSync('src/pages/Student.jsx', student);
console.log("Student.jsx successfully spliced");
