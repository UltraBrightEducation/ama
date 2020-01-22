from flask import Flask, flash, redirect, render_template, request, session, abort

app = Flask(__name__,static_folder='static', template_folder='static')

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
    
if __name__ == '__main__':
    app.run()