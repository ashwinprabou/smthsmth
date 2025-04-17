from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow React -> Flask

# In‑memory storage
blocks = []
_next_id = 1

@app.route('/blocks', methods=['GET'])
def list_blocks():
    return jsonify(blocks)

@app.route('/blocks', methods=['POST'])
def create_block():
    global _next_id
    data = request.json
    block = {
        'id': _next_id,
        'type': data.get('type'),
        'content': data.get('content')
    }
    blocks.append(block)
    _next_id += 1
    return jsonify(block), 201

@app.route('/generate', methods=['POST'])
def generate_resume():
    data = request.json
    title = data.get('jobTitle', '')
    desc  = data.get('jobDescription', '')
    corpus = (title + ' ' + desc).lower().split()

    # Simple “relevance” by keyword overlap
    def score(b):
        words = set(b['content'].lower().split())
        return len(words & set(corpus))

    scored = sorted([(score(b), b) for b in blocks], key=lambda x: x[0], reverse=True)
    relevant = [b for s, b in scored if s > 0]
    # if none match, show top 5
    if not relevant:
        relevant = [b for _, b in scored[:5]]
    return jsonify(relevant)

if __name__ == '__main__':
    app.run(debug=True)
