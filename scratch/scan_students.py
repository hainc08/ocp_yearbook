import os
import json
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

base_path = 'images/students'
data = {}

if os.path.exists(base_path):
    print(f"Scanning {base_path}...")
    for class_folder in sorted(os.listdir(base_path)):
        class_path = os.path.join(base_path, class_folder)
        if os.path.isdir(class_path):
            data[class_folder] = {}
            print(f"  Class: {class_folder}")
            for student_folder in sorted(os.listdir(class_path)):
                student_path = os.path.join(class_path, student_folder)
                if os.path.isdir(student_path):
                    photos = [f for f in sorted(os.listdir(student_path)) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
                    print(f"    Student: {student_folder} -> {len(photos)} photos")
                    # Store relative paths from the root
                    data[class_folder][student_folder] = [os.path.join(base_path, class_folder, student_folder, p).replace('\\', '/') for p in photos]

output_path = 'js/data.js'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('const STUDENT_DATA = ')
    f.write(json.dumps(data, indent=2, ensure_ascii=False))
    f.write(';')

print(f"Generated {output_path}")
