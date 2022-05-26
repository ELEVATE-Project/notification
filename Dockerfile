FROM node:16

#Set working directory
WORKDIR /data/user

#Copy package.json file
COPY package.json .

#Install node packages
RUN npm install -f && npm install -g nodemon@2.0.16

#Copy all files 
COPY . .

#Expose the application port
EXPOSE 3001

#Start the application
CMD [ "node", "app.js" ]