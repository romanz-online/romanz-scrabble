# romanz-scrabble

This is an online recreation of Scrabble, hosted on my website here: https://www.romanzinoviev.com/scrabble

I attempted to recreate Scrabble's rules as closely as possible, so there should be few to no discrepancies there. There are many other versions of Scrabble on many websites, but none of the ones I've found have been particularly well-designed and they all required some form of account to even begin playing. I found this meaningless and tedious, so I decided to make my own version which generates a username for each player automatically and stores it as a cookie so they can return to games without losing progress.

# running the website

The code in this repository may function on its own since it contains all of the code relevant to my Scrabble project, but there are many hooks in server.js left unused/unanswered because that code is shared between Scrabble and the rest of the website, so there may be unexpected behavior. In particular, there must be a postgres database connected to the server, otherwise the application will not work at all and potentially crash. All that aside, one need only install all of the dependencies listed in package.json and then run the project with "npm start"

The website will be hosted at http://localhost:8080/scrabble
