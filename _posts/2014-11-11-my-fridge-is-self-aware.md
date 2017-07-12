---
layout: post
title: Sentient Fridge
tags: programming project
comments: true
published: true
description: In which Shawn's fridge becomes death, tweeter of words.
---

Programming knowledge is a wondrous thing.

I can make a pile of wires and silicon read my commands, translate them to a series of 1's and 0's, and then perform any action I desire (assuming I also have the hardware to support it).

It's a bit like being a wizard really. Only rather than barely obscured latin linguistic roots combined in various ways, I just type a bunch of repetitive terms in the right pattern until something happens (also occasionally grabbing chunks of these patterns from other spells I can find on the internet).

I have the technical ability to write programs capable of absolutely ground-breaking things. We live in era so massively interconnected, that through a little bit of code and combining the right frameworks, anything is possible.
As such, I spent the weekend making my fridge tweet things.

I have no clue why the idea came into being. All I know is that last month, I suddenly decided to build a TwitterBot.

![I do not endorse the use of heavy appliances as self-aware entities](http://i.imgur.com/foTzIz4.png "I do not endorse the use of heavy appliances as self-aware entities")

The plan: A webcam, some magnetic letters, and a Python OCR library.

I went to Walmart, bought a pack of alphabet fridge magnets, and set up my whiteboard.

The script only took a couple of hours to get down. Most of the time was spent getting used to using OpenCV and understanding just how in the heck to use Twitter authorization tokens (Fun fact: I am still only 80% sure I could explain the Twitter API to someone).

The ***code*** for the Tweeting process is incredibly straightforward. \[Using the Twython library\]

    <code>
    APP_KEY = REDACTED  
    APP_SECRET = REDACTED  
    OAUTH_TOKEN = 'JustPictureThisAsARandomJumbleOfLettersRoughlyThisLong'
    OAUTH_TOKEN_SECRET = 'AnotherRandomJumbleOfRoughlyTheSameLength'

    #Create Twitter object
    twitter = Twython(APP_KEY, APP_SECRET, OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
    #Send it on
    twitter.update_status(status=toTweet)
    </code>

What I still don't have a handle on is how to correctly and securely get those first four variables.
For the purposes of this experiment (Throwaway Twitter account and one-person app), I manually grabbed the tokens and secrets from the Twitter Developer stats pages for my registered app and hardcoded them into the script.
Twitter specifically says to not do this. My hopes are that they really mean "Yeah... don't let other people find these numbers out", which I'm pretty sure applies to anything labelled "Secret" in a daily life context as well. Regardless, as a certified rebel, I felt it was in the best interests of this project to ignore all advice and clunkily get the project up and running.

Despite just now writing about it first, the Tweet functionality was actually the last stage of the project. After awkwardly propping up a testing board between my trash-can and dresser, and getting my webcam appropriately angled, the work came down to taking an image, and creating a classifier to read the text in that image. One of these things ended up being far more difficult than the other (And it isn't the one you'd probably expect).

My only past experiences with machine learning had been with Neural Networks (Restricted Boltzman machines for my 2013 summer, and a standard feed-forward net during an AI (Artifical) class last year).
Since I was just doing simple contour classification on 26 possible classes, I decided to use a K-nearest neighbors classifier. I'm not going to explain it here, mainly because there are far better <a href="http://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm" target="_blank">examples</a> already available

OpenCV makes this an incredibly complicated process.

    <code>
    model = cv2.KNearest()
    </code>

And then there's the laborious page after page of code to input the sample data and train the classifier...

    <code>
    samples = np.loadtxt('generalsamples.data',np.float32)
    responses = np.loadtxt('generalresponses.data',np.float32)
    responses = responses.reshape((responses.size,1))

    model.train(samples,responses)
    </code>

Oh. Well that went much easier than expected.. Let's see how we did.

![Ah ah ah.  You didn't say the magic word.  Ah ah ah.](http://i.imgur.com/DPB2j2Q.png "Ah ah ah.  You didn't say the magic word.  Ah ah ah.")

Oh yeah. We should probably take an image, find the contours, and match those contours with our model... right now we are literally doing nothing with the current image.

I will spare you the details on image alterations, just because they are truly a result of random tinkering. I can only back up a few of my choices and all else was purely trial and error.

    <code>
    crop = camera_capture[125:(125+height), 200:(200+width)]
    colorblur = cv2.GaussianBlur(crop,(5,5),0)
    </code>

Okay, well so far, that's straightforward.

- Crop to the relevant parts of the webcam's image (the board area)
- Blur to remove any sharp or incorrect pixels

And now we'll go through the small ranges of each possible color, to isolate only the letter parts of the image:

    <code>
    boundaries = [
            ([25, 100, 30], [43, 255, 255]), #yellow
            ([50, 135, 50], [96, 255, 255]), #green
            ([100, 180, 50], [125, 255, 255]), #blue
            ([150, 180, 50], [180, 255, 255]), #Top reds
            ([0, 180, 50], [15, 255, 255]) #Bottom reds
        ]

    mask = np.zeros((height,width,1), np.uint8)
    # loop over the color boundaries
    for (lower, upper) in boundaries:
        # create NumPy arrays from the boundaries
        lower = np.array(lower, dtype = "uint8")
        upper = np.array(upper, dtype = "uint8")

        #Add these color pixels to mask
        r1 = cv2.inRange(img_hsv, lower, upper)
        mask = cv2.add(r1,mask)
    </code>

And then take that mask and find the contours!

    <code>
    output = cv2.bitwise_and(colorblur, colorblur, mask = mask)
    contours, hierarchy = cv2.findContours(backtogray,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
    </code>

We have the contours, but we have to classify them. Now here's where things got tricky.
My first iteration disregarded letter color entirely. I (naively) assumed that a static camera angle and distinct set of only 26 uniform characters would make detection pretty straightforward.

![I mean it....recognized three separate letters?...I guess that's good](http://i.imgur.com/7BJdJW4.png "I mean it....recognized three separate letters?...I guess that's good")

After moving the rig in the kitchen and integrating onto the fridge, that opinion shifted with roughly the results shown there.

As it turns out, deciphering a 640x480 resolution image from across the kitchen with tiny yellow letters in yellowish lighting on a slightly dirty yellowish fridge is tougher than I'd first guessed.

![Only partially inspired by Shawn's own twice-yearly visits to the Eye Doctor](http://i.imgur.com/Vfk0ygB.png "Only partially inspired by Shawn's own twice-yearly visits to the Eye Doctor")

So, I redesigned the contour classifications to be hue specific.

Not wanting to uproot my entire process, I sacrificed some processing speed for ease of implementation (The webcam was only taking an image every minute, so the efficiency loss \[within reason\] doesn't affect the program)
I read the initial contours as before, and just changed my classifications after the fact to try and line up with associated letter colors

    <code>
    if avg[0] >= 45 and avg[0] < 95: #greens
        if chr(results[0][0]) in 'cgnrx':
            string = chr(results[0][0])
        else:
            for letter in neighbors[0]:
                if chr(int(letter)) in 'cgnrx':
                    string = chr(int(letter))
                    break;
    </code>

C, G, N, R, and X are the green letters in the magnet set we have, so my classifications are now narrowed to that range. If my classification failed to fall under one of those options, I attempt the next closest result in the 'neighbors' list (created by the initial classification attempt)
This conditional is repeated for each of the colors and their respective contour objects (With a contour's color being determined by the hue at it's center of mass).

This change improved my output so drastically that I could hardly believe it:

![The amount of joy in pure unadulterated squealing that I emitted when my computer outputted "CAT" was probably more than I should admit to](http://i.imgur.com/QCiTlkq.png "The amount of joy in pure unadulterated squealing that I emitted when my computer outputted "CAT" was probably more than I should admit to")

I ran the script on my laptop for a week, and the results (with varying success rates) can be seen here: <a href="https://twitter.com/ApartmentFridge" target="_blank">@ApartmentFridge on Twitter</a>

Many tweaks were made in this week. Primarily adding a maximum whitespace:character ratio to cut back on gibberish posting (while people stood in front of the fridge), as well as detection for when the lights were turned out at night (After tweeting 8 straight hours of jumble puzzles the first night running).

Unfortunately, the largest obstacle in this entire project was one that I never would have predicted:

Logitech.

My intention was to leave this script running permanently on the server in our kitchen.
This was evidently a foolish plan. Neither of the two webcams at my disposal have supported drivers on the Windows Server platform. Logitech released a statement announcing their lack of intention to support Windows Server 2003. (I attempted to relocate this article for this post, but this <a href="http://forums.logitech.com/t5/Webcams/Which-Logitech-Webcam-runs-an-Windows-Server-2003/td-p/320761" target="_blank">unofficial response</a> is the best I can do.)

I simply could not figure out a way to get the cameras functional on the existing server. And, needing my laptop back after a solid week of getting absolutely nowhere, I am ashamed to say that the machines won. I ceased my attempts and returned to my regularly scheduled school assignments.

Some may call this quitting.
And I would be one of those people.

But who knows? Maybe I just helped stave off the machine revolution for a tiny bit longer...

!["Oh!  That?  Yeah that was me.  Speaking of which do you know where the knife block went?"](http://i.imgur.com/a2Qtjek.png ""Oh!  That?  Yeah that was me.  Speaking of which do you know where the knife block went?"")

<span style="font-size:9pt;">\*For the sake of brevity, I neglected to mention that I also wrote a training program to provide the classifier's initial data associations. Basically the trainer script takes the image, performs the image manipulations that I outlined above to get the contour objects, and then walks me through shape by shape, letting me enter the correct character. (Supervised learning)</span>

<span style="font-size:9pt;">\*\*I plan on putting the full script for both training and recognition on Github. The code is incredibly useless for anyone not using my apartment kitchen, since most is just hardcoded values tuned to the environment and camera angle, but it could be handy for reference I suppose.</span>
