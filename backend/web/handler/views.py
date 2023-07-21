from handler.models import ( 
    Submission, Movies, Recommendations, UserRankings
)
from rest_framework import status
from rest_framework.decorators import api_view
from handler.serializers import (
    SubmissionSerializer, MovieSerializer, MovieSerializerImage,
    RecommendationSerializer, UserRankingsSerializer, UserRecommendationSerializer, AllUsersRecommendationSerializer
    )

from rest_framework import generics, pagination
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import filters

from django_filters.rest_framework import DjangoFilterBackend


from django.http import HttpResponse, JsonResponse
from django.http import Http404
from urllib.request import urlopen
import random
import json
import requests as rq
import os

TMDB_KEY = os.environ.get('TMDB_KEY')

# Pagination class
class MoviePagination(pagination.PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 20


class Submissions_list(generics.ListCreateAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

class Submissions_detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

class Movie_detail(generics.RetrieveAPIView):
    queryset = Movies.objects.all()
    serializer_class = MovieSerializer

class Movie_list(generics.ListAPIView):
    queryset = Movies.objects.all()
    serializer_class = MovieSerializer

    # set pagination
    pagination_class = MoviePagination

    # for serach
    filter_backends = [filters.SearchFilter]
    search_fields = ['^title']

class AvailableUsers(APIView):
    """We are intrested in getting all users to showcase. Due to how 
    we have set up this application, this is not based from its own user model,
    but we simply get all users that have been ingested based on recommendation and its connected
    user id. This needs improvement.

    Args:
        APIView (Object): RESTFramework object
    """
    def get_object(self):
        # in some edge cases we have several recommendations with the same model from users
        # to combat this we simply return the latest object.
        try:
            return Recommendations.objects.values('userId').distinct()
        except:
            raise Http404
            
    def get(self, request, format=None, *args, **kwargs):
        recommendation = self.get_object()
        serializer = UserRecommendationSerializer(recommendation, many=True)
        return Response(serializer.data)
        #return Response(status=status.HTTP_204_NO_CONTENT)

        
class RecommendationListForUsers(APIView):
    """This view shows all recommendations for a user. It takes a user ID and an recommendation ID 
    and queries thereafter. Its ment to provice a recommendation based on these two 
    variabes. 
    
    Args:
        APIView (Object): RESTFramework object
    """
    def get_object(self, pk):
        # in some edge cases we have several recommendations with the same model from users
        # to combat this we simply return the latest object.
        try:
            return Recommendations.objects.filter(userId=pk)
        except:
            raise Http404
        

    def get(self, request, pk, format=None, *args, **kwargs):
        """Basic GET request, gets recommendations based on userid and relevant model.

        Args:
            request (Object): request object
            pk (str): uniqe userId. 
            format (REST., optional): Defaults to None. Relevant if data is sent in a special json format.

        Returns:
            Response: Returns recommendations mathing query or 404
        """
        # pk = userId
        recommendations = self.get_object(pk)
        print(recommendations)
        # To be updated
        # data = []
        # for rec in recommendations:
        #     print(rec.userId)
        #     print({
        #         "id":rec.userId,
        #         "model":rec.recommendation_model,
        #         "movies":rec.movies,
        #            })
            
        # Serialize & Return
        serializer = AllUsersRecommendationSerializer(recommendations, many=True)
        return Response(serializer.data)
        #return Response(status=status.HTTP_204_NO_CONTENT)

    def post(self, request, format=None):
        serializer = ReccomendationSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        

class Recommendation(APIView):
    """This view shows a relevant recommendation. It takes a user ID and an recommendation ID 
    and queries thereafter. Its ment to provice a recommendation based on these two 
    variabes. 
    
    We could consider creating a view for all based on a user, and all based on a model,
    this is simply to query the database as wished.

    Args:
        APIView (Object): RESTFramework object
    """
    def get_object(self, pk, tk):
        # in some edge cases we have several recommendations with the same model from users
        # to combat this we simply return the latest object.
        if tk:
            try:
                return Recommendations.objects.filter(userId=pk, recommendation_model=str(tk))[:1].get()
            except:
                raise Http404
        else:
            # If no model is specified, get one of these
            try:
                return Recommendations.objects.filter(userId=pk)[:1].get()
            except:
                raise Http404
        

    def get(self, request, pk, format=None, *args, **kwargs):
        """Basic GET request, gets recommendations based on userid and relevant model.

        Args:
            request (Object): request object
            pk (str): uniqe userId. 
            tk (str): recommenderId grabbed from pk_model in kwargs.
            format (REST., optional): Defaults to None. Relevant if data is sent in a special json format.

        Returns:
            Response: Returns recommendations mathing query or 404
        """
        # pk = userId
        # tk = recommenderId
        tk = self.kwargs.get('pk_model', None)
        recommendation = self.get_object(pk, tk)

        # used to wait for a recommendation to train, not relevant for 
        # RECSYS demo, but it does not interfere with anything so I'll leave it.
        while recommendation.recommendation_model == 'NaN':
            recommendation = self.get_object(pk)
            
        # Serialize & Return
        serializer = RecommendationSerializer(recommendation)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ReccomendationSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class Rating(APIView):
    def get_object(self, pk, tk):
        try:
            return UserRankings.objects.get(userId=pk)
        except UserRankings.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        UserRankings = self.get_object(pk)
        serializer = UserRankingsSerializer(UserRankings)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        UserRankings = self.get_object(pk)
        serializer = UserRankingsSerializer(UserRankings, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        serializer = UserRankingsSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        UserRankings = self.get_object(pk)
        UserRankings.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_recommendation(request, userid, format=None):
    userid = userid

    def create_reccommendations(userid):
        return

    def get_recommendations(userid):
        return
    return

@api_view(['GET'])
def movie_get_image(request,pk, format=None):
    i = pk
    api_url = f'https://api.themoviedb.org/3/movie/{i}?api_key={TMDB_KEY}'
    response = rq.get(api_url)
    response.json()
    
    return Response(response.json())
