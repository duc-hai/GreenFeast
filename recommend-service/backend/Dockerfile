FROM python:3.9.19

WORKDIR /app

COPY package*.txt ./

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     libgomp1 \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/* 

RUN apt-get update && apt-get install -y gcc

RUN pip3 install -r package1.txt

RUN pip3 install -r package2.txt

# RUN conda install -y Cython pandera recommenders Flask pandas tensorflow-cpu lightgbm category_encoders 

COPY . .

CMD ["python", "/app/app.py"]

EXPOSE 5090