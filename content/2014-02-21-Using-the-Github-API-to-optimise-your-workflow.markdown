---
layout: post
title: "Using the Github API to optimise your workflow"
date: 2014-02-21 12:15
comments: true
draft: true
published: true
categories: github api html5rocks webhook
---

It is no secret that Github is amazing.  I don't think it is widely known that they also have a **very** comprehensive [Developer Platform](http://developer.github.com/).

![Developer Landing Page](/images/developers-github.png)

I admit it.  **I love the API**.  It's an amazing example of how to build a platform.

Rather than fawning over Github, I really want to talk about the projects that I have worked on recently that take advantage of the API and roughly how we utilised this platform to optimise our workflows and experiences.

The first is [HTML5 Rocks](http://www.html5rocks.com/) and the second is [DevArt](http://devart.withgoogle.com).  I will only focus on HTML5 Rocks in this article (it turned out to be a lot longer than I planned).

HTML5 Rocks is a resource that we manage for web developers.  It is entirely open source and the content licenced under Creative Commons.  We host the site on AppEngine and the code on Github.  Admittedly it is not obvious how we could use the Github API to help us.

The original process for deploying to HTML5Rocks was for a weekly "Sheriff" to monitor Github for any commit from the team or pull-request, `git pull` to a local repository, check the changes locally, run the site through a compressor and finally upload it to AppEngine.  

Not only was it manual, you were flying blind.  If you were the Sheriff you had no idea what was due to be launched that week.  We used the [issue tracker](https://github.com/html5rocks/www.html5rocks.com/issues) to manage the article pipeline but we couldn't use the [Milestones](https://github.com/html5rocks/www.html5rocks.com/issues/milestones) effectively because as a content site we didn't work to milestones.

This process was tedious and could often be error prone.  You were not a happy bunny if you were the weekly sheriff.

The first task was to make our article pipeline more visible for the entire team.  We needed some sort of dashboard...

## Working with Github Issues API

The Github API offers the ability to nearly fully manage your repositories issues.  All of our [articles that are due to be delivered](https://github.com/html5rocks/www.html5rocks.com/issues?direction=desc&labels=new+article&page=1&sort=created&state=open) are in the issue tracker.  Combing the two we can automatically get a list of articles that are delivered and article that are yet to be completed.

Our new Workflow is:

*  Create an issue with some meta data (about the owner, the reviewer and the due date)
*  Work on your article in your own repo
*  Issue a pull request with the title "Fixes #[your issue number]"

That's it.  The system does the rest.

*  Github [automatically closes](https://help.github.com/articles/closing-issues-via-commit-messages) the issue when the pull request is merged.  
*  The system picks up this change, pulls down the latest code, 
*  Regenerates the [Calendar Dashboard](https://github.com/html5rocks/www.html5rocks.com/blob/master/CALENDAR.md)
*  Commits the change and pushes it back up to Github.

This is pretty cool.  We now have automated our article pipeline.  This gives us greater visibility across the team as to what changed on a week by week basis.  In this scenario, commits are not important but delivery of articles is.

![Issues dashboard](/images/html5rocks-issues.png)

The [full code for this report generation is in our repository](https://github.com/html5rocks/www.html5rocks.com/blob/master/reports/quarter-report.py).  We used [PyGithub](https://github.com/jacquev6/PyGithub) to simplify access to the API.  To show how simple it is to use a summary appears below.

    open_issues = repo.get_issues(state="open")
    closed_issues = repo.get_issues(state="closed")

    issues = []
    [issues.append(i) for i in open_issues]
    [issues.append(i) for i in closed_issues]
    today = datetime.today()
    completed_articles, late_articles, due_articles = ParseIssues(issues)

    print "HTML5 Rocks Quarter Report for %s" % today.date()
    print "=========================================\n"

    print "Articles due this quater"    
    print "------------------------\n"

    if len(due_articles) == 0: 
        print "There are no articles due this quarter, either all is good, or something messed up!\n"
    else:
        print "|Author|Article|Delivery date|Tech Writer|State|"
        print "|------|-------|-------------|-----------|-----|"

        for article in due_articles:
            print "|%s|[%s](%s)|%s|%s|%s" % ((article.assignee or article.user).name, article.title, article.html_url, article.due_on.date(), article.tech_writer, article.state)

See.  Pretty simple.

This is great, but once the author has committed their article they still can't see it live on the web.  To make this easier we need to do a little more work.

I have not seen anyone auto deploy to App Engine via Github yet so I hope this serves as an example of how it is possible.

## Deploying to App Engine from Github

If you have ever used AppEngine you will know that deploying a new build is often a manual process.  It is a pain.  Most developers don't know that you can automate it using the command line tool.

If you can push live automatically, then all you really need to do is push the changes as they happen.  The question is how do you get notified about changes to a repository as it happens?  Polling? No.

Github use [Webhooks](https://github.com/blog/1778-webhooks-level-up).  They are _**Amazeballs**_.  WebHooks let you register a url that Github will call whenever there is a change to the repository.  When you get this call you can automate some process on your system.  It is that simple.  It is very **very** powerful.

We then used a [custom version](https://github.com/PaulKinlan/Github-Auto-Deploy) of [Github-Auto-Deploy](https://github.com/logsol/Github-Auto-Deploy) to manage two read-only versions of site (staging and live.)

Github-Auto-Deploy is a rather amazing micro-server, it simply listens to GitHub Webhooks, pulls in the changes to the repository and runs a command.  In our case the example command is as follows:

    versionStr=${1:-master}
    appcfg.py --oauth2 --version=$versionStr update ../

See the first line above?  That lets us choose which appengine version we will deploy to, it is based off the name of the branch.  By default **any** commit to the repository will push to our staging server.  Any commit to repository to the **live** branch will push to the live site.

The interesting part here is that we can simply create a [pull request from our master branch](https://github.com/html5rocks/www.html5rocks.com/pull/979) to our [live branch](https://github.com/html5rocks/www.html5rocks.com/tree/live) branch and via the WebHook system we will have all the staged changes live and available to all of our users.

![Merge from staging to live](/images/github-merge.png)

We are pretty pleased with this process.  We made it far easier to test changes on the web site and more importantly we took getting a change "live" from about 8 minutes to 10 seconds (excluding deploy time to appengine - about 30 seconds) and we saved our team a lot of frustration.  An added benefit, although I can't prove it, is that since the increases in deployment and testing efficiency we have seen a massive increase in external developer contributions.

With HTML5 Rocks we have only touched the surface of the API, but I encourage every developer who uses Github to check out the API and think about how you can integrate it in to your workflow to improve your efficiency.
