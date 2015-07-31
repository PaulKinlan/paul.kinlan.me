# /usr/bin/python

import re
import sys
import os

files = os.listdir('content')

for file in files:
  filename_match = re.match('(\d\d\d\d-\d\d-\d\d).*', file )
  if filename_match is not None:
    file_date = filename_match.group(1)
    
    with open("content/%s" % file, "r+") as f:
      lines = f.readlines()
      lines[0] = "---\n"

      f.seek(0,0)

      f.writelines(lines) 
