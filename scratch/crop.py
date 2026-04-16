
from PIL import Image

img = Image.open('../images/1.png')

# 1. Vinschool Logo
logo = img.crop((20, 10, 180, 150))
logo.save('../images/logo_raw.png')

# 2. Ocean Park Badge
badge = img.crop((1200, 10, 1350, 160))
badge.save('../images/badge_raw.png')

# 3. Calendar
cal = img.crop((1100, 580, 1350, 760))
cal.save('../images/calendar_raw.png')
