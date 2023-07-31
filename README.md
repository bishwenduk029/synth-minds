<p align="center">
  <img src="https://wqttbosbkuefkspmaqfa.supabase.co/storage/v1/object/public/ava/synth_sage.gif?t=2023-07-29T18%3A28%3A35.938Z" alt="FM">
</p>

# Synth-Minds

## Problem
* Lack of Personalization in Conventional E-learning Platforms:
Conventional e-learning platforms often deliver standardized content to a wide range of learners without considering their individual needs, preferences, and learning styles. This one-size-fits-all approach may not effectively engage learners or address their specific knowledge gaps. Personalized learning experiences have been found to enhance learner engagement, motivation, and knowledge retention.

* Struggles with Information Retention and Practical Application:
Several studies have indicated that learners often face challenges in retaining the information they have learned through passive learning methods, such as reading or watching videos without active engagement. The lack of interactive components and hands-on experiences in traditional e-learning can limit learners' ability to apply their knowledge to real-life scenarios effectively.

## Build interactive bots backed by knowledge

Welcome to Synth-Minds, a platform for building interactive knowledge bots! With Synth-Minds, you can create your own intelligent bots by uploading various forms of content such as PDFs, TXT files, or videos. These bots are designed to be a valuable resource for anyone seeking to understand a particular topic or subject matter.

### How it Works

1. **Create Your Bot:**
   Chat with Synthia to start creating your bots. She will guide you on uploading your content in PDF, TXT, or video format. Our sophisticated AI engine will analyze and process the information to build a knowledge base for your bot.

2. **Interactive Learning:**
   Once your bot is created, you can interact with it just like you would with a human expert. Ask questions, seek explanations, and engage in dynamic conversations to deepen your understanding of the subject.

3. **Share and Collaborate:**
   Love the knowledge bot you've created? Share it with others! Collaborate with friends, colleagues, or students to foster a community of learners around your bot's expertise.

### Features

- **Personalized Learning:** Synth-Minds bots adapt to your learning style and pace, providing a personalized educational experience.

- **Knowledge Expansion:** The more content you upload, the smarter your bot becomes, making it an ever-evolving source of knowledge.

- **User-Friendly Interface:** Our intuitive interface makes it easy for anyone, even without technical expertise, to create and interact with bots.

- **Accessibility:** Engage with your knowledge bot anytime, anywhere, from any device with an internet connection.

- **Security and Privacy:** Your uploaded content is handled with utmost confidentiality, ensuring the security and privacy of your data.

### Use Cases

- **Educational Institutions:** Teachers can create bots to assist students in understanding complex topics and enhance classroom learning.

- **Research and Study Groups:** Collaborate with peers to build comprehensive knowledge bots for research or study purposes.

- **Professional Development:** Empower employees to access on-demand training and information related to their fields.

- **Personal Learning:** Fuel your passion for learning by creating bots on subjects of interest to you.

Join Synth-Minds today and revolutionize the way you acquire knowledge. Build interactive bots that share expertise and inspire learning across the globe. Let's make knowledge accessible to everyone, everywhere.

## Technology Stack
- Backend
  - Text To Speech (ElevenLabs.io)
  - FastAPI
  - Python
  - LangChain Agents
  - Llama_Index
  - Supabase
  - Speech To Text (Whisper)
- Frontend
  - ReactJs
  - Chakra-UI
  - ViteJs for build system
  - Voice Activity Detector [Silero](https://github.com/snakers4/silero-vad) using [ONNX Runtime](https://github.com/microsoft/onnxruntime/tree/main/js/web)
- Deployment
  - Backend deployed with Railway.app as docker container
  - Frontend deployed with Vercels as create-react-app

## Run it Locally  
1. Clone the repo
```bash
git clone github.com/bishwenduk029/synth-minds.git
```
2. Change directory to AIUI
```bash
cd synth-minds
```
3. Build Docker image
```bash
docker build -t synth-minds .
``` 
or if on arm64 architecture (including Apple Silicon): 
```bash
docker buildx build --platform linux/arm64 -t synth-minds .
```
4. Create Docker container from image
```bash
docker run -d -e OPENAI_API_KEY=<YOUR_API_KEY> -p 8000:80 synth-minds
```
5. Navigate to `localhost:8000` in a modern browser

## Demo
