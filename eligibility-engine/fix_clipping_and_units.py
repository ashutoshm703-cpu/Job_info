import os
import re

file_path = r'c:\Users\Owner\Desktop\Job Portal\eligibility-engine\src\pages\Admin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add "YRS" unit to the Govt. Employee absolute_age_ceiling input
govt_pattern = r'<input type=\"number\" style=\{\{ width: \"80px\", background: \"transparent\", border: \"none\", fontSize: \"0\.95rem\", fontWeight: 800, padding: 0, color: \"#0F172A\", outline: \"none\" \}\} placeholder=\"No Limit\" value=\{activeExam\.absolute_age_ceiling \?\? \"\"\} onChange=\{\(e\) => updateExamData\(\(p\) => \(\{ \.\.\.p, absolute_age_ceiling: e\.target\.value \? Number\(e\.target\.value\) : \"\" \}\)\)\} />'
govt_replace = r'''<input type="number" style={{ width: "60px", background: "transparent", border: "none", fontSize: "0.95rem", fontWeight: 800, padding: 0, color: "#0F172A", outline: "none", textAlign: "right" }} placeholder="Nil" value={activeExam.absolute_age_ceiling ?? ""} onChange={(e) => updateExamData((p) => ({ ...p, absolute_age_ceiling: e.target.value ? Number(e.target.value) : "" }))} />
                            <span style={{ fontSize: "0.45rem", fontWeight: 900, color: "var(--accent-primary)", opacity: 0.7, marginLeft: "4px" }}>YRS</span>'''

text = re.sub(govt_pattern, govt_replace, text)

# 2. Fix digit clipping for the Marital Exemption (Widow/Divorced) grace period input
# We need to increase the width from 32px to 45px to prevent clipping "45"
marital_input_pattern = r'style=\{\{ width: \"32px\", background: \"transparent\", border: \"none\", fontSize: \"0\.95rem\", fontWeight: 800, padding: 0, textAlign: \"right\", color: \"var\(--accent-primary\)\", outline: \"none\" \}\} value=\{activeExam\.marital_grace_period \?\? 5\}'
marital_input_replace = r'style={{ width: "45px", background: "transparent", border: "none", fontSize: "0.95rem", fontWeight: 800, padding: 0, textAlign: "right", color: "var(--accent-primary)", outline: "none" }} value={activeExam.marital_grace_period ?? 5}'

text = re.sub(marital_input_pattern, marital_input_replace, text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully fixed character clipping and added the missing 'YRS' unit suffix.")
