# /usr/bin/python

import re
import sys
import os

files = os.listdir('content')

for file in files:
  filename_match = re.match('(\d\d\d\d-\d\d-\d\d).*', file)
  if filename_match is not None:

    output = ''
    
    with open("content/%s" % file, "r") as f:
      content = f.read()

    with open("content/%s" % file, "w") as f:
      output = re.sub(r'<table class="TechnoratiHead TagHeader">(.*)</table>', '', content, flags=re.MULTILINE|re.IGNORECASE|re.DOTALL)
      if output is not None:
        print 'Found %s' % file
      
      f.write(output)
      f.flush()
