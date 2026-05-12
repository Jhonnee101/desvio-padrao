with open('questions2.json', 'rb') as f:
    content = f.read()
import re
matches = list(re.finditer(rb"\\'", content))
for m in matches:
    print(f"Found \\' at byte {m.start()}")
if not matches:
    print("No escaped single quotes found")
print(f"Total file size: {len(content)} bytes")
