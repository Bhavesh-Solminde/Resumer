# Resume Optimization Flow Sequence Diagram

This diagram illustrates the workflow for Resume Analysis and subsequent Optimization (General & JD-Specific), highlighting how the system handles cases with and without re-uploading the file.

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend API
    participant DB as MongoDB
    participant AI as Gemini AI
    participant Cloud as Cloudinary

    %% ==========================================
    %% 1. INITIAL ANALYSIS (The Foundation)
    %% ==========================================
    rect rgb(230, 240, 255)
    note right of User: 1. User Uploads & Analyzes Resume
    User->>FE: Uploads Resume (PDF)
    FE->>BE: POST /api/v1/resume/analyze (file)

    par Parallel Processing
        BE->>Cloud: Upload PDF
        Cloud-->>BE: Return Secure URL
    and
        BE->>BE: Parse PDF -> Extract `resumeText`
        BE->>AI: Analyze (Score, Skills, Feedback)
        AI-->>BE: Return JSON Analysis
    end

    BE->>DB: Save ResumeScan (pdfUrl, resumeText, analysisResult)
    DB-->>BE: Acknowledge
    BE-->>FE: Return Analysis Results
    FE-->>User: Show Score & Feedback
    end

    %% ==========================================
    %% 2. GENERAL OPTIMIZATION (Analyze -> Optimize)
    %% ==========================================
    rect rgb(230, 255, 230)
    note right of User: 2. User clicks "General Optimize" (No Re-upload)
    User->>FE: Click "Optimize Resume"
    FE->>BE: POST /api/v1/resume/general (No file)

    BE->>BE: Check for File? (No)
    BE->>DB: Find Latest Scan (User ID)
    DB-->>BE: Return { resumeText, pdfUrl, originalName }

    alt No Resume Found
        BE-->>FE: Error 404 "Please upload first"
    else Resume Found
        BE->>AI: Optimize Prompt (General + resumeText)
        AI-->>BE: Return JSON { before/after, red/green }

        BE->>DB: Auto-save Snapshot (Copy pdfUrl, New AI Result)
        DB-->>BE: Acknowledge
        BE-->>FE: Return Optimization Data
        FE-->>User: Show Red/Green Comparison
    end
    end

    %% ==========================================
    %% 3. JD OPTIMIZATION (Analyze -> Optimize for Job)
    %% ==========================================
    rect rgb(255, 245, 230)
    note right of User: 3. User provides JD & Optimizes (No Re-upload)
    User->>FE: Paste Job Description + Click "Optimize for JD"
    FE->>BE: POST /api/v1/resume/jd (body: { jobDescription })

    BE->>BE: Check for File? (No)
    BE->>DB: Find Latest Scan (User ID)
    DB-->>BE: Return { resumeText, pdfUrl }

    BE->>AI: Optimize Prompt (JD + resumeText + JobDescription)
    AI-->>BE: Return JSON { missing_keywords, tailored_content }

    BE->>DB: Auto-save Snapshot (Copy pdfUrl, New AI Result)
    DB-->>BE: Acknowledge
    BE-->>FE: Return JD Optimization Data
    FE-->>User: Show Tailored Suggestions
    end

    %% ==========================================
    %% 4. DIRECT UPLOAD OPTIMIZATION (Skip Analysis)
    %% ==========================================
    rect rgb(240, 240, 240)
    note right of User: 4. User Uploads New File directly to Optimize
    User->>FE: Uploads NEW Resume -> Click Optimize
    FE->>BE: POST /api/v1/resume/general (file)

    BE->>Cloud: Upload New PDF
    BE->>BE: Parse New PDF -> Extract `resumeText`
    BE->>AI: Optimize Prompt
    AI-->>BE: Return Result

    BE->>DB: Auto-save Snapshot (New pdfUrl, New Result)
    BE-->>FE: Return Result
    end
```
