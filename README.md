## RecViz
![logo](logo-color.png)
### About
RecViz is a demonstrational tool built to receive a dataset containing a
list of user profiles and pre-generated recommendations, both original ones from a baseline recommender model and post-processed ones. The dataset is inserted as a JSON object following a predefined format. After ingesting such a dataset, the system allows to display one or multiple user profiles on-demand to visually inspect their recommendations.
The user profiles will show up in the interface together with multiple rows of recommendations, raw or post-processed.
The platform can be used by researchers, educators, software developers and architects, data scientists and analysts. The interactive interface enables the end user to modify the visualization in the following ways

- The end user can select how many and which user profiles with recommendations they would like to visualize and inspect. A dropdown menu defines the number, while drag-and-drop feature lets the end user to pick user profiles from the list of the available ones.

- If multiple RS models were used to generate multiple recommendation lists for a profile, the end user would be able to select which ones to display in the interface. This way baseline recommendations can be also compared among each other.

- In addition to recommendations any profile descriptions or features can be included to provide more information for the analysis, e.g. user demographics or specific preferences.

The tool is based on the research of <...> , who provided the recommendations and recommender system, and Developed by <...>, who provided the full stack application.

### contact: 
... To be added 

## Setup Guide for Demo:
Following is a guide on how to setup this Demo, you will need docker and docker-compose installed on your machine. If on mac, i recommend brew: 
- https://brew.sh/
- https://formulae.brew.sh/formula/docker#default
- https://formulae.brew.sh/formula/docker-compose#default

On windows i recommend installing WSL and taking it from there:
- https://learn.microsoft.com/en-us/windows/wsl/install
- https://gist.github.com/martinsam16/4492957e3bbea34046f2c8b49c3e5ac0

You'll also need a TMDB API key for this project to run, you can find information about this here:
https://developers.themoviedb.org/3/getting-started/introduction


### Data for demo:
Download the necesarry datasets into the repo to run the demonstration:
```bash
# From github root folder:

curl https://files.grouplens.org/datasets/movielens/ml-latest-small.zip --output backend/data/ml-latest-small.zip &&
unzip backend/data/ml-latest-small.zip
```
If you cannot use these terminal commands, you can manually download the dataset using the following link:
https://files.grouplens.org/datasets/movielens/ml-latest-small.zip and then unzip the folder. To add it to the project, add it into the `backend/data/...` folder so that it matches the following folder structure:

```
├── backend
│   └── data
│       └── ml-latest-small
│           ├── README.txt
│           ├── genome-scores.csv
│           ├── genome-tags.csv
│           ├── links.csv
│           ├── movies.csv
│           ├── ratings.csv
│           └── tags.csv

```

### Enviournment Variables:
In the **root** of the project, add a .env file, and add the following lines:
```bash
TMDB_KEY=''
DJANGO_SECRET_KEY=''
DJANGO_DEBUG=True
```

### Backend Cold start:
**Step 1:**
From the root of the folder, run `docker-compose up --build`

**Step 2:**
Load data into database with the following command:
Here you can choose between the arguments `small, 1m, 25m`, we used small for this demonstration:

`docker exec -it VISREC-BACKEND python3 manage.py load-movielens small`

ps: A few failed links are no problem, it happends.

**Step 3:**
For the Demo we need to populate the database with some users:
`docker exec -it VISREC-BACKEND python3 manage.py load-recommendations all_recs_and_rerank.json`

**Step 4:**
For our demonstration of the tool, we also run a domain spesific command that calculates and adds descriptions to our users. 
`docker exec -it VISREC-BACKEND python3 manage.py pbm-add-popularity-descriptions 
/data/pbm/UG_data.json`

**(Optional) Step 5:**
Create your super user:
`docker exec -it VISREC-BACKEND python3 manage.py createsuperuser`
Here just follow the prompts.

**(Optional) Step 6:**
As we are utilizing the tmdb api, calling to find the img url for each load is rather slow, so we therefore cache the src for each of the movies found in a recommendation. This is not too time consuming as we are using the small movielens dataset with ~1600 movies affected in our recommendations.

`docker exec -it VISREC-BACKEND python3 manage.py cache-recommended-movies`


**The demo is now available at 0.0.0.0**

### Running Frontend for Development
Theres already a built and compiled version of the frontend served through the docker-compose file, so you should not need to touch Node or the frontend. However if you want to make changes or poke around:

from `/frontend` folder, run `npm install`

run: `npm run dev`

have fun!



#### Acknowledgements:
We utilize TMDB API calls for all images in this DEMO and thank TMDB for issuing their API, read more about them here: https://www.themoviedb.org/about