From python:3.12

# Set the working directory
WORKDIR /app

# copy the requirements files and app.py only
COPY requirements.txt app.py ./

# Install the dependencies
RUN pip install -r requirements.txt

expose 8765

# Run the application
CMD ["python", "app.py"]