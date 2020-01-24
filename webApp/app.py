from flask import Flask, render_template, request, jsonify
from flask_api import status
app = Flask(__name__,static_folder='static', template_folder='static')


### Frontend
@app.route('/')
def index():
    return render_template(('main.html'))
@app.route('/ama')
def ama():
    return render_template(('/templates/ama.html'))
@app.route('/ds')
def ds():
    return render_template(('/templates/ds.html'))
@app.route('/cv')
def cv():
    return render_template(('/templates/cv.html'))

### Backend
@app.route('/api/grade/nlp', methods= ['POST'])
def grade_nlp():
    score = 0
    try:
        payload = request.get_json()
        action = payload.get('action', None)
        if 'action' == 'grade':
            ### call nlp grading function here
            score = 98
            pass

        response = {'status': status.HTTP_200_OK, 'score': score, 'action_performed': action}
        return jsonify(response)

    except Exception as e:
        response = {'status': status.HTTP_500_INTERNAL_SERVER_ERROR, 'message': '({}) - Something went Wrong! Try Again!'.format(str(e))}
        return jsonify(response)

if __name__ == '__main__':
    app.run()