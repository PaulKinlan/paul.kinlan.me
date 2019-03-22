---
slug: ricky-mondelloadoption-of-well-known-url-for-changing-passwords
date: 2019-01-31T22:02:32.092Z
title: 'Ricky Mondello: Adoption of Well-Known URL for Changing Passwords'
link: https://twitter.com/rmondello/status/1090702498220961793
tags: [links, safari, specs]
---
ਰੱਬੀ Mondello ਨੇ ਸਫਾਰੀ ਟੀਮ ਦੇ ਬਾਰੇ ਵਿੱਚ ਹੁਣੇ ਹੀ ਇੱਕ ਨੋਟ ਸਾਂਝਾ ਕੀਤਾ ਹੈ ਕਿ ਟਵਿੱਟਰ ਕਿਸ ਤਰ੍ਹਾਂ. /Well-known /change-password spec ਦੀ ਵਰਤੋਂ ਕਰ ਰਿਹਾ ਹੈ.

> I just noticed that Twitter has adopted the Well-Known URL for Changing Passwords! Is anyone aware of other sites that have adopted it?
> 
> Twitter's implementation: https://twitter.com/.well-known/change-password;
> Github's: https://github.com/.well-known/change-password;
> Specification :https://github.com/WICG/change-password-url

[Read full post](https://twitter.com/rmondello/status/1090702498220961793)

ਇਸ ਵਿਸ਼ੇਸ਼ਤਾ ਨੇ ਮੈਨੂੰ ਪੂਰੀ ਤਰਾਂ ਪਾਸ ਕਰ ਲਿਆ ਪਰ ਇਹ ਇਕ ਵਧੀਆ ਵਿਚਾਰ ਹੈ: ਇੱਕ ਚੰਗੀ ਥਾਂ ਤੇ ਇੱਕ ਫਾਈਲ ਦਿੱਤੀ ਗਈ ਹੈ, ਕੀ ਬ੍ਰਾਉਜ਼ਰ ਉਸ ਯੂਜਰ ਨੂੰ ਇੱਕ UI ਪੇਸ਼ ਕਰਦਾ ਹੈ ਜੋ ਸਾਈਟ ਨੂੰ ਨੇਵੀਗੇਟ ਕੀਤੇ ਬਿਨਾਂ ਆਪਣੇ ਪਾਸਵਰਡ ਨੂੰ ਤੇਜ਼ੀ ਨਾਲ ਰੀਸੈਟ ਕਰਨ ਦੀ ਆਗਿਆ ਦਿੰਦਾ ਹੈ.

ਇਹ ਸਪੱਸ਼ਟ ਹੈ ਧੋਖਾਧੜੀ: ਇਕ ਜਾਣੇ-ਪਛਾਣੇ ਫਾਇਲ ਵਿਚ ਸਿਰਫ਼ ਯੂਆਰਐਲ ਨੂੰ ਉਹ ਕਾਰਵਾਈ ਕਰਨ ਲਈ ਨਿਰਦੇਸ਼ਿਤ ਕਰਨ ਲਈ ਯੂਆਰਏਲ ਸ਼ਾਮਿਲ ਹੈ. ਇਹ ਮੈਨੂੰ ਸੋਚਣ ਲਈ ਅਗਵਾਈ ਕਰਦਾ ਹੈ, ਅਸੀਂ ਇਹਨਾਂ ਵਿੱਚੋਂ ਵਧੇਰੇ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੀ ਪੇਸ਼ਕਸ਼ ਕਰ ਸਕਦੇ ਹਾਂ:

* GDPR- ਅਧਾਰਿਤ ਸਹਿਮਤੀ ਮਾੱਡਲਾਂ (ਕੁਕੀ ਦੀ ਸਹਿਮਤੀ) ਲਈ ਇੱਕ ਮਸ਼ਹੂਰ ਸਥਾਨ - ਸਾਈਟ ਮਾਲਕ ਉਹਨਾਂ ਪੰਨਿਆਂ ਲਈ ਇੱਕ ਲਿੰਕ ਪੇਸ਼ ਕਰ ਸਕਦੇ ਹਨ ਜਿੱਥੇ ਇੱਕ ਉਪਭੋਗਤਾ ਪ੍ਰਬੰਧਿਤ ਕਰ ਸਕਦਾ ਹੈ ਅਤੇ ਸੰਭਾਵੀ ਰੂਪ ਨਾਲ ਸਾਰੇ ਕੁਕੀਜ਼ ਅਤੇ ਦੂਜੀਆਂ ਸੰਮਤੀ ਦੀਆਂ ਆਈਟਮਾਂ ਨੂੰ ਰੱਦ ਕਰ ਸਕਦਾ ਹੈ
* ਬ੍ਰਾਉਜ਼ਰ ਦੀ ਇਜਾਜ਼ਤ ਪ੍ਰਬੰਧਨ ਲਈ ਇੱਕ ਮਸ਼ਹੂਰ ਥਾਂ - ਸਾਈਟ ਮਾਲਕਾਂ ਨੂੰ ਭੂਗੋਲਿਕ ਸਥਾਨਾਂ, ਸੂਚਨਾਵਾਂ ਅਤੇ ਹੋਰ ਪ੍ਰਾਚੀਨਤਾ ਜਿਹੀਆਂ ਚੀਜ਼ਾਂ ਲਈ ਉਪਭੋਗਤਾਵਾਂ ਨੂੰ ਅਨੁਮਤੀਆਂ ਵਾਪਸ ਲੈਣ ਦੇ ਲਈ ਇੱਕ ਤੇਜ਼ ਸਥਾਨ ਦੀ ਪੇਸ਼ਕਸ਼ ਕਰ ਸਕਦੀ ਹੈ.
* ਖਾਤਾ ਹਟਾਉਣ ਅਤੇ ਬਦਲਾਅ ਲਈ ਇੱਕ ਜਾਣਿਆ ਮਾਰਗ
* ਮੇਲਿੰਗ ਲਿਸਟ ਗਾਹਕੀ ਪ੍ਰਬੰਧਨ ਲਈ ਇੱਕ ਜਾਣਿਆ ਮਾਰਗ

ਸੂਚੀ ਵਿੱਚ ਅੱਗੇ ਆਉਂਦੀ ਹੈ .... ਮੈਂ ਅਸਲ ਰੀਡਾਇਰੈਕਟ ਫਾਈਲਾਂ ਦੇ ਵਿਚਾਰ ਨੂੰ ਆਮ ਲੋਕਾਂ ਦੀਆਂ ਆਮ ਕਾਰਵਾਈਆਂ ਦੀ ਖੋਜ ਕਰਨ ਲਈ ਉਪਭੋਗਤਾਵਾਂ ਦੀ ਮਦਦ ਕਰਨਾ ਚਾਹੁੰਦਾ ਹਾਂ, ਅਤੇ ਇਸ ਨੂੰ ਬਰਾਊਜ਼ਰ ਨੂੰ ਦਿਖਾਉਣ ਲਈ ਇੱਕ ਢੰਗ ਦੇ ਤੌਰ ਤੇ

* ਅੱਪਡੇਟ: * ਮੈਂ ਇੱਕ [issue to Chrome to see if we can get a similar implementation](https://bugs.chromium.org/p/chromium/issues/detail?id=927473) ਜੋੜਿਆ