# FastAPI Content Analysis Application

## Overview
This project is a FastAPI-based application that integrates Google Gemini's generative AI model to create and manage content, notes, reviews, and ratings. It features dynamic persona-based analysis and content generation, making it a versatile tool for diverse content evaluation and management tasks.

## Features
- **Content Creation**: Create posts and generate AI-driven notes and reviews.
- **Persona-Driven Analysis**: Use predefined personas like "The Skeptic" to analyze and review content from unique perspectives.
- **Generative AI Integration**: Powered by Google Gemini 1.5 Flash for high-quality content generation.
- **Dynamic Note and Review Management**: Generate notes and their respective reviews dynamically.
- **Rating System**: Calculate cumulative scores for notes based on reviews and sort them by credibility.

## Installation

### Prerequisites
- Python 3.11 or later
- pip package manager
- Google Gemini API key
- Virtual environment (optional but recommended)

### Steps
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```
2. Create and activate a virtual environment (optional):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your environment variables:
   - Create a `.env` file and add your Google Gemini API key:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```

## Usage

### Run the Application
1. Start the FastAPI server:
   ```bash
   uvicorn app:app --reload
   ```
2. Access the API documentation at `http://127.0.0.1:8000/docs`.

### Example Endpoints

#### Create a Post
- **Endpoint**: `/posts`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "title": "Sample Post",
    "content": "Exploring the benefits of AI in content creation.",
    "author": "John Doe"
  }
  ```
- **Response**:
  Returns the post, generated notes, and reviews.

#### Generate Content
- **Endpoint**: `/generate/content`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "prompt": "Explain the importance of AI in modern technology."
  }
  ```
- **Response**:
  ```json
  {
    "text": "AI has revolutionized technology by enabling automation and enhanced decision-making."
  }
  ```

#### Add Ratings
- **Endpoint**: `/ratings`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "participantId": "participant_1",
    "noteId": "note-1",
    "score": 1
  }
  ```
- **Response**:
  Returns sorted notes based on scores.

## Development

### Project Structure
```
.
├── app.py                  # Main FastAPI application
├── .env                    # Environment variables
├── requirements.txt        # Python dependencies
├── README.md               # Project documentation
```

### Testing
Run tests using `pytest`:
```bash
pytest
```

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes and push:
   ```bash
   git commit -m "Add your feature description"
   git push origin feature/your-feature-name
   ```
4. Open a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

## Credits
Special thanks to Google Gemini for their exceptional generative AI model.
