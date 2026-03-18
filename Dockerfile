# Use Ubuntu with Node and Java bundled natively!
FROM ubuntu:22.04

# Setup Java and Node environments securely
RUN apt-get update && \
    apt-get install -y curl openjdk-17-jdk && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

WORKDIR /app
COPY . .

# Step 1: Pre-compile your core Java Algorithms
WORKDIR /app/injava
RUN javac *.java

# Step 2: Pre-compile the React frontend into static HTML/CSS
WORKDIR /app/inweb
RUN npm install
RUN npm run build

# Step 3: Expose the unified Web Server port
EXPOSE 3000
EXPOSE 3001
ENV NODE_ENV=production

# Boot the node system which implicitly catches React web traffic AND Java API traffic!
CMD ["node", "api/index.js"]
