'''from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
import os
import dotenv

app = Flask(__name__)
dotenv.load_dotenv()

# Configuração para o upload de arquivos
UPLOAD_FOLDER = 'uploads'  # Caminho relativo para o diretório de uploads
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'docx'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Certifique-se de que o diretório de uploads existe
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Função para processar o documento
def process_document(file_path):
    # Carregar o documento
    raw_documents = TextLoader(file_path).load()

    # Dividir o documento em segmentos
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=20, length_function=len)
    documents = text_splitter.split_documents(raw_documents)

    # Criar embeddings
    embeddings_model = OpenAIEmbeddings()
    db = FAISS.from_documents(documents, embeddings_model)

    # Criar retriever
    retriever = db.as_retriever()

    # Configurar a cadeia de recuperação conversacional
    llm_src = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
    retrieval_qa = ConversationalRetrievalChain.from_llm(
        
        llm_src,
        retriever,
        return_source_documents=True
    )
    # Após a linha: retrieval_qa = ConversationalRetrievalChain.from_llm(...)
    print("Segmentos processados:", documents)  # Log para diagnóstico


    return retrieval_qa

@app.route('/process-document', methods=['POST'])
def process_document_endpoint():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        process_document(file_path)
        segmentos = [doc.page_content for doc in processed_document]
        return jsonify({'message': 'Documento processado com sucesso', 'segmentos': segmentos})
    else:
        return jsonify({'error': 'File type not allowed'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)'''