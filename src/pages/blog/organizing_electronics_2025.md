---
title: "organizing electronic components: binders & stuffdb"
author: "zen gunawardhana"
tags: ["wip", "electronics", "software", "script"]
description: "Learn the most efficient way to organize your stuff and fix the never-ending struggle of finding an important component."
thumbnail_url: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
last_updated: "2025-04-24"
id: "e25199ca-5943-40e7-8ed1-91d7c4c91849"
---

### Intro

If you're an electronics nerd like me, your work area is probably a colossal mess or the plastic organizers are confusing and bulky. Wouldn't it make our projects and lives easier if we knew where everything was with one search? Well, I think I've created something with my less than professional programming skills that can help. I also took some inspiration from [Asyss Complex](https://youtube.com/@asyss_complex?si=2Oy9j167Tf1fdYpH) for the physical storage solution.

### Physical organization

I had to figure out where we can physically organize our stuff in the most space efficient way. For tiny items, I'm using a binder. Inside are bags attached to dividers with velcro strips. This makes it easy to take things in and out. It's also more space efficient than using plastic organizers. The next step seems obvious: put fancy labels on these bags, like in the video where I found this idea. I will never do that, though. It's a waste of my time because by cataloguing my items on my website, they're only a simple search away. I store the location of each component in StuffDB with the `location` column. I start with a number determining the storage medium (in this case, the binder is container #1). Then I use the page number as a letter, and the position in the page as a number (reading left to right, then top to bottom). How do I store medium-sized items though? I put them in a larger plastic drawer-based organizer, and catalogue them in StuffDB. For this, it seems natural to just use labels and forget the online solution. You have to remember - StuffDB can give you a lot more detail than a paper label, help you determine whether it's in the medium or small category, and tell you how much of the thing you have. I like to ditch all the work that comes with any sort of paper labeling. Lastly, everyone is going to have some larger items. I don't think these fit in well with StuffDB's structure, since there's no easy way to store their location, and there will probably be only one or two of each item. I just use boxes like any normal person. [Let me know](/contact) if you have any ideas for a better method!

### StuffDB

Anyways - this is StuffDB, the most creatively named database frontend ever. All it really does right now is integrate a database with a search provider. The best part though? All the cloud services it uses are completely free, and the code I wrote is open source. For each type of thing you organize, you create a new table with different parameters. I recommend starting with `quantity`, `location`, and `name`. Then you can add specific parameters (for example, capacitance value for capacitors). Finally, you can use filters to search your whole collection or just a specific category.

### Use it yourself

You can find this project on [my github](https://github.com/zentag/stuffdb)! There are setup instructions and I'm working on a video guide. I would love for you to use it or contribute code!
