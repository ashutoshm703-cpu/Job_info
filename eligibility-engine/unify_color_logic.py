import os
import re

file_path = r'c:\Users\Owner\Desktop\Job Portal\eligibility-engine\src\pages\Admin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. ESM Grace Period: Currently using hardcoded #0F172A. Switch to var(--accent-primary) (Purple)
# 2. Govt. Employee Ceiling: Currently using hardcoded #0F172A. Switch to var(--accent-primary) (Purple)
# 3. Standardize "YRS" unit color for all Relaxation sections

# Fix ESM Grace color
esm_grace_pattern = r'<input type=\"number\" style=\{\{ width: \"100%\", background: \"transparent\", border: \"none\", fontSize: \"0\.9rem\", fontWeight: 800, padding: 0, color: \"#0F172A\", outline: \"none\" \}\} value=\{activeExam\.esm_grace_period \?\? 3\}'
esm_grace_replace = r'<input type="number" style={{ width: "100%", background: "transparent", border: "none", fontSize: "0.9rem", fontWeight: 800, padding: 0, color: "var(--accent-primary)", outline: "none" }} value={activeExam.esm_grace_period ?? 3}'

text = re.sub(esm_grace_pattern, esm_grace_replace, text)

# Fix Govt Ceiling color
govt_ceil_pattern = r'<input type=\"number\" style=\{\{ width: \"60px\", background: \"transparent\", border: \"none\", fontSize: \"0\.95rem\", fontWeight: 800, padding: 0, color: \"#0F172A\", outline: \"none\", textAlign: \"right\" \}\} placeholder=\"Nil\" value=\{activeExam\.absolute_age_ceiling \?\? \"\"\}'
govt_ceil_replace = r'<input type="number" style={{ width: "60px", background: "transparent", border: "none", fontSize: "0.95rem", fontWeight: 800, padding: 0, color: "var(--accent-primary)", outline: "none", textAlign: "right" }} placeholder="Nil" value={activeExam.absolute_age_ceiling ?? ""}'

text = re.sub(govt_ceil_pattern, govt_ceil_replace, text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully unified color logic: Standard (Top) in Navy, Relaxations (Bottom) in Purple.")
