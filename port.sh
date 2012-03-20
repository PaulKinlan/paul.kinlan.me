ls | sed 's/\(.*\).html$/\1/' | awk 'length($0) >= 57 { print "git mv",$0 ".html", substr($0,0,11) substr($0, 12, 45) ".html" }'
