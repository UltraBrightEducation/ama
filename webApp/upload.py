import boto3

client = boto3.client('s3', aws_access_key_id="AKIA6HNGQFTRI4C3R3IX",aws_secret_access_key="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")
s3 = boto3.resource('s3')
bucket_name = "ub-ama"
source_file = "command.wav"
object_key = "ama-voice-recording.wav"

try:
    s3.Bucket(bucket_name).upload_file(source_file, object_key)
except Exception as e:
    print(e)
