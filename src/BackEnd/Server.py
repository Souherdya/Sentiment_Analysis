from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask import Flask,send_file, render_template
import io
from io import BytesIO
import matplotlib.pyplot as plt
import pandas as pd
from textblob import TextBlob
from collections import Counter
from googletrans import Translator
from langdetect import detect

translator = Translator()





app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow requests from this origin

app.secret_key = 'Souherdya@123'
# API endpoint to receive the prompt and send a response
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Handling CSV file upload
        if "file" in request.files:
            file = request.files["file"]
            
            # Check if the file is not empty
            if file.filename == '':
                return jsonify({"error": "No file uploaded"}), 400
            
            # Reading the uploaded CSV
            print(f"File received: {file.filename}")
            print(f"File content type: {file.content_type}")


            try:
                file_stream = io.StringIO(file.stream.read().decode("ISO-8859-1"))  # Decode binary data to text
                data = pd.read_csv(file_stream)
                print("CSV file read successfully!")
            except Exception as e:
                print(f"Error reading CSV: {str(e)}")
                return jsonify({"error": "Failed to read CSV"}), 400


            # Perform sentiment analysis on 'review' column
            data[['Polarity', 'Sentiment']] = data['review'].apply(get_sentiment).apply(pd.Series)
            test_arr = data['Sentiment']
            frequency_dict = dict(Counter(test_arr))
            print(frequency_dict)
            
            
            print("Processing Done!")

            # Save the modified DataFrame to a CSV in memory
            output = io.BytesIO()  # Use BytesIO for binary data
            data.to_csv(output, index=False)
            output.seek(0)
            
            # Return the modified CSV file as a downloadable response
            return send_file(output,
                             mimetype='text/csv',
                             as_attachment=True,
                             download_name='processed_file.csv')

        if "text" in request.json:
            text_input = request.json["text"]
            if detect(text_input)!= 'en':
                text_input = translator.translate(text_input,dest='en').text 
                print(text_input)
            predicted_sentiment = get_sentiment(text_input)
            return jsonify({"prediction": predicted_sentiment})

        return jsonify({"error": "Invalid input"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    

def get_sentiment(comment):
    blob = TextBlob(comment)
    polarity = blob.sentiment.polarity 
    if polarity >= 0.7:
        sentiment_label = "strongly positive"
    elif 0.3 <= polarity < 0.7:
        sentiment_label = "mildly positive"
    elif -0.3 < polarity < 0.3:
        sentiment_label = "neutral"
    elif -0.7 <= polarity <= -0.3:
        sentiment_label = "mildly negative"
    else:
        sentiment_label = "strongly negative"
    return polarity, sentiment_label

CORS(app, origins=["http://localhost:3000"])
@app.route('/freq', methods=['POST'])
def freq():
        # Handling CSV file upload
        if "file" in request.files:
            file = request.files["file"]
            
            # Check if the file is not empty
            if file.filename == '':
                return jsonify({"error": "No file uploaded"}), 400
            
            # Reading the uploaded CSV
            print(f"File received: {file.filename}")
            print(f"File content type: {file.content_type}")


            try:
                file_stream = io.StringIO(file.stream.read().decode("ISO-8859-1"))  # Decode binary data to text
                data = pd.read_csv(file_stream)
                print("CSV file read successfully!")
            except Exception as e:
                print(f"Error reading CSV: {str(e)}")
                return jsonify({"error": "Failed to read CSV"}), 400


            # Perform sentiment analysis on 'review' column
            data[['Polarity', 'Sentiment']] = data['review'].apply(get_sentiment).apply(pd.Series)
            test_arr = data['Sentiment']
            frequency_dict = dict(Counter(test_arr))
            print(frequency_dict)
            print("Processing Done!")
            return jsonify(frequency_dict)
            
           


# def get_distribution_graph(data):
#     fig = plt.figure(figsize=(5, 5))
#     colors = ("green", "red")
#     wp = {"linewidth": 1, "edgecolor": "black"}
#     tags = data["Predicted sentiment"].value_counts()
#     explode = (0.01, 0.01)

#     tags.plot(
#         kind="pie",
#         autopct="%1.1f%%",
#         shadow=True,
#         colors=colors,
#         startangle=90,
#         wedgeprops=wp,
#         explode=explode,
#         title="Sentiment Distribution",
#         xlabel="",
#         ylabel="",
#     )

#     graph = BytesIO()
#     plt.savefig(graph, format="png")
#     plt.close()

#     return graph



if __name__ == "__main__":
    app.run(port=5000, debug=True)