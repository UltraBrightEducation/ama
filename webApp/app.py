from flask import Flask, render_template, request, jsonify
from flask_api import status
import time, json, boto3
from urllib.request import urlopen

app = Flask(__name__,static_folder='static', template_folder='static')

#AWS Keys
ACCESS_KEY = 'AKIA6HNGQFTRI4C3R3IX'
SECRET_KEY = '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'
BUCKET_URL = 'https://ub-ama.s3.eu-west-3.amazonaws.com'
### BUCKET REGION AND TRANSCRIPT REGION NEEDS TO BE ON THE SAME ONE
REGION_NAME = 'eu-west-3'


def predict(text_to_predict):
    return text_to_predict

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
@app.route('/api/stt', methods=['POST'])
def get_file_to_tts():

    client = boto3.client('s3', aws_access_key_id=ACCESS_KEY,aws_secret_access_key=SECRET_KEY)
    s3 = boto3.resource('s3')
    bucket_name = 'ub-ama'
    source_file = 'command.wav'
    object_key = 'ama-voice-recording.wav'
    job_name = 'ama_recording_' + str(int(time.time()))
    job_uri = BUCKET_URL + '/' + object_key

    try:
        with open('command.wav', 'wb') as file:
            wav_data = request.data
            file.write(wav_data)
            # Upload file to S3
            s3.Bucket(bucket_name).upload_file(source_file, object_key)
            # Create Transcribe job
            Transcribe = boto3.client('transcribe', aws_access_key_id=ACCESS_KEY,aws_secret_access_key=SECRET_KEY, region_name=REGION_NAME)
            Transcribe.start_transcription_job(TranscriptionJobName=job_name, Media={'MediaFileUri': job_uri}, MediaFormat='wav', LanguageCode='en-US')

            while True:
                job_status = Transcribe.get_transcription_job(TranscriptionJobName=job_name)
                if job_status['TranscriptionJob']['TranscriptionJobStatus'] in ['COMPLETED', 'FAILED']:
                    break
                time.sleep(2)

            if job_status['TranscriptionJob']['TranscriptionJobStatus'] == 'COMPLETED':
                response = urlopen(job_status['TranscriptionJob']['Transcript']['TranscriptFileUri'])
                data = json.loads(response.read())
                text = data['results']['transcripts'][0]['transcript']

            ### CALL MODEL with variable 'text' as input
            prediction = predict(text)
            ### 
            response = {'status': status.HTTP_200_OK, 'ama_response': prediction}

        return jsonify(response)

    except Exception as e:
        response = {'status': status.HTTP_500_INTERNAL_SERVER_ERROR, 'message': '({}) - Something went Wrong! Try Again!'.format(str(e))}
        return jsonify(response)

@app.route('/api/nlp', methods= ['POST'])
def grade_nlp():
    score = 0
    try:
        payload = request.get_json()
        action = payload.get('action', None)
        text_to_predict = payload.get('text_to_predict', None)

        if action == 'grade':
            ### call nlp grading function here
            score = 98
            response = {'status': status.HTTP_200_OK, 'score': score, 'action_performed': action}
            pass
        
        if action == 'predict':
            ### Call model 
            response = {'status': status.HTTP_200_OK, 'ama_response': 'Got you dude!'}
            pass

        return jsonify(response)

    except Exception as e:
        response = {'status': status.HTTP_500_INTERNAL_SERVER_ERROR, 'message': '({}) - Something went Wrong! Try Again!'.format(str(e))}
        return jsonify(response)

if __name__ == '__main__':
    app.run()