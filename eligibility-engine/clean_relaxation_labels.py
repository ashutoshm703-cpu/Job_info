import os
import re

file_path = r'c:\Users\Owner\Desktop\Job Portal\eligibility-engine\src\pages\Admin.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Clean up category_relaxation mapping
# 2. Clean up pwbd_relaxation mapping
# 3. Clean up marital exemption grace section

# Simplified replacement for the entire relaxation matrix blocks

# Find Category Relaxation mapping
cat_pattern = r'<div style=\{\{ display: \'flex\', alignItems: \'center\', gap: \'8px\', background: \"white\", padding: \"4px 8px\", borderRadius: \"6px\", border: \"1px solid var\(--border-subtle\)\" \}\}>\s*<span style=\{\{ fontSize: \'0\.45rem\', fontWeight: 900, color: \'#64748b\', textTransform: \'uppercase\' \}\}>GRACE</span>'
cat_replace = r'<div style={{ display: "flex", alignItems: "center", gap: "10px", background: "white", padding: "4px 12px", borderRadius: "8px", border: "1.5px solid var(--border-subtle)" }}>'

text = re.sub(cat_pattern, cat_replace, text)

# Find PwBD Benefit mapping
pwbd_pattern = r'<div style=\{\{ display: \'flex\', alignItems: \'center\', gap: \'8px\', background: \"white\", padding: \"4px 8px\", borderRadius: \"6px\", border: \"1px solid var\(--border-subtle\)\" \}\}>\s*<span style=\{\{ fontSize: \'0\.45rem\', fontWeight: 900, color: \'#64748b\', textTransform: \'uppercase\' \}\}>BENEFIT</span>'
pwbd_replace = r'<div style={{ display: "flex", alignItems: "center", gap: "10px", background: "white", padding: "4px 12px", borderRadius: "8px", border: "1.5px solid var(--border-subtle)" }}>'

text = re.sub(pwbd_pattern, pwbd_replace, text)

# Update the suffixes to be slightly more prominent and clear "YRS"
suffix_pattern = r'<span style=\{\{ fontSize: \'0\.45rem\', fontWeight: 900, color: \'#94a3b8\' \}\}>YRS</span>'
suffix_replace = r'<span style={{ fontSize: "0.55rem", fontWeight: 900, color: "var(--accent-primary)", opacity: 0.7 }}>YRS</span>'

text = re.sub(suffix_pattern, suffix_replace, text)

# Clean up the Marital Exemption Grace labels
marital_pattern = r'<div style=\{\{ display: \"flex\", alignItems: \"center\", gap: \"8px\", background: \"white\", padding: \"6px 12px\", borderRadius: \"8px\", border: \"1.5px solid var\(--border-subtle\)\", boxShadow: \"0 2px 4px rgba\(0,0,0,0\.02\)\" \}\}>\s*<span style=\{\{ fontSize: \"0\.45rem\", opacity: 0\.6, fontWeight: 900, textTransform: \"uppercase\" \}\}>GRACE</span>'
marital_replace = r'<div style={{ display: "flex", alignItems: "center", gap: "10px", background: "white", padding: "6px 16px", borderRadius: "8px", border: "1.5px solid var(--border-subtle)", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>'

text = re.sub(marital_pattern, marital_replace, text)

# Final unit for marital grace
marital_unit_pattern = r'<span style=\{\{ fontSize: \"0\.45rem\", opacity: 0\.6, fontWeight: 900 \}\}>YRS</span>'
marital_unit_replace = r'<span style={{ fontSize: "0.55rem", fontWeight: 900, color: "var(--accent-primary)", opacity: 0.7 }}>YRS</span>'

text = re.sub(marital_unit_pattern, marital_unit_replace, text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Successfully cleaned up redundant GRACE/BENEFIT labels and unified the relaxation matrix.")
