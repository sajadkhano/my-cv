"""
Portfolio Flask Server — Sajjad Khaldoon Hano
==============================================
API Endpoints:
  GET  /api/presentations          list presentations
  POST /api/upload/presentation    upload PDF/image presentation
  DEL  /api/presentations/<id>     delete presentation
  PAT  /api/presentations/<id>     rename presentation

  GET  /api/images                 all stored image keys
  POST /api/upload/image           upload keyed image
  DEL  /api/images/<key>           delete keyed image

  GET  /api/content                get all editable text content
  POST /api/content                update one or more text keys

  GET  /api/gallery                list gallery photos
  POST /api/upload/gallery         upload gallery photo(s)
  DEL  /api/gallery/<id>           delete gallery photo

Files are served with Content-Disposition: inline (view-only, no forced download).
"""

from flask import Flask, request, jsonify, send_from_directory, abort, Response
from flask_cors import CORS
import os, json, uuid, mimetypes
from datetime import datetime
from werkzeug.utils import secure_filename

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR  = os.path.join(BASE_DIR, 'uploads')
DATA_DIR    = os.path.join(BASE_DIR, 'data')
PRES_FILE   = os.path.join(DATA_DIR, 'presentations.json')
IMGS_FILE   = os.path.join(DATA_DIR, 'images.json')
GALLERY_FILE= os.path.join(DATA_DIR, 'gallery.json')
CONTENT_FILE= os.path.join(DATA_DIR, 'content.json')
CV_FILE     = os.path.join(DATA_DIR, 'cv.json')

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(DATA_DIR,   exist_ok=True)

# ── App ────────────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, origins='*')

# ── JSON helpers ───────────────────────────────────────────────────────────────
def load_json(path, default):
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return default

def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# ── Static file serving ────────────────────────────────────────────────────────
@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/style.css')
def stylesheet():
    return send_from_directory(BASE_DIR, 'style.css')

@app.route('/app.js')
def appjs():
    return send_from_directory(BASE_DIR, 'app.js')

@app.route('/assets/<path:filename>')
def assets(filename):
    return send_from_directory(os.path.join(BASE_DIR, 'assets'), filename)

@app.route('/uploads/<path:filename>')
def serve_upload(filename):
    """Serve uploaded files as INLINE (view-only — no forced download)."""
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        abort(404)
    mime = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
    with open(filepath, 'rb') as f:
        data = f.read()
    resp = Response(data, mimetype=mime)
    resp.headers['Content-Disposition'] = 'inline'
    resp.headers['X-Content-Type-Options'] = 'nosniff'
    return resp

@app.route('/<path:filename>')
def static_catch(filename):
    safe_exts = {'.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.webp',
                 '.svg', '.ico', '.woff', '.woff2', '.ttf', '.pdf'}
    ext = os.path.splitext(filename)[1].lower()
    if ext in safe_exts:
        try:
            return send_from_directory(BASE_DIR, filename)
        except Exception:
            abort(404)
    abort(404)

# ── Presentations API ──────────────────────────────────────────────────────────
@app.route('/api/presentations', methods=['GET'])
def get_presentations():
    return jsonify(load_json(PRES_FILE, []))


@app.route('/api/upload/presentation', methods=['POST'])
def upload_presentation():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    f = request.files['file']
    if not f.filename:
        return jsonify({'error': 'Empty filename'}), 400

    ext   = os.path.splitext(secure_filename(f.filename))[1].lower()
    fname = f"pres_{uuid.uuid4().hex}{ext}"
    f.save(os.path.join(UPLOAD_DIR, fname))

    cover_url = None
    if 'cover' in request.files:
        cf = request.files['cover']
        if cf and cf.filename:
            cext  = os.path.splitext(secure_filename(cf.filename))[1].lower() or '.jpg'
            cname = f"cover_{uuid.uuid4().hex}{cext}"
            cf.save(os.path.join(UPLOAD_DIR, cname))
            cover_url = f"/uploads/{cname}"

    title = request.form.get('title') or f.filename
    mime  = f.content_type or (mimetypes.guess_type(f.filename)[0] or 'application/octet-stream')

    doc = {
        'id':         f"doc-{uuid.uuid4().hex[:12]}",
        'title':      title,
        'fileName':   f.filename,
        'fileUrl':    f"/uploads/{fname}",
        'coverUrl':   cover_url,
        'mimeType':   mime,
        'uploadedAt': datetime.now().isoformat()
    }
    presentations = load_json(PRES_FILE, [])
    presentations.append(doc)
    save_json(PRES_FILE, presentations)
    return jsonify(doc), 201


