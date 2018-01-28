# /usr/bin/python

import re
import sys
import os

files = os.listdir('content')

for file in files:
  filename_match = re.match('(\d\d\d\d-\d\d-\d\d).*', file)
  if filename_match is not None:
    
    with open("content/%s" % file, "r+") as f:
      content = f.read()
      f.seek(0)

      output = re.sub(r'<table class="TechnoratiHead TagHeader">(.*)</table>', '', content, flags=re.MULTILINE|re.IGNORECASE|re.DOTALL)
      if output is not None:
        print 'Found %s' % file
      f.write(output)
      f.flush()
