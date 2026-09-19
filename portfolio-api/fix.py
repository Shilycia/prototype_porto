import os, re

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(r'from\s+([\'\"])([\.\/]+[^\'\"]+)(?<!\.js)\1', r'from \g<1>\g<2>.js\g<1>', content)
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith('.ts'):
            process_file(os.path.join(root, f))
