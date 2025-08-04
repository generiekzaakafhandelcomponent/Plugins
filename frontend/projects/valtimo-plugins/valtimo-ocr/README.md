# Valtimo OCR Plugin

The **Valtimo OCR** plugin is a Valtimo plugin that enables the scanning of documents (images or PDFs) and extracts
text using **Mistral OCR** (Optical Character Recognition). This functionality is especially useful for applications
that require automated text extraction from scanned or uploaded documents. The extracted text is returned in **Markdown
format**, allowing for easy formatting and further processing such as indexing, searching, or automated workflows.

---

## Setup Instructions

To set up the Valtimo OCR plugin, follow these steps:

1. **Create a Mistral Account**
   Visit [Mistral](https://mistral.ai/) and create a free account. Once registered, generate and copy your **Mistral API
   key**.

2. **Access the Plugin in Valtimo**

    * Navigate to the **Frontend Plugins** section in your Valtimo application.
    * Locate the plugin named **"Valtimo OCR Plugin (autodeployed)"**.
    * Open the plugin settings and paste your **Mistral API key** into the input field.
    * Click **Save**.

3. **Using the Plugin**
   Once configured, the plugin is ready to use. Open the **"Valtimo OCR Plugin"** Case and start a new case.
   Upload a document (PDF or image) and receive the extracted text as Markdown.

---

## Configuration Notes

* **Default Behaviour:**
  In the demo process, the plugin is configured to scan **only the first page** of any uploaded document.
