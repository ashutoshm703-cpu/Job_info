with open(r'c:\Users\Owner\Desktop\Job Portal\eligibility-engine\src\pages\Admin.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

open_braces = text.count('{')
close_braces = text.count('}')
open_parens = text.count('(')
close_parens = text.count(')')
open_tags = text.count('<')
close_tags = text.count('>')

print(f"Braces: {open_braces} vs {close_braces}")
print(f"Parens: {open_parens} vs {close_parens}")
print(f"Tags (approx): {open_tags} vs {close_tags}")
