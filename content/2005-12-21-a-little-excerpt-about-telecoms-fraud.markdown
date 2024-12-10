---
date: 2005-12-21
published: true
slug: a-little-excerpt-about-telecoms-fraud
summary: This excerpt from my final year project explores different types of telecom
  fraud, which I'll use as a basis for a C# neural network.  Telecom fraud can be
  categorized into subscription fraud (false identities or payment evasion), call
  surfing (unauthorized network access through methods like call forwarding or cloning),
  ghosting (manipulating systems to avoid billing), accounting fraud (internal manipulation
  of billing systems), and information abuse (misuse of client or system data).  I
  discuss the financial impact of these methods, such as bad debt from subscription
  fraud and costs incurred from call surfing via PABX manipulation.  I also touch
  upon the vulnerabilities of older analogue mobile phones to cloning and the methods
  used in ghosting, like tone generating hardware. The project aims to address these
  fraud types through a neural network approach.
tags:
- telecom fraud
- neural network
- C#
- security
- fraud detection
- subscription fraud
- call surfing
- ghosting
- accounting fraud
- information abuse
- PABX
- cloning
- social engineering
title: A Little excerpt about telecoms fraud

---
I have just uploaded a little excerpt from my Final Year project about Telecoms Fraud.  Basically I will use this as a grounding for creating my Neural Network in C#.<p />Enjoy! :)<p /><p>Telecomm Fraud can be broken into several generic classes.  These classes describe the mode in which the operator was defrauded and include subscription fraud, call surfing, ghosting, accounting fraud and information abuse.  Each mode can be used to defraud the network for revenue based purposes or non-revenue based purposes.<p /><a name="_Toc38350569"><span style="font-size: 180%;">Subscription Fraud</span></a><p />Subscription fraud occurs when an unsuspecting party have their identity stolen or a customer tries to evade payment.  Essentially, personal details provided to the company are erroneous and designed to deceive the company into setting up an account.  Reasons for this may include a customer knowing that they are a credit liability due to CCJ's or other credit problems; or a fraudster needs to obtain "legitimate" access to the telecomm network to perpetrate further modes of fraud.<p />Subscription fraud causes serious financial loses to the telecommunication operators, but in many instances may not be attributed to fraud.  If someone does not pay their bill, then the telecomm company has to establish if the person was fraudulent or is merely unable to pay.  This may result in a lot of subscription fraud being classified as bad debt.  The BT Group in 2001-2002 estimated that bad debt cost the company ~£79 million. </p><p><a name="_Toc38350570"><span style="font-size: 180%;">Call Surfing</span></a><p />Call Surfing is when an outside party will gain unauthorised access to the operators network through several methods such as call forwarding, cloning, shoulder surfing.<p />Call Surfing can include gaining access to a company's PABX (Private Branch Exchange) either via social engineering, or by lack of security.  Social Engineering could be considered as: A person rings the company's telephone administrators claiming to be a BT engineer performing a line test, they ask for the password so that they can negotiate access to the call-back of the PABX; or a employee in a large company receives a call from a person claiming to have got the wrong extension, and requests if they could put them through to extension 901, with 9 being the external dialling code of the PBX and 01 being the international prefix.<p />These may be unrealistic scenarios, but it is all too easy for someone to gain access to a system this way.  Once the cracker has access to the PABX, they can use it to forward calls internationally or to premium rate service lines.  All they pay for is the cost of the call to the company, while the company picks up the cost call to the proper destination.  The cracker may even escape paying for the original call if they covered their tracks, for instance via subscription fraud.<p />Cloning of mobile phones is another issue that will arise, especially since the early mobile phones operated on analogue with the signal emanating from the phone being easy to detect and read, and thus the technology used to identify each phone uniquely was susceptible to being read.  With this information, the fraudster would be able to reprogram one of their own phones to match these unique details.  Once done, the con artist would be able to use the phone to make all the calls that they needed without the original phone owner knowing (until they get the telephone bill that is).<a name="_Toc38350571"> </a></p><p><a name="_Toc39481362"><span style="font-size: 180%;">Accounting Fraud</span></a><p />Accounting Fraud can occur through manipulation of accounting systems and maybe used to help someone avoid having to pay for the service.  Normally this is an internal problem.  Accounting Fraud would normally occur, when someone would want to try and get cash back at the end of their billing period, or have their bill reduced. <a name="_Toc38350572"> </a></p><p><a name="_Toc39481363"><span style="font-size: 180%;">Ghosting</span></a><p />Ghosting requires knowledge of the internal systems, maybe an employee would set up an account that would not need to be billed or remove billing details from the system.  On the other hand, schemes may involve creating a piece of tone generating hardware that will fool the switch centre into thinking that a call might be a free call, or is operating from a public telephone.  Essentially, they are "Ghosts" on the system as there is little or no trace of them ever being present on the network.</p><p><a name="_Toc38350573"><span style="font-size: 180%;">Information Abuse</span></a><p />Information Abuse occurs when an employee can use the telecommunications companies software to access privileged information about clients or systems.  This information maybe passed on to third parties and used in further fraud.  However, it is not solely limited to this, for instance company A might place spies into company B to find out information about any alliances that company B might have.  Again, this is an internal fraud. </p><p />

