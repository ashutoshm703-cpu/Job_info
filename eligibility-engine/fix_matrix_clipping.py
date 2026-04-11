import os
import re

file_path = r'c:\Users\Owner\Desktop\Job Portal\eligibility-engine\src\pages\Admin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Category Relaxation (OBC, SC, ST)
# Old: width: "32px" -> New: width: "42px"
cat_pattern = r'<input type=\"number\" style=\{\{ width: \"32px\", background: \"transparent\", border: \"none\", textAlign: \"right\", fontWeight: 800, color: \"var\(--accent-primary\)\", fontSize: \"0\.9rem\", outline: \"none\", padding: 0 \}\} value=\{activeExam\.category_relaxations\?\.\[cat\] \?\? \"\"\}'
cat_replace = r'<input type="number" style={{ width: "42px", background: "transparent", border: "none", textAlign: "right", fontWeight: 800, color: "var(--accent-primary)", fontSize: "0.9rem", outline: "none", padding: 0 }} value={activeExam.category_relaxations?.[cat] ?? ""}'

text = re.sub(cat_pattern, cat_replace, text)

# 2. PwBD Relaxation (UR, OBC, SC, ST)
# Old: width: "32px" -> New: width: "42px"
pwbd_pattern = r'<input type=\"number\" style=\{\{ width: \"32px\", background: \"transparent\", border: \"none\", textAlign: \"right\", fontWeight: 800, color: \"var\(--accent-primary\)\", fontSize: \"0\.9rem\", outline: \"none\", padding: 0 \}\} value=\{activeExam\.pwbd_relaxations\?\.\[pCat\] \?\? \"\"\}'
pwbd_replace = r'<input type="number" style={{ width: "42px", background: "transparent", border: "none", textAlign: "right", fontWeight: 800, color: "var(--accent-primary)", fontSize: "0.9rem", outline: "none", padding: 0 }} value={activeExam.pwbd_relaxations?.[pCat] ?? ""}'

text = re.sub(pwbd_pattern, pwbd_replace, text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully increased Relaxation Matrix input width to 42px to prevent 2-digit clipping.")
