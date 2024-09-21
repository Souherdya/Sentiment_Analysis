from textblob import TextBlob

# Example sentence
sentence = "I do not hate you"

# Perform sentiment analysis
blob = TextBlob(sentence)
polarity = blob.sentiment.polarity

# Define custom thresholds
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
print("Comment: ",sentence)
print(f"Polarity: {polarity}, Sentiment: {sentiment_label}")
