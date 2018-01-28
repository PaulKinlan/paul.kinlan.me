# /usr/bin/python

import re
import sys
import os

files = os.listdir('content')

for file in files:
  slug = re.sub('^(\d\d\d\d-\d\d-\d\d)-', '', file )
  slug = re.sub('.markdown$', '', slug)
  
  with open("content/%s" % file, "r+") as f:
    lines = f.readlines()
    lines.insert(1, "slug: %s\n" % slug )
    f.seek(0,0)

    f.writelines(lines) 
