# Digital Consent Management with Multichain

This project demonstrates a robust digital consent management system using a React frontend, a Python (Flask) backend, a Solid Pod for personal data storage, and a Multichain blockchain for immutable logging.

## System Architecture

The system is composed of four main components that interact to create a secure and transparent consent flow:

1.  **Consent Bank Connect (Frontend)**: A React application built with Vite that provides the user interface for selecting services and initiating the consent process.
2.  **Solid Pod (External)**: An external personal data store where the user manages their own data and provides or denies consent for its use.
3.  **Logging API (Backend)**: A Flask server (`app.py`) that receives logging events from the frontend.
4.  **Multichain (Backend)**: A private blockchain (`multichaind`) that stores immutable, auditable logs of all consent events.

### Workflow Diagram

```mermaid
graph TD;
    subgraph User Interaction
        User[<br/><b>User</b><br/>Interacts with the application]
    end

    subgraph Frontend - React App
        direction LR
        WebApp["<br/><b>Consent Bank Connect</b><br/>(React/Vite Frontend)<br/><i>consent-bank-connect/</i>"]
    end

    subgraph Backend Services
        direction LR
        APIServer["<br/><b>Logging API</b><br/>(Flask Backend)<br/><i>app.py</i>"]
        Multichain["<br/><b>Multichain</b><br/>(Blockchain Service)<br/><i>multichaind</i>"]
    end
    
    subgraph External Services
        direction LR
        SolidPod["<br/><b>Solid Pod</b><br/>(Personal Data Store)"]
    end

    User -- "1. Selects Financial Service" --> WebApp;
    WebApp -- "2. Authenticates User" --> WebApp;
    WebApp -- "3. Redirects to Solid Pod" --> SolidPod;
    SolidPod -- "4. User Grants/Denies Consent" --> User;
    User -- "5. Shares Consent Decision" --> SolidPod;
    SolidPod -- "6. Redirects Back with Decision" --> WebApp;
    WebApp -- "7. Logs Consent Event" --> APIServer;
    APIServer -- "8. Publishes Log to Stream" --> Multichain;

    classDef default fill:#f9f9f9,stroke:#333,stroke-width:2px,color:#333;
    classDef user fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
    classDef frontend fill:#ecfccb,stroke:#4d7c0f,stroke-width:2px;
    classDef backend fill:#fef3c7,stroke:#d97706,stroke-width:2px;
    classDef external fill:#fce7f3,stroke:#be185d,stroke-width:2px;

    class User user;
    class WebApp frontend;
    class APIServer,Multichain backend;
    class SolidPod external;
```

## Technologies Used

-   **Frontend**: React, Vite, TypeScript, shadcn-ui, Tailwind CSS
-   **Backend**: Python, Flask, Multichain
-   **Data Store**: Solid Pod

## How to Run the System

To run the complete system, you need to start the three main components in order: Multichain, the Logging API, and the Frontend Application.

### 1. Start the Multichain Service

First, start the multichain daemon for the `logschain`.

```bash
multichaind logschain -daemon
```

### 2. Start the Logging API

The backend is a Flask application that requires a Python virtual environment.

```bash
# Activate the virtual environment
source venv/bin/activate

# Start the Flask server
python app.py
```

The API will run on `http://localhost:5000`.

### 3. Start the Frontend Application

The frontend is a React application managed with npm.

```bash
# Navigate to the frontend directory
cd consent-bank-connect

# Install dependencies (if you haven't already)
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port if 5173 is in use).

### 4. Initialize the Blockchain Stream (One-Time Setup)

If this is the first time you are running the application, you need to initialize the multichain stream and grant permissions.

```bash
# In a new terminal, activate the virtual environment
source venv/bin/activate

# Get the wallet address
ADDRESS=$(multichain-cli logschain listaddresses | jq -r '.[0].address')

# Grant admin permissions to the address
multichain-cli logschain grant $ADDRESS admin

# Run the init-chain command
flask --app app init-chain
```

You are now ready to use the application! 