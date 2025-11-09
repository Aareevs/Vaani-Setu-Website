# Gemini API Integration

This document outlines the integration of the Gemini API within the Vaani Setu project, specifically for the chatbot functionality.

## Configuration

The Gemini API key is managed through an environment variable:

*   `VITE_GEMINI_API_KEY`: This variable must be set in your environment file (`.env`) for the application to connect to the Gemini API.

## API Model

The project utilizes the `gemini-1.5-flash` model from Google's Generative AI. This model is known for its speed and efficiency, making it suitable for real-time chatbot interactions.

## Core Functionality

The primary function for interacting with the Gemini API is `getGeminiResponse`.

*   **`getGeminiResponse(prompt: string)`**: This asynchronous function takes a string prompt as input, sends it to the Gemini API, and returns the generated text response.

## Error Handling

The integration includes robust error handling to manage various potential issues:

*   **Network Errors:** If there's a problem with the internet connection.
*   **API Key Errors:** If the API key is invalid or missing.
*   **Quota Exceeded:** If the daily API usage limit is reached.
*   **Permission Denied:** If the API key lacks the necessary permissions.
*   **General AI Errors:** For any other issues that may occur during the API call.