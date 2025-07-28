from flask import Flask, request, jsonify
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
import os

# Setup
import os

from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)

# Load FAISS index
embedding = OpenAIEmbeddings()
faiss_db = FAISS.load_local("dc_faiss_index", embedding)
retriever = faiss_db.as_retriever()

# Create prompt
prompt_template = PromptTemplate.from_template(
    """
You are a helpful and enthusiastic DC Comics librarian.
Answer the user's comic-related question using the following context:

{context}

User: {question}
Librarian:
"""
)

# RAG chain
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model_name="gpt-3.5-turbo"),
    retriever=retriever,
    chain_type="stuff",
    chain_type_kwargs={"prompt": prompt_template}
)

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    query = data.get("question")
    if not query:
        return jsonify({"error": "Missing question"}), 400

    try:
        answer = qa_chain.run(query)
        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
