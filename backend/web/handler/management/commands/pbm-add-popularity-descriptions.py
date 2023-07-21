
from django.core.management.base import BaseCommand, CommandError
from handler.models import Recommendations, MoviesRanked
import os
import json
import requests
import random

class Command(BaseCommand):
    help = 'Caches image links for movies that has a rank or has been recommended to a user'



    def add_arguments(self, parser):
        parser.add_argument('file', 
                            type=str,
                            action='store',
                            help='path to UG file conatining popularity metrics for our user',
                            )
        
        
    def __get_user_description(self, vector):
        # cumulative_values = [sum(vector[:i+1]) for i in range(len(vector))]
        # user_type = next((i for i, val in enumerate(cumulative_values) if val > 0.5), 50)
        user_type = int(round(vector[0] * 1) + (vector[1] * 20) + (vector[1] * 30))
        film_interest_dict = {
            1: "Mostly Mainstream: This user predominantly enjoys blockbuster movies that top the box office charts. They appreciate the familiarity of popular actors and often-visited plot lines, but tend not to venture into the realm of niche or indie films.",
            2: "Mainstream with a Dash of Adventure: This user is a big fan of widely popular movies, but occasionally likes to dabble in the less well-known. They might check out a critically acclaimed indie film or a foreign flick if it comes highly recommended.",
            3: "Balanced Viewer: This user enjoys the best of both worlds. While they often go for the latest hits from Hollywood, they are also open to exploring critically acclaimed independent movies that offer something different from the mainstream.",
            4: "Mainstream-curious: This user often leans towards popular films, but finds an increasing interest in lesser-known works. Their movie choices are becoming more balanced between mainstream hits and intriguing indie films.",
            5: "Indie-curious: This user has a growing appreciation for indie and niche films, often choosing them over popular blockbusters. They value the unique perspectives these movies offer, but still appreciate a well-produced mainstream film.",
            6: "Balanced with an Indie Leaning: This user enjoys a well-balanced diet of films but tends to lean towards the indie side. They appreciate the creativity and depth found in indie films, while still keeping up with some of the bigger blockbuster releases.",
            7: "Indie Enthusiast: This user prefers the unique storylines and creative cinematography often found in indie films. While they might watch a blockbuster now and again, their true passion lies in exploring the corners of the film industry that are less often seen.",
            8: "Mostly Niche: This user is heavily into niche films. They delight in exploring a myriad of cinematic landscapes from independent studios around the globe. While they may occasionally see a big-budget film, it is more the exception than the rule.",
            9: "Niche with a Sprinkle of Mainstream: This user is devoted to indie and niche films, exploring diverse themes and unique narrative styles that often get overlooked. They may occasionally enjoy a popular movie but typically only if it has some unusual or distinctive features.",
            10: "Purely Niche: This user is an avid follower of niche films and prides themselves on their knowledge of the underground and indie movie scene. They rarely, if ever, venture into the realm of popular, mainstream movies, preferring to immerse themselves fully in the less explored and unique cinematic experiences.",
            11: "Mostly Mainstream with Rare Indie Encounters: This user gravitates toward widely popular movies, but sometimes they'll stumble upon an indie film that catches their interest, creating a small break in their mainstream preference.",
            12: "Hollywood Devotee with Indie Flirts: This user is primarily attracted to high-budget, star-studded Hollywood films, but occasionally flirts with the less trodden path of indie cinema, enjoying the refreshing contrast.",
            13: "Commercial Movie Buff with Occasional Indie Appetite: This user usually prefers the buzz of commercial movies but does develop an occasional appetite for indie films, satisfying their craving for something different.",
            14: "Blockbuster Lover with Indie Tastes: This user loves the grandeur of blockbuster movies, but sometimes indulges in the distinct tastes of indie cinema, providing a sprinkle of variety to their viewing habits.",
            15: "Mainstream Admirer with Indie Diversions: This user is an aficionado of mainstream films, yet they do allow themselves occasional diversions into the world of indie films, adding a touch of spice to their movie enjoyment.",
            16: "High-Budget Movie Fan with Indie Intrigue: This user mostly enjoys high-budget films but does find indie cinema intriguing, frequently allowing for a break in their usual movie patterns.",
            17: "Popcorn Blockbuster Admirer with Indie Excursions: This user admires the spectacle of popcorn blockbusters but occasionally enjoys the unpredictability and artistic integrity found in indie films.",
            18: "Hollywood-centric with Indie Experiments: This user's preference leans heavily towards Hollywood, but they enjoy experimenting with indie films now and then, broadening their cinematic perspective.",
            19: "Box Office Hit Seeker with Indie Ventures: This user is a seeker of box-office hits but does embark on indie ventures at times, providing a welcome change of pace.",
            20: "Mainstream Connoisseur with Indie Explorations: This user is a connoisseur of mainstream movies, yet they aren't averse to exploring the niche segments of the film industry occasionally.",
            21: "Commercial Film Enthusiast with Indie Immersions: This user is heavily into commercial films, but occasionally immerses themselves into indie movies, exploring their unique, artistic perspectives.",
            22: "Big-Screen Fan with Indie Admiration: This user is a fan of big-screen movies, yet they do admire the often-underappreciated beauty of indie films.",
            23: "Blockbuster Junkie with Indie Appreciation: This user is a blockbuster junkie, but they appreciate the depth and creativity of indie films when they choose to delve into that world.",
            24: "Popular Movie Lover with Indie Acquaintances: This user loves popular films but has some acquaintance with indie cinema, appreciating its rawness and distinct storytelling.",
            25: "Mainstream Admirer with Indie Familiarity: This user mostly admires mainstream cinema, but they are familiar with the indie scene and occasionally enjoy what it has to offer.",
            26: "Commercial Movie Follower with Indie Connections: This user typically follows commercial movies, yet they maintain a connection with the indie world, appreciating the occasional divergence from the mainstream.",
            27: "High-Grossing Film Fanatic with Indie Interests: This user is a high-grossing film fanatic but has begun to develop an interest in indie films, appreciating the balance it provides.",
            28: "Box-Office Hit Enthusiast with Indie Inclination: This user enthusiastically follows box-office hits, but an inclination towards indie films is creeping into their viewing habits.",
            29: "Mainstream Loyalist with Indie Intrigue: This user shows a strong loyalty to mainstream cinema but has a growing intrigue towards indie films, which offers them a break from their usual preferences.",
            30: "Big-Budget Movie Fan with Indie Insights: This user enjoys big-budget films, but is beginning to gain insights from the indie world, enriching their cinematic experiences.",
            31: "Blockbuster Buff with Indie Introspection: This user is a major buff for blockbuster films, but is beginning to enjoy the introspective nature of indie films.",
            32: "Popular Film Junkie with Indie Investments: This user is a junkie for popular films but is starting to invest time in exploring the indie side of cinema.",
            33: "Commercial Movie Patron with Indie Participation: This user is a frequent patron of commercial movies, but they're participating more in the indie film scene, broadening their cinematic horizons.",
            34: "Hollywood Addict with Indie Adventures: This user is addicted to Hollywood hits, but indie films have started to make their way into their repertoire, offering an adventurous diversion.",
            35: "Blockbuster Aficionado with Indie Affection: This user is an aficionado of blockbusters, but an affection for indie films is gradually blossoming.",
            36: "Mainstream Maven with Indie Motives: This user is a maven in mainstream movies, but they've recently started to explore indie films with a curious motive.",
            37: "Box Office Fan with Indie Fascination: This user is a fan of box office hits, but they've grown fascinated with the unique and creative storytelling found in indie films.",
            38: "Hollywood Junkie with Indie Journey: This user, a self-confessed Hollywood junkie, has embarked on a journey to appreciate indie films, expanding their movie viewing palate.",
            39: "Commercial Cinema Devotee with Indie Deviation: This user, a devotee of commercial cinema, is starting to deviate towards the indie scene, craving something fresh and unique.",
            40: "Blockbuster Loyalist with Indie Leaning: This user is a loyal follower of blockbuster films, but they've recently started to lean towards indie films, appreciating their unique charm.",
            41: "Mainstream Maniac with Indie Mindset: This user is a mainstream maniac but has developed a mindset that appreciates the unconventional storytelling in indie films.",
            42: "Popular Film Enthusiast with Indie Engagement: This user is an enthusiast of popular films, but they've become more engaged with the unique style and substance found in indie films.",
            43: "Hollywood Hound with Indie Hunt: This user is a Hollywood hound, but they've begun a hunt to discover hidden gems in the indie cinema.",
            44: "Box Office Buff with Indie Bond: This user is a buff for box office hits, but they're forming a strong bond with indie films, appreciating their raw and innovative essence.",
            45: "Mainstream Maven with Indie Movement: This user is a maven of mainstream films, but they've joined the indie movement, recognizing the unique perspectives these films bring to the table.",
            46: "Commercial Cinema Admirer with Indie Affinity: This user, an admirer of commercial cinema, has developed an affinity for indie films and their distinct narrative styles.",
            47: "Hollywood Fanatic with Indie Focus: This user is a fanatic of Hollywood films, but their focus has begun to shift towards indie films, appreciating their authentic and creative narratives.",
            48: "Blockbuster Buff with Indie Investment: This user is a buff for blockbusters, but they've begun to invest more and more into indie films, finding value in their unique storytelling.",
            49: "Popular Film Aficionado with Indie Attraction: This user is an aficionado of popular films, but an attraction to indie films is starting to dominate their viewing habits.",
            50: "Mainstream Maniac with Indie Infatuation: This user is a mainstream maniac, but they've developed an infatuation for indie films, reflecting their evolving taste in cinema.",
        }
        return film_interest_dict.get(user_type)
    
    
    def handle(self, *args, **options):
        try:
            with open(options['file']) as f:
                data = json.load(f)
            
            for item in data:

                user_description_long = self.__get_user_description(data[item])
                recommendations = Recommendations.objects.filter(userId=item)
                for recommendation in recommendations:
                    recommendation.user_description_long = user_description_long
                    recommendation.save()
            self.stdout.write(self.style.SUCCESS(
                            f'Successfully added long descriptions for users.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(str(e)))

        # if options['clear-cache']:
        #     ranked_movies = MoviesRanked.objects.all().delete()
        # else:
        #     TMDB_KEY = os.environ.get('TMDB_KEY')
        #     try:
        #         ranked_movies = MoviesRanked.objects.all()
        #         n = len(ranked_movies)
        #         i = 0
        #         for ranked_movie in ranked_movies:
        #             if ranked_movie.cached_img_url != "not_cached" or options['overwrite']:
        #                 self.stdout.write(f'{i}/{n} || Movie {ranked_movie.movie.title} already cached.')
        #             else:
        #                 api_url = f'https://api.themoviedb.org/3/movie/{ranked_movie.tmdbId}?api_key={TMDB_KEY}'
        #                 response = requests.get(api_url)
        #                 ranked_movie.cached_img_url = response.json()["poster_path"]
        #                 ranked_movie.save()
        #                 self.stdout.write(f'{i}/{n} || Movie {ranked_movie.movie.title}, https://image.tmdb.org/t/p/w200/{response.json()["backdrop_path"]}')

        #             i += 1
        #     except Exception as e:
        #         self.stdout.write('Something went wrong: \n' + e)