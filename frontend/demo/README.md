# Static site generator demo


* Install hugo

    * Steps described [here](https://gohugo.io/getting-started/installing/)

* Create demo site

```
tglynn:demo$ git checkout -b "demo/staticsitedemo"
Switched to a new branch 'demo/staticsitedemo'
tglynn:demo$ hugo new site cs673-demo
Congratulations! Your new Hugo site is created in /Users/tglynn/projects/cs673/github/cs673/frontend/demo/cs673-demo.

---
Just a few more steps and you're ready to go:

1. Download a theme into the same-named folder.
   Choose a theme from https://themes.gohugo.io/, or
   create your own with the "hugo new theme <THEMENAME>" command.
2. Perhaps you want to add some content. You can add single files
   with "hugo new <SECTIONNAME>/<FILENAME>.<FORMAT>".
3. Start the built-in live server via "hugo server".

Visit https://gohugo.io/ for quickstart guide and full documentation.
tglynn:demo$ git status
On branch infra/configure_bucket
Your branch is up to date with 'origin/infra/configure_bucket'.

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	./

nothing added to commit but untracked files present (use "git add" to track)
```

* Add a theme

```
tglynn:cs673-demo$ cd themes/
tglynn:themes$ git clone https://github.com/bul-ikana/hugo-cards
Cloning into 'hugo-cards'...
remote: Enumerating objects: 171, done.
remote: Counting objects: 100% (171/171), done.
remote: Compressing objects: 100% (113/113), done.
remote: Total 171 (delta 54), reused 161 (delta 44), pack-reused 0
Receiving objects: 100% (171/171), 368.78 KiB | 10.24 MiB/s, done.
Resolving deltas: 100% (54/54), done.
```


* Edit site config

```
tglynn:cs673-demo$ vim config.toml
tglynn:cs673-demo$ cat config.toml
baseURL = "http://cs673-project-repository.s3-website.us-east-2.amazonaws.com/"
languageCode = "en-us"
title = "CS 673 Project Repository"

theme = "hugo-cards"
paginate = 6

[params]
  builtBy = ""
  defaultImage = "image-1.png"

  facebook = ""
  quora = ""
  twitter = ""
  github = ""
  email = ""

  fbLikeBox = ""
  fbAppId = ""
  fbPageUrl = ""
  fbPageTitle = ""

  analytics = ""
  disqus = ""

  [params.copyright]
     name = ""
     link = ""
```

* Make a test post

```
tglynn:cs673-demo$ hugo new posts/test-post.md
/Users/tglynn/projects/cs673/github/cs673/frontend/demo/cs673-demo/content/posts/test-post.md created
tglynn:cs673-demo$ vim content/posts/test-post.md
```

* Generate site

```
tglynn:cs673-demo$ hugo

                   | EN
+------------------+----+
baseURL = "http://cs673-project-repository.s3-website.us-east-2.amazonaws.com/"
  Pages            |  9
  Paginator pages  |  0
  Non-page files   |  0
  Static files     |  8
  Processed images |  0
  Aliases          |  4
  Sitemaps         |  1
  Cleaned          |  0

Total in 63 ms
```

* Upload to S3

```
tglynn:cs673-demo$ aws s3 sync public/ s3://cs673-project-repository/
upload: public/.DS_Store to s3://cs673-project-repository/.DS_Store
upload: public/posts/test-post/index.html to s3://cs673-project-repository/posts/test-post/index.html
upload: public/categories/index.html to s3://cs673-project-repository/categories/index.html
upload: public/categories/index.xml to s3://cs673-project-repository/categories/index.xml
upload: public/page/1/index.html to s3://cs673-project-repository/page/1/index.html
upload: public/categories/page/1/index.html to s3://cs673-project-repository/categories/page/1/index.html
upload: public/index.xml to s3://cs673-project-repository/index.xml
upload: public/posts/index.html to s3://cs673-project-repository/posts/index.html
upload: public/index.html to s3://cs673-project-repository/index.html
upload: public/posts/page/1/index.html to s3://cs673-project-repository/posts/page/1/index.html
upload: public/posts/index.xml to s3://cs673-project-repository/posts/index.xml
upload: public/sitemap.xml to s3://cs673-project-repository/sitemap.xml
upload: public/tags/index.html to s3://cs673-project-repository/tags/index.html
upload: public/tags/index.xml to s3://cs673-project-repository/tags/index.xml
upload: public/tags/page/1/index.html to s3://cs673-project-repository/tags/page/1/index.html
upload: public/sass/main.css to s3://cs673-project-repository/sass/main.css
```

* Test at the [s3 site](http://cs673-project-repository.s3-website.us-east-2.amazonaws.com/)
