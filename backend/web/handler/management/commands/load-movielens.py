from sys import stderr, stdout
from handler.models import Movies, Genre, Links
import csv

from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Choose a movieset to load into database'
    def add_arguments(self, parser):
        # Positional arguments
        parser.add_argument('dataset',
                            choices=['1m', '25m', 'small'],
                            type=str,
                            )

    def handle(self, *args, **options):
        if options["dataset"] == "1m":
            path = '/data/ml-latest-small/movies.csv'
            links_path = '/data/ml-latest-small/links.csv'
    
        elif options["dataset"] == "25m":
            path = '/data/ml-25m/movies.csv'
            links_path = '/data/ml-25m/links.csv'
            
        elif options["dataset"] == "small":
            path = '/data/ml-latest-small/movies.csv'
            links_path = '/data/ml-latest-small/links.csv'
        try: 
            # Add Movies
            with open(path) as f:
                reader = csv.reader(f)
                next(reader, None)
                i = 0
                for row in reader:
                    # This must match target Model:
                    moviecreated = Movies.objects.get_or_create(
                        movieId = row[0],
                        title = row[1]
                    ),

                    # Feedback on process
                    i += 1
                    if i % 1000 == 0:
                        stdout.write(self.style.SUCCESS(f'!! added {row[1]} {i}th Movies \n'))
        except Exception as e:
            self.stdout.write(self.style.ERROR('ERROR: \n' + e))
        
        try:
            # Add Genres
            with open(path) as f:
                reader = csv.reader(f)
                next(reader, None)
                i = 0 
                for row in reader:
                    l = row[2].split('|')
                    for g in l:
                        # Again this must match target Model
                        movie = Movies.objects.get(movieId=row[0])
                        genrecreated = Genre.objects.get_or_create(
                            name = g
                            )
                        # Many - Many relationship
                        genre = Genre.objects.get(name=g)
                        genre.movies.add(movie)

                        # Feedback in process
                        i += 1
                        if i % 1000 == 0:
                            stdout.write(self.style.SUCCESS(f'!! Linked {row[1]} to {g}. - {i}th link \n'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(str(e)))
        # Add Links    
        # data paths for links we excpect the command to recieve:
        
        with open(links_path) as f:
            reader = csv.reader(f)
            next(reader, None)
            for row in reader:
                try:
                    _, created = Links.objects.get_or_create(
                            movie = Movies.objects.get(movieId=row[0]),
                            movieId = row[0],
                            imdbId = row[1],
                            tmdbId = row[2],
                    )
                except:
                    stdout.write(self.style.WARNING(f'!! Movie: {row[0]}, failed to create Link\n'))


