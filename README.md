# [WordStorage.com](https://www.wordstorage.com/)

## Project Overview
WordStorage.com is a language learning platform that allows users to learn any language of their choice. The user's personal space on the website is comprised of three main components:

1. **Word Storage:** Allows users to save words they want to remember, along with a sentence and an image.
2. **Word Playback:** Filters words using a dedicated player that reads the words and sentences. The player supports 149 languages.
3. **Word Quiz:** A quiz feature to test the user's knowledge of the stored words.

## Technologies Embedded in the Project

Technologies embedded in the project include:

- **Text to Speech:** Microsoft
- **Translation:** Google Translate
- **Chatbot:** OpenAI - ChatGPT
- **Payment Processing:** PayPal
- *and more...*

## Server Architecture

The project is built on a client-server architecture with a total of 7 servers in the backend and client-side.

1. **Main Server (Server 1):**
   - Exposed to the Internet.
   - Manages all client requests, organizing and directing them to the appropriate server.

2. **Database Server (Server 2):**
   - This server connects to a MySQL database.
   - Includes models representing database tables, business logic, and controllers exposing APIs.

3. **Photos Server (Server 3):**
   - Manages all site images, organizing them in user-specific directories and exposing them externally.

4. **Audio Server (Server 4):**
   - Manages all audio files on the site.
   - Generates audio files on demand by connecting to the Microsoft "text-to-speech" server.

5. **Authentication Server (Server 5):**
   - Verifies user identity and handles all actions related to accessing the personal area, such as registration, login, and password reset.

6. **Email Server (Server 6):**
   - Sends emails to the site administrator or users as needed.
   - Utilizes a Gmail server for sending emails.

7. **Payments Server (Server 7):**
   - Handles payment transactions for site usage and controls access to the site.
   - Connected to the PayPal server for payment processing.

8. **Translation Server (Server 8):**
   - Translates between any languages.
   - Connected to Google's translation server.

9. **WordToSentence Server (Server 9):**
   - Takes a word as input and generates a sentence mentioning the word using artificial intelligence.
   - Connected to OpenAI's ChatGPT server.

## Code Availability
The publicly available code is partial and intended solely for demonstration purposes.
