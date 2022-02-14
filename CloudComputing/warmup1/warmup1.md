Step 1: Create a front page at http://yourserver/ttt/ – the page must include at least one CSS file which changes the appearance of something on the page and a POST FORM that requests and submits a field called 'name'. (The FORM ACTION should point to this page's own URL)
Step 2: If the page receives a POST parameter called "name", it should output "Hello $name, $date" with the name and date filled in dynamically. (Do not use client-side JavaScript for this part)
Step 3: Create a REST-based Tic-Tac-Toe service at http://yourserver/ttt/play that takes as input a JSON object including a 'grid' property and returns a JSON object including a 'grid' property and a 'winner' property. The 'grid' property is an array of 9 characters, each being a space (‘ '), 'X', or 'O'. The 'winner' property is a single character to indicate who won.
Step 4: Integrate the REST-based tic-tac-toe service into your front page that starts operating when the page is loaded with a 'name' specified. (Use client-side JavaScript for this part)

Note: All GET or POST request responses must also contain the header field X-CSE356 with the value containing the ID copied from the course interface.

Due Date: 15th February 2022
