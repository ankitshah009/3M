from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

load_dotenv()

# Configure the Gemini API
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use ["http://localhost:3000"] for stricter security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Post(BaseModel):
    id: Optional[int] = None 
    title: str
    content: str
    author: str

class Note(BaseModel):
    id: Optional[int] = None
    noteId: str
    noteAuthorParticipantId: str
    createdAtMillis: int
    tweetId: Optional[str] = None
    classification: Optional[str] = None
    believable: Optional[bool] = None
    harmful: Optional[bool] = None
    validationDifficulty: Optional[str] = None
    summary: Optional[str] = None
    isMediaNote: Optional[bool] = None

class NotesReview(BaseModel):
    id: Optional[int] = None
    noteId: str
    reviewComment: str
    reviewerId: str
    timestamp: int

class Rating(BaseModel):
    id: Optional[int] = None
    participantId: str
    noteId: str
    notesReviewId: Optional[int]
    score: int  # 1 for correct, -1 for incorrect, 0 for mixed

class Participant(BaseModel):
    id: Optional[int] = None
    participantId: str
    name: str
    role: str

class GenerateContentRequest(BaseModel):
    prompt: str

# In-memory storage
posts = []
notes = []
notes_reviews = []
participants = []
ratings = []

# Personas definition
def get_personas():
    return [
        {
            "name": "The Skeptic",
            "description": "Highly critical and questions everything. Demands strong evidence and scrutinizes sources rigorously.",
        }
        # {
        #     "name": "The Scientist",
        #     "description": "Seeks empirical evidence and relies on scientific methods. Values objectivity and peer-reviewed research.",
        # },
        # {
        #     "name": "The Historian",
        #     "description": "Examines events in context and considers historical patterns. Values primary sources and diverse perspectives.",
        # },
        # {
        #     "name": "The Journalist",
        #     "description": "Focuses on accuracy and objectivity. Verifies information through multiple sources and seeks out diverse perspectives.",
        # }
        # # Add more personas as needed
    ]

personas = get_personas()

@app.post("/posts")
async def create_post(post: Post):
    post.id = len(posts) + 1
    posts.append(post)

    # Generate multiple notes using personas
    for persona in personas:
        try:
            response = model.generate_content(f"{persona['name']} analyzing: {post.content}")
            note = Note(
                noteId=f"note-{len(notes) + 1}",
                noteAuthorParticipantId=persona['name'],
                createdAtMillis=0,  # Replace with actual timestamp logic
                summary=response.text if response.text else ""
            )
            notes.append(note)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating note for persona {persona['name']}: {str(e)}")

    # Generate multiple notes reviews for the notes
    for note in notes:
        for persona in personas:
            try:
                review_response = model.generate_content(f"{persona['name']} reviewing note: {note.summary}")
                notes_review = NotesReview(
                    noteId=note.noteId,
                    reviewComment=review_response.text if review_response.candidates else "",
                    reviewerId=persona['name'],
                    timestamp=0  # Replace with actual timestamp logic
                )
                notes_reviews.append(notes_review)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error generating review for persona {persona['name']}: {str(e)}")

    return {"post": post, "notes": notes, "reviews": notes_reviews}

@app.post("/generate/content")
async def generate_content(request: GenerateContentRequest):
    try:
        response = genai.generate(
            model="gemini-1.5-flash",
            prompt=request.prompt
        )
        return {"text": response.candidates[0]['output'] if response.candidates else ""}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/posts/{post_id}")
async def read_post(post_id: int):
    for post in posts:
        if post.id == post_id:
            return post
    raise HTTPException(status_code=404, detail="Post not found")

# Ratings Endpoint
@app.post("/ratings")
async def create_rating(rating: Rating):
    # Check associated note and reviews
    note = next((n for n in notes if n.noteId == rating.noteId), None)
    reviews = [r for r in notes_reviews if r.noteId == rating.noteId]

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    # Compute rating score based on reviews
    correct_reviews = sum(1 for r in reviews if "correct" in r.reviewComment.lower())
    incorrect_reviews = sum(1 for r in reviews if "incorrect" in r.reviewComment.lower())
    somewhat_correct_reviews = sum(1 for r in reviews if "somewhat correct" in r.reviewComment.lower())

    note_score = correct_reviews - incorrect_reviews + somewhat_correct_reviews

    rating.score = note_score
    ratings.append(rating)

    # Sort notes by their scores
    sorted_notes = sorted(notes, key=lambda n: sum(
        (1 if "correct" in r.reviewComment.lower() else 0) -
        (1 if "incorrect" in r.reviewComment.lower() else 0) +
        (1 if "somewhat correct" in r.reviewComment.lower() else 0)
        for r in notes_reviews if r.noteId == n.noteId
    ), reverse=True)

    return {
        "sorted_notes": sorted_notes,
        "note": note,
        "reviews": reviews,
        "score": rating.score
    }
