---
layout: post
title: Honorificabilitudinitatibus
tags: programming project
comments: true
published: true
description: In which Shawn writes a post in attempts of impressing an employer
---

This semester has been a relentless stream of projects and chaos, so posts have had to take a back seat for a while.

Despite this, at some point in the last month, I thought it would be neat to see a visualization of the frequencies of certain letters as they appear at certain indices in English words. Me being me, I ignored the logical plan of searching for existing data- and wrote my own generator.

After an hour or so toying around with some Python image plotters, I settled on MatPlotLib (Pyplot). It's easy to use and had all of the functionality I needed (and them some).

The code itself is crazy simple, and available on my <a href="https://github.com/rssteffey/Letter-Frequencies" target="_blank">Github</a> now.

My initial results turned out... bleached:

![Who doesn't love grey?](http://i.imgur.com/bnwSwN9.png "Who doesn't love grey?")

Naively throwing colors at everything didn't help much...

![I seriously briefly considered "puke" as a viable color scheme](http://i.imgur.com/7riwvqE.png "I seriously briefly considered "puke" as a viable color scheme")

And that's when I realized my intended normalization was wrong.
I was correcting the data to make it percentage based (so all 26 characters' values added up to 1.0)

    <code>
    def normalize(sourceDicts):
        '''Normalize the given dictionaries'''
        newVals = []
        for i in range(len(sourceDicts)):
            sum = 0
            newVals.append([])
            for letter in  sorted(sourceDicts[i].items()):
                sum+= letter[1]
            print (sum)
            for letter in  sorted(sourceDicts[i].items()):
                newVals[i].append(letter[1] / sum)
        return newVals
    </code>

This isn't inherently wrong. In fact, that data is clearer to examine trends within one letter.
However, I actually wanted to correct so that the values were evenly spread from 0.0-1.0, giving a wider value range for the output.

    <code>
    def normalize2(sourceList):
        '''Actually normalize the initial normalize() results'''
        newVals = []
        for i in range(len(sourceList)):
            min = 1
            max = 0
            newVals.append([])
            for letterVal in  sourceList[i]:
                if letterVal > max:
                    max=letterVal
                if letterVal < min:
                    min = letterVal
            for letterVal in  sourceList[i]:
                newVals[i].append((letterVal - min)/(max - min))
        return newVals
    </code>

Unfortunately, one of the side effects of planning your entire program out before getting familiar with the libraries, is unnecessary code.
MatPlotLib has all of the normalization built in and would have saved me half an hour:

    <code>
    cm.colors.Normalize(sourceList)
    </code>

Regardless, I've stuck to using my own in the final script. I like having the finer grain tweaking if necessary.

Those normalization changes let us arrive at something at least SLIGHTLY better to look at:

![If you blur your eyes, it almost looks like a zebra back](http://i.imgur.com/lO4DkyF.png "If you blur your eyes, it almost looks like a zebra back")
Then I added back that color, since it helps with the pageview retention:

![Ahhh.  It's like a cool ocean breeze.](http://i.imgur.com/awsnfOm.png "Ahhh.  It's like a cool ocean breeze.")

So...
Yeah. I have to admit, it's far less interesting than I had envisioned in my head.
But, that doesn't mean there aren't still some really interesting aspects!

I personally love how the trend of the ending 'Y' shows as the gradient towards favoring longer words, and how the vowels don't become anything special until at least one character in, while 'S' practically refuses to be the second character.
And I realize that the sample size gets smaller and smaller as the word length grows, but the spurt of 'E's at 16 characters seems odd.

The data I've tested comes from a standard dictionary of common English (Grabbed from the <a href="http://wordlist.aspell.net/12dicts/" target="_blank">12Dicts repo</a>). But the real fun starts when you enter other sources. Here's a comparison with Shakespeare:

![The bottom starts to look like the name field on an exam bubble sheet](http://i.imgur.com/4S6vbCG.png "The bottom starts to look like the name field on an exam bubble sheet")

1500's English seems similar enough. Maybe a little light on utilizing the 'H' properly, potentially a bit more inclined to start words with a 'W'. I also really enjoy the fact that the aside from his rambling 27 character word ('Honorificabilitudinitatibus') our dear William kept to mostly 15-letter words or shorter.
Many words in modern English go longer than the 21 characters shown in my results, but I'm using a commonplace dictionary that passes them up (Note the lack of 'Antidisestablishmentarianism')

**Postmortem:**

I ended up essentially getting a distribution of average letter frequencies, but with enough variability to see points of interest. There are so many possibilities to test down this road. I personally want to try the works of several different authors, as well as testing different languages. (My current RegEx filter doesn't include accented characters, so that'll have to be fixed)

As soon as all of this graduation hubbub is over, I plan on trying the same script out with a better data-set, as well as refactoring my code to be a little more multi-use. Right now I've limited myself to the 26 Phoenecian letters. Also, I'd like to find an appropriate solution to remove plural words, as well as unconjugated verbs. The dictionary I reference includes both, which results in the column of S's overpowering the rest. This effect can be seen more clearly in the data before my normalization changes, where the 'S' column fades into prominence.

Most importantly though, I'd like to find a more interesting visualization than a grid. I'd really like to generate a <a href="http://en.wikipedia.org/wiki/Trie" target="_blank">trie</a>, and use that to show the spread of words from common roots, but I'm currently unsure how to go about visualizing that many branches...

![And/or an incredibly complex molecular structure](http://i.imgur.com/IyFZ4UM.png "And/or an incredibly complex molecular structure")

Whatever the case -- if I take away anything from this project -- no matter the era or position in a word, 'Q' is not to be trusted.
