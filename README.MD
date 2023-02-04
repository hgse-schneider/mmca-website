## MMCA - Multimdal Collaboration Analytics (MMCA) - A Literature Review

By Harvard Learning, Innovation, and Technology Lab (LIT)

### GitHub organization

 - master: latest stable build
 - live: currently deployed site
 ✅ - testing: General testing branch
 - Others: Individual branches for specific features, to be merged into testing

## Structure

assets folder - contain images to style the website </br>
data - contains all the json data files </br>
js folder - contains all javascript file for creating the graphs and diagrams </br>
html files - located in the project directory </br>

## Legend

❌ ❌ - Not possible </br>
❌ ✅ - Possible and will be done </br>
❌❔ - Not done but not sure if possible </br>
✅ - Done </br>
⏳ - Pending

## Improvements

- remove harvard logos, developer information, etc. Add back when the paper is accepted ✅ </br>
- Information to the subpages of the website. Create a document with instructions on how to update the dataset, redeploy the website, and modify its content? ⏳ </br>
- Main visualization at the top of the page (move the paragraph about purpose to a different subpage) ✅ </br>
- Possible to use the back button of the browser to reset the visualization? ❌ ❌ </br> 
- Google scholar links need to be added to any node in the sub-visualizations (e.g., when clicking on a connection ) ✅ </br> 
- The text from the yellow bubbles overlaps and is sometimes difficult to read; can you change the size of the bubbles so that the text doesn’t overlap? ✅ </br>
- The different line type (e.g., dotted, solid) and labels (e.g., glm, corr, etc) makes the visualization a little too busy; we feel like they should be removed ✅ </br>
- could you change the color of the yellow bubbles based on modality type? ✅ </br>
- Script for translating the csv to JSON ✅ </br>
- Documentation for convert-to-JSON script ⏳ </br>
- Keep bubbles inside overall rectangle visualization ✅ </br>

## Main TODOs

- Decrease height between detail graphs ✅
- Try to make nodes share 1 ❌ ❌ 
- Change color scheme ✅
- Make sure sankey nodes show metric ✅
- Data input ✅
- Group like sankey nodes together ✅
- Fix arrow sizes ✅
- Deployed!! https://mmca-website.netlify.app/ 🚀 ✅ 

#### Data Layer 1 
Speech Participation >> DONE ✅ </br>
Visual Attention >> DONE ✅ </br>
Task-related >> DONE ✅ </br>
Text >> DONE ✅ </br>
Touch >> DONE ✅ </br>
Eye Motion >> DONE ✅ </br>
Hand Motion >> DONE ✅ </br>
Gross body motion >> DONE ✅ </br>
Location >> DONE ✅ </br>
Facial expressions >> DONE ✅ </br>
Head motion >> DONE ✅ </br>
speech features >> DONE ✅ </br>
speech content >> DONE ✅ </br>
EDA >> DONE ✅ </br>
Combined >> DONE ✅ </br>
Heart >> DONE ✅ </br>
Brain >> DONE ✅ </br>

#### Data Layer 2
Head >> DONE ✅ </br>
Physiological >> DONE ✅ </br>
Log data >> DONE ✅ </br>
Gaze >> DONE ✅ </br>
Verbal >> DONE ✅ </br>
Body >> DONE ✅ </br>

#### Data Layer 3
affective >> DONE ✅ </br>
Cognitive Engagement >> DONE ✅ </br>
Communication >> DONE ✅ </br>
Interpersonal >> DONE ✅ </br>
Coordination >> DONE ✅ </br>
Learning >> DONE ✅ </br>
Performance >> DONE ✅ </br>
Group composition >> DONE ✅ </br>

#### Data Layer 4
Condition >> DONE ✅ </br>
Process >> DONE ✅ </br>
Product >> DONE ✅

## Technology Used

HTML/CSS, JS, D3.js

##### Developed by Eric Sheen