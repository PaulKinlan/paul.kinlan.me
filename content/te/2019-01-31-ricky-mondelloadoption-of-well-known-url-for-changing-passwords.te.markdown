---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
సఫారి జట్టులో రిక్కీ మొండేల్లో పైగా ఇటీవలే ట్విట్టర్ ఎలా ఉపయోగించాలో గురించి ఒక గమనికను పంచుకున్నారు.

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793) .

ఈ లక్షణం నన్ను పూర్తిగా ఆమోదించింది కానీ అది చక్కగా సరిపోతుంది: ఒక ప్రసిద్ధ నగరంలో ఒక ఫైల్ ఇచ్చినట్లయితే, బ్రౌజర్ వినియోగదారులకు ఒక UI ను అందించగలదు, ఇది సంభావ్య UI సైట్లను నావిగేట్ చేయకుండానే వారి పాస్వర్డ్ను త్వరగా రీసెట్ చేయడానికి అనుమతిస్తుంది.

స్పెక్స్ deceptively సులభం: బాగా తెలిసిన ఫైలు కేవలం చర్య నిర్వహించడానికి కావలసినప్పుడు వినియోగదారు దర్శకత్వం URL కలిగి. ఈ ఆలోచన నాకు దారితీస్తుంది, మేము ఈ లక్షణాలను మరింత అందించగలము:

* GDPR ఆధారిత సమ్మతి నమూనాల (కుకీ సమ్మతి) కోసం ఒక మంచి ప్రదేశం - సైట్ యజమానులు వినియోగదారుని నిర్వహించగల పేజీని లింక్ను అందించవచ్చు మరియు అన్ని కుక్కీలు మరియు ఇతర డేటా సమ్మతి అంశాలని సమర్థవంతంగా రద్దు చేయవచ్చు.
* బ్రౌజర్ అనుమతి నిర్వహణకు బాగా తెలిసిన ప్రదేశం - సైట్ యజమానులు వినియోగదారులు జియో-లొకేషన్, నోటిఫికేషన్లు మరియు ఇతర ప్రైమటివ్స్ వంటి వాటికి అనుమతులను ఉపసంహరించుకోవటానికి త్వరిత స్థలాన్ని అందించవచ్చు.
ఖాతా తొలగింపు మరియు మార్పులకు బాగా తెలిసిన మార్గం
* మెయిలింగ్ జాబితా చందా నిర్వహణకు బాగా తెలిసిన మార్గం

ఈ జాబితా కొనసాగుతుంది .... సాధారణ వినియోగదారుడు చర్యలను తెలుసుకునేందుకు యూజర్లకు సహాయంగా సాధారణ రీడైరెక్ట్ ఫైళ్లను నేను నిజంగా ఇష్టపడుతున్నాను, బ్రౌజర్ను ఉపరితలం చేయడానికి ఒక మార్గం కోసం.

* అప్డేట్: * నేను ఒక [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) .