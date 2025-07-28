from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
import os

# Load and split the parsed comic data
with open("parsed_comics.txt", "r", encoding="utf-8") as f:
    raw_text = f.read()

chunks = raw_text.split("\n\n---\n\n")

# Wrap each chunk in a LangChain Document
documents = [Document(page_content=chunk) for chunk in chunks if chunk.strip()]

# Optional: Split long documents into smaller parts
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
split_docs = splitter.split_documents(documents)

# Embed with OpenAI and store in FAISS
embedding = OpenAIEmbeddings()
faiss_index = FAISS.from_documents(split_docs, embedding)

# Save to disk
faiss_index.save_local("dc_faiss_index")
print(f"✅ Embedded {len(split_docs)} chunks and saved to 'dc_faiss_index/'")
