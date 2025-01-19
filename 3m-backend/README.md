
# 1. Create post
```
curl -X POST "http://127.0.0.1:8000/posts" -H "Content-Type: application/json" -d '{
    "title": "Go big or go home",
    "content": "This is the content of the 3M project.",
    "author": "Sako"
}'

curl -X GET "http://127.0.0.1:8000/posts/1"

curl -X PUT "http://127.0.0.1:8000/posts/1" -H "Content-Type: application/json" -d '{
    "title": "Updated Post Title",
    "content": "Updated content.",
    "author": "Author1"
}'

curl -X DELETE "http://127.0.0.1:8000/posts/1"
```

# 2. Create note
```
curl -X POST "http://127.0.0.1:8000/notes" -H "Content-Type: application/json" -d '{
    "noteId": "n1",
    "noteAuthorParticipantId": "author1",
    "createdAtMillis": 1672502400000
}'

curl -X GET "http://127.0.0.1:8000/notes/1"

curl -X PUT "http://127.0.0.1:8000/notes/1" -H "Content-Type: application/json" -d '{
    "noteId": "n1",
    "noteAuthorParticipantId": "author1",
    "createdAtMillis": 1672502400000,
    "classification": "misleading"
}'

curl -X DELETE "http://127.0.0.1:8000/notes/1"

```

3. Create ratings:
```
curl -X POST "http://127.0.0.1:8000/ratings" -H "Content-Type: application/json" -d '{
    "participantId": "p1",
    "enrollmentState": "newUser",
    "successfulRatingNeededToEarnIn": 10,
    "timestampOfLastStateChange": 1672502400000,
    "modelingPopulation": "CORE"
}'

curl -X GET "http://127.0.0.1:8000/ratings/1"

curl -X PUT "http://127.0.0.1:8000/ratings/1" -H "Content-Type: application/json" -d '{
    "participantId": "p1",
    "enrollmentState": "earnedIn",
    "successfulRatingNeededToEarnIn": 5,
    "timestampOfLastStateChange": 1672502400000,
    "modelingPopulation": "EXPANSION"
}'

curl -X DELETE "http://127.0.0.1:8000/ratings/1"
```

4. Create note reviews:
```
curl -X POST "http://127.0.0.1:8000/notes-reviews" -H "Content-Type: application/json" -d '{
    "noteId": "n1",
    "reviewComment": "This is a helpful note.",
    "reviewerId": "reviewer1",
    "timestamp": 1672502400000
}'

curl -X GET "http://127.0.0.1:8000/notes-reviews/1"

curl -X PUT "http://127.0.0.1:8000/notes-reviews/1" -H "Content-Type: application/json" -d '{
    "noteId": "n1",
    "reviewComment": "Updated review comment.",
    "reviewerId": "reviewer1",
    "timestamp": 1672502400000
}'

curl -X DELETE "http://127.0.0.1:8000/notes-reviews/1"
```

5. Create CommunityNotes Personas:
```
curl -X POST "http://127.0.0.1:8000/personas" -H "Content-Type: application/json" -d '{
    "participantId": "p2",
    "name": "The Scientist",
    "role": "Seeks empirical evidence and relies on scientific methods. Values objectivity and peer-reviewed research. May struggle with information outside their domain of expertise."
}'

curl -X GET "http://127.0.0.1:8000/personas/1"

curl -X PUT "http://127.0.0.1:8000/personas/1" -H "Content-Type: application/json" -d '{
    "participantId": "p1",
    "name": "Jane Doe",
    "role": "reviewer"
}'

curl -X DELETE "http://127.0.0.1:8000/personas/1"
```