@app.route('/api/presentations/<doc_id>', methods=['DELETE'])
def delete_presentation(doc_id):
    presentations = load_json(PRES_FILE, [])
    doc = next((p for p in presentations if p['id'] == doc_id), None)
    if not doc:
        return jsonify({'error': 'Not found'}), 404
    for key in ('fileUrl', 'coverUrl'):
        url = doc.get(key)
        if url and url.startswith('/uploads/'):
            fpath = os.path.join(UPLOAD_DIR, url[len('/uploads/'):])
            if os.path.exists(fpath):
                try: os.remove(fpath)
                except OSError: pass
    save_json(PRES_FILE, [p for p in presentations if p['id'] != doc_id])
    return jsonify({'success': True})


@app.route('/api/presentations/<doc_id>', methods=['PATCH'])
def rename_presentation(doc_id):
    presentations = load_json(PRES_FILE, [])
    for p in presentations:
        if p['id'] == doc_id:
            data = request.get_json(silent=True) or {}
            if 'title' in data:
                p['title'] = data['title']
            save_json(PRES_FILE, presentations)
            return jsonify(p)
    return jsonify({'error': 'Not found'}), 404

# ── CV API ──────────────────────────────────────────────────────────────────────
@app.route('/api/cv', methods=['GET'])
def get_cv():
    return jsonify(load_json(CV_FILE, {}))


@app.route('/api/upload/cv', methods=['POST'])
def upload_cv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    f = request.files['file']
    if not f.filename:
        return jsonify({'error': 'Empty filename'}), 400

    ext   = os.path.splitext(secure_filename(f.filename))[1].lower() or '.pdf'
    fname = f"cv_{uuid.uuid4().hex[:10]}{ext}"
    f.save(os.path.join(UPLOAD_DIR, fname))

    cover_url = None
    if 'cover' in request.files:
        cf = request.files['cover']
        if cf and cf.filename:
            cext  = os.path.splitext(secure_filename(cf.filename))[1].lower() or '.jpg'
            cname = f"cv_cover_{uuid.uuid4().hex[:10]}{cext}"
            cf.save(os.path.join(UPLOAD_DIR, cname))
            cover_url = f"/uploads/{cname}"

    title = request.form.get('title') or f.filename
    mime  = f.content_type or (mimetypes.guess_type(f.filename)[0] or 'application/pdf')

    # Remove previous CV file & cover if any
    old_cv = load_json(CV_FILE, {})
    if isinstance(old_cv, dict):
        for k in ('fileUrl', 'coverUrl'):
            old_url = old_cv.get(k)
            if old_url and old_url.startswith('/uploads/'):
                old_path = os.path.join(UPLOAD_DIR, old_url[len('/uploads/'):])
                if os.path.exists(old_path):
                    try: os.remove(old_path)
                    except OSError: pass

    cv_data = {
        'id':         f"cv-{uuid.uuid4().hex[:8]}",
        'title':      title,
        'fileName':   f.filename,
        'fileUrl':    f"/uploads/{fname}",
        'coverUrl':   cover_url,
        'mimeType':   mime,
        'uploadedAt': datetime.now().isoformat()
    }
    save_json(CV_FILE, cv_data)
    return jsonify(cv_data), 201


@app.route('/api/cv', methods=['DELETE'])
def delete_cv():
    cv_data = load_json(CV_FILE, {})
    if isinstance(cv_data, dict):
        for k in ('fileUrl', 'coverUrl'):
            url = cv_data.get(k)
            if url and url.startswith('/uploads/'):
                fpath = os.path.join(UPLOAD_DIR, url[len('/uploads/'):])
                if os.path.exists(fpath):
                    try: os.remove(fpath)
                    except OSError: pass
    save_json(CV_FILE, {})
    return jsonify({'success': True})

# ── Images API ─────────────────────────────────────────────────────────────────
@app.route('/api/images', methods=['GET'])
def get_images():
    return jsonify(load_json(IMGS_FILE, {}))


