FROM cubejs/cube:latest

USER root

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        openjdk-21-jdk-headless \
        python3 \
        make \
        g++ \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

RUN java -version

WORKDIR /cube

RUN npm install --unsafe-perm java@0.18.0
