import os
import re

file_path = r'c:\Users\Owner\Desktop\Job Portal\eligibility-engine\src\pages\Admin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern for the Marital Header and Baseline sub-label
pattern = r'<div>\s*<span style=\{\{ fontSize: "0\.75rem", fontWeight: 700, color: "var\(--text-primary\)", display: "block" \}\}>Marital Age Relaxation</span>\s*<span style=\{\{ fontSize: "0\.55rem", fontWeight: 600, color: "var\(--text-tertiary\)" \}\}>.*?</span>\s*</div>'

replacement = """<div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)", display: "block" }}>Extend Eligibility (Widow/Divorced)</span>
                    </div>"""

if re.search(pattern, text):
    new_text = re.sub(pattern, replacement, text)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Successfully implemented Choice 3 (Action-Oriented Toggle)")
else:
    print("Error: Could not find Marital Header pattern in Admin.jsx")
