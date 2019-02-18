---
layout: post
title: Using latexdiff and latexpand for marking changes between two paper versions
categories:
- 
tags:
- 
- 
---

I recently used `latexdiff` during the paper shepherding process. I found it very useful for highlighting changes between different papers versions (basically the submission version and the revised version shared to the shepherd).

Here's a thorough tutorial on `latexdiff`: [https://www.overleaf.com/learn/latex/Articles/Using_Latexdiff_For_Marking_Changes_To_Tex_Documents](https://www.overleaf.com/learn/latex/Articles/Using_Latexdiff_For_Marking_Changes_To_Tex_Documents).

I only have one more thing to add. If you have multiple tex files for your paper, before calling `latexdiff` you need to run `latexpand` on your master tex (say `paper_master.tex`).

    $ cd paper_dir # latexpand doesn't work outside your paper folder
    $ latexpand paper_master.tex > paper_expanded.tex

Once you have `paper_old_expanded.tex` and `paper_new_expanded.tex`, you need to run 

    $ latexdiff paper_old_expanded.tex paper_new_expanded > paper_diff.tex

Then you can compile `paper_diff.tex` the same way of compiling `paper_master.tex`. This means `paper.diff` requires the same resources, such as embedded source code files, figures, etc. 

Tips
====
If you cannot compile `paper_diff.tex`, try the following solutions (and cross your fingers).

1. Using `xelatex` instead of `latex` or `pdflatex`. I don't know why but it appears to me that `xelatex` is more robust.
2. Replacing the default `latexdiff` preamble with [these lines](/assets/txt/latexdiff_preamble.txt).