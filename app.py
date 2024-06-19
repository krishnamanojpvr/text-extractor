from flask import Flask, request,render_template
import io
import pytesseract
from PIL import Image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.get('/')
def home():
    return render_template('index.html')


import io

@app.post('/upload')
def upload_file():
    if 'imgUpload' not in request.files:
        return 'No file part'
    try:
        file = request.files['imgUpload']
        image = Image.open(io.BytesIO(file.read()))
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(debug=True)