@app.route('/api/upload/image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    f   = request.files['file']
    key = request.form.get('key', 'misc')
    ext   = os.path.splitext(secure_filename(f.filename))[1].lower() or '.jpg'
    fname = f"img_{key}_{uuid.uuid4().hex[:8]}{ext}"
    f.save(os.path.join(UPLOAD_DIR, fname))

    images = load_json(IMGS_FILE, {})
    old = images.get(key)
    if old and old.startswith('/uploads/'):
        old_path = os.path.join(UPLOAD_DIR, old[len('/uploads/'):])
        if os.path.exists(old_path):
            try: os.remove(old_path)
            except OSError: pass

    url = f"/uploads/{fname}"
    images[key] = url
    save_json(IMGS_FILE, images)
    return jsonify({'key': key, 'url': url})


@app.route('/api/images/<key>', methods=['DELETE'])
def delete_image(key):
    images = load_json(IMGS_FILE, {})
    if key in images:
        old = images.pop(key)
        if old and old.startswith('/uploads/'):
            old_path = os.path.join(UPLOAD_DIR, old[len('/uploads/'):])
            if os.path.exists(old_path):
                try: os.remove(old_path)
                except OSError: pass
        save_json(IMGS_FILE, images)
    return jsonify({'success': True})

# ── Editable Content API ───────────────────────────────────────────────────────
@app.route('/api/content', methods=['GET'])
def get_content():
    """Return all saved editable text content."""
    return jsonify(load_json(CONTENT_FILE, {}))


@app.route('/api/content', methods=['POST'])
def save_content():
    """Merge incoming key-value pairs into content.json."""
    data = request.get_json(silent=True) or {}
    if not data:
        return jsonify({'error': 'No data'}), 400
    content = load_json(CONTENT_FILE, {})
    content.update(data)
    save_json(CONTENT_FILE, content)
    return jsonify({'success': True, 'saved': list(data.keys())})

# ── Gallery API ────────────────────────────────────────────────────────────────
@app.route('/api/gallery', methods=['GET'])
def get_gallery():
    return jsonify(load_json(GALLERY_FILE, []))


@app.route('/api/upload/gallery', methods=['POST'])
def upload_gallery():
    """Upload one or more gallery photos."""
    if 'file' not in request.files and 'files' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    files = request.files.getlist('file') + request.files.getlist('files')
    gallery = load_json(GALLERY_FILE, [])
    uploaded = []

    for f in files:
        if not f or not f.filename:
            continue
        ext   = os.path.splitext(secure_filename(f.filename))[1].lower() or '.jpg'
        fname = f"gallery_{uuid.uuid4().hex[:12]}{ext}"
        f.save(os.path.join(UPLOAD_DIR, fname))
        caption = request.form.get('caption', '')
        photo = {
            'id':         f"gal-{uuid.uuid4().hex[:10]}",
            'url':        f"/uploads/{fname}",
            'caption':    caption,
            'fileName':   f.filename,
            'uploadedAt': datetime.now().isoformat()
        }
        gallery.append(photo)
        uploaded.append(photo)

    save_json(GALLERY_FILE, gallery)
    return jsonify(uploaded), 201


@app.route('/api/gallery/<photo_id>', methods=['DELETE'])
def delete_gallery_photo(photo_id):
    gallery = load_json(GALLERY_FILE, [])
    photo   = next((p for p in gallery if p['id'] == photo_id), None)
    if not photo:
        return jsonify({'error': 'Not found'}), 404
    url = photo.get('url', '')
    if url.startswith('/uploads/'):
        fpath = os.path.join(UPLOAD_DIR, url[len('/uploads/'):])
        if os.path.exists(fpath):
            try: os.remove(fpath)
            except OSError: pass
    save_json(GALLERY_FILE, [p for p in gallery if p['id'] != photo_id])
    return jsonify({'success': True})


@app.route('/api/gallery/<photo_id>', methods=['PATCH'])
def update_gallery_caption(photo_id):
    gallery = load_json(GALLERY_FILE, [])
    for p in gallery:
        if p['id'] == photo_id:
            data = request.get_json(silent=True) or {}
            if 'caption' in data:
                p['caption'] = data['caption']
            save_json(GALLERY_FILE, gallery)
            return jsonify(p)
    return jsonify({'error': 'Not found'}), 404

# ── Entry point ────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print()
    print("=" * 55)
    print("  Portfolio Server -- Sajjad Khaldoon Hano")
    print("=" * 55)
    print("  Admin URL  :  http://localhost:5000/")
    print("  Visitor    :  http://localhost:5000/?visitor=true")
    print("=" * 55)
    print("  To share publicly, install ngrok then run:")
    print("       ngrok http 5000")
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
