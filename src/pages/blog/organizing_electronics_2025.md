---
title: "organizing electronic components: binders & stuffdb"
author: "zen gunawardhana"
tags: ["wip", "electronics", "software", "script"]
description: "Learn the most efficient way to organize your stuff and fix the never-ending struggle of finding an important component."
thumbnail_url: "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
last_updated: "2025-04-24"
---

# This is a WIP

### Intro

If you've an electronics nerd like me, your work area is probably a colossal mess or the plastic organizers are confusing and bulky. Wouldn't it make our projects and lives easier if we knew where everything was with one search? Well, I think I've created something with my less than professional programming skills that can help. I also took some inspiration from [Asyss Complex](https://youtube.com/@asyss_complex?si=2Oy9j167Tf1fdYpH) for the physical storage solution.

### StuffDB

This is StuffDB, the most creatively named database frontend ever. All it really does right now is integrate a database with a search provider. The best part though? All the services it uses are completely free, and the code I wrote is open source. For each type of thing you organize, you create a new table with different parameters. I recommend starting with `quantity`, `location`, and `name`. Then you can add specific parameters (for example, capacitance value for capacitors). Finally, you can use filters to organize your whole collection.

### Physical organization

Finally, we have to figure out where we can physically organize our stuff in the most space efficient way. For tiny items, I'm using a binder. Inside are bags attached to dividers with velcro strips. This makes it easy to take things in and out. It's also more space efficient than using plastic organizers. I store the location of each component in StuffDB with the location column. I start with a number determining the storage medium (in this case, the binder is container #1). Then I use the page number as a letter, and the position in the page as a number (reading left to right, then top to bottom).
