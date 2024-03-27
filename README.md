<div align="center">

# Notifications Service

<a href="https://shikshalokam.org/elevate/">
<img
    src="https://shikshalokam.org/wp-content/uploads/2021/06/elevate-logo.png"
    height="140"
    width="300"
  />
</a>

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/ELEVATE-Project/notification/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/ELEVATE-Project/notification/tree/master)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_notification&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_notification)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_notification&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_notification)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_notification&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_notification)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)
[![Docs](https://img.shields.io/badge/Docs-success-informational)](https://elevate-docs.shikshalokam.org/mentorEd/intro)
[![Docs](https://img.shields.io/badge/API-docs-informational)](https://dev.elevate-apis.shikshalokam.org/notification/api-doc)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/ELEVATE-Project/notification?filename=src%2Fpackage.json)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<details><summary>CircleCI insights</summary>

[![CircleCI](https://dl.circleci.com/insights-snapshot/gh/ELEVATE-Project/notification/master/buil-and-test/badge.svg?window=30d)](https://app.circleci.com/insights/github/ELEVATE-Project/notification/workflows/buil-and-test/overview?branch=master&reporting-window=last-30-days&insights-snapshot=true)

</details>
<!-- <details><summary>dev</summary>
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/ELEVATE-Project/mentoring/tree/dev.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/ELEVATE-Project/mentoring/tree/dev)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/ELEVATE-Project/user/dev?filename=src%2Fpackage.json)
[![CircleCI](https://dl.circleci.com/insights-snapshot/gh/ELEVATE-Project/mentoring/dev/buil-and-test/badge.svg?window=30d)](https://app.circleci.com/insights/github/ELEVATE-Project/mentoring/workflows/buil-and-test/overview?branch=integration-testing&reporting-window=last-30-days&insights-snapshot=true)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=duplicated_lines_density&branch=dev)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=coverage&branch=dev)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ELEVATE-Project_mentoring&metric=vulnerabilities&branch=revert-77-integration-test)](https://sonarcloud.io/summary/new_code?id=ELEVATE-Project_mentoring)
</details> -->

</br>
The Mentoring building block enables effective mentoring interactions between mentors and mentees. The capability aims to create a transparent eco-system to learn, connect, solve, and share within communities.MentorED is an open source mentoring application that facilitates peer learning and professional development by creating a community of mentors and mentees.
</div>

<br>

# System Requirements

-   **Operating System:** Ubuntu 22
-   **Node.js:** v20
-   **PostgreSQL:** 16
-   **Citus:** 12.1
-   **Apache Kafka:** 3.5.0

# Setup Options

Elevate notification services can be setup in local using two methods:

<details><summary>Dockerized service with local dependencies(Intermediate)</summary>

## A. Dockerized Service With Local Dependencies

**Expectation**: Run single docker containerized service with existing local (in host) or remote dependencies.

### Local Dependencies Steps

1. Update dependency (Kafka etc) IP addresses in .env with "**host.docker.internal**".

    Eg:

    ```
     #Kafka Host Server URL
     KAFKA_URL = host.docker.external:9092
    ```

2. Build the docker image.
    ```
    /ELEVATE/notification$ docker build -t elevate/notification:1.0 .
    ```
3. Run the docker container.

    - For Mac & Windows with docker v18.03+:

        ```
        $ docker run --name notification elevate/notification:1.0
        ```

    - For Linux:
        ```
        $ docker run --name notification --add-host=host.docker.internal:host-gateway elevate/notification:1.0`
        ```
        Refer [this](https://stackoverflow.com/a/24326540) for more information.

### Remote Dependencies Steps

1. Update dependency (Kafka etc) Ip addresses in .env with respective remote server IPs.

    Eg:

    ```
     #Kafka Host Server URL
     KAFKA_URL = 11.2.3.45:9092
    ```

2. Build the docker image.
    ```
    /ELEVATE/notification$ docker build -t elevate/notification:1.0 .
    ```
3. Run the docker container.

    ```
    $ docker run --name notification elevate/notification:1.0
    ```

</details>

<details><summary>Local Service with local dependencies(Hardest)</summary>

## B. Local Service With Local Dependencies

**Expectation**: Run single service with existing local dependencies in host (**Non-Docker Implementation**).

## Installations

### Install Node.js LTS

Refer to the [NodeSource distributions installation scripts](https://github.com/nodesource/distributions#installation-scripts) for Node.js installation.

```bash
$ curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

### Install Build Essential

```bash
$ sudo apt-get install build-essential
```

### Install Kafka

Refer to [Kafka Ubuntu 22.04 setup guide](https://www.fosstechnix.com/install-apache-kafka-on-ubuntu-22-04-lts/)

1. Install OpenJDK 11:

    ```bash
    $ sudo apt install openjdk-11-jdk
    ```

2. Download and extract Kafka:

    ```bash
    $ sudo wget https://downloads.apache.org/kafka/3.5.0/kafka_2.12-3.5.0.tgz
    $ sudo tar xzf kafka_2.12-3.5.0.tgz
    $ sudo mv kafka_2.12-3.5.0 /opt/kafka
    ```

3. Configure Zookeeper:

    ```bash
    $ sudo nano /etc/systemd/system/zookeeper.service
    ```

    Paste the following lines into the `zookeeper.service` file:

    ```ini
    /etc/systemd/system/zookeeper.service
    [Unit]
    Description=Apache Zookeeper service
    Documentation=http://zookeeper.apache.org
    Requires=network.target remote-fs.target
    After=network.target remote-fs.target

    [Service]
    Type=simple
    ExecStart=/opt/kafka/bin/zookeeper-server-start.sh /opt/kafka/config/zookeeper.properties
    ExecStop=/opt/kafka/bin/zookeeper-server-stop.sh
    Restart=on-abnormal

    [Install]
    WantedBy=multi-user.target
    ```

    Save and exit.

4. Reload systemd:

    ```bash
    $ sudo systemctl daemon-reload
    ```

5. Configure Kafka:

    ```bash
    $ sudo nano /etc/systemd/system/kafka.service
    ```

    Paste the following lines into the `kafka.service` file:

    ```ini
    [Unit]
    Description=Apache Kafka Service
    Documentation=http://kafka.apache.org/documentation.html
    Requires=zookeeper.service

    [Service]
    Type=simple
    Environment="JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64"
    ExecStart=/opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties
    ExecStop=/opt/kafka/bin/kafka-server-stop.sh

    [Install]
    WantedBy=multi-user.target
    ```

    Save and exit.

6. Reload systemd:

    ```bash
    $ sudo systemctl daemon-reload
    ```

7. Start Zookeeper:

    ```bash
    $ sudo systemctl start zookeeper
    ```

    Check status:

    ```bash
    $ sudo systemctl status zookeeper
    ```

    Zookeeper service status should be shown as active (running).

8. Start Kafka:

    ```bash
    $ sudo systemctl start kafka
    ```

    Check status:

    ```bash
    $ sudo systemctl status kafka
    ```

    Kafka status should be shown as active (running).

### Install PM2

Refer to [How To Set Up a Node.js Application for Production on Ubuntu 22.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-22-04).

**Run the following command**

```bash
$ sudo npm install pm2@latest -g
```

## Setting up Repository

### Clone the notification repository to /opt/backend directory

```bash
opt/backend$ git clone -b develop-2.5 --single-branch "https://github.com/ELEVATE-Project/notification.git"
```

### Install Npm packages from src directory

```bash
backend/notification/src$ sudo npm i
```

### Create .env file in src directory

```bash
notification/src$ sudo nano .env
```

Copy-paste the following env variables to the `.env` file:

```env
# Notification Service Config

# Port on which service runs
APPLICATION_PORT=3002

# Application environment
APPLICATION_ENV=development

# Route after the base URL
APPLICATION_BASE_URL=/notification/

# Kafka endpoint
KAFKA_HOST="localhost:9092"

# Kafka topic name
KAFKA_TOPIC="dev.notification"

# Kafka consumer group id
KAFKA_GROUP_ID="elevate-notification"

# Sendgrid API key
SENDGRID_API_KEY="SG.asd9f87a9s8d7f."

# Sendgrid sender email address
SENDGRID_FROM_MAIL="no-reply@some.org"

# Api doc URL
API_DOC_URL= "/notification/api-doc"

INTERNAL_ACCESS_TOKEN="internal_access_token"
ERROR_LOG_LEVEL='silly'
DISABLE_LOG=false
DEV_DATABASE_URL=postgres://shikshalokam:slpassword@localhost:9700/elevate_notification

ZEST_ENV= "ZEST_ENV"
created_time= "2023-12-29T17:04:19.017783534Z"
custom_metadata= null
destroyed=false
version=8
```

Save and exit.

## Setting up Databases

**Log into the postgres user**

```bash
sudo su postgres
```

**Log into psql**

```bash
psql -p 9700
```

**Create a database user/role:**

```sql
CREATE USER shikshalokam WITH ENCRYPTED PASSWORD 'slpassword';
```

**Create the elevate_notification database**

```sql
CREATE DATABASE elevate_notification;
GRANT ALL PRIVILEGES ON DATABASE elevate_notification TO shikshalokam;
\c elevate_notification
GRANT ALL ON SCHEMA public TO shikshalokam;
```

## Running Migrations To Create Tables

**Exit the postgres user account and install sequelize-cli globally**

```bash
$ sudo npm i sequelize-cli -g
```

**Navigate to the src folder of notification service and run sequelize-cli migration command:**

```bash
notification/src$ npx sequelize-cli db:migrate
```

**Now all the tables must be available in the Citus databases**

## Start the Service

Navigate to the src folder of notification service and run pm2 start command:

```bash
notification/src$ pm2 start app.js -i 2 --name elevate-notification
```

#### Run pm2 ls command

```bash
$ pm2 ls
```

Output should look like this (Sample output, might slightly differ in your installation):

```bash
┌────┬─────────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                    │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 19 │ elevate-notification    │ default     │ 1.0.0   │ cluster │ 88026    │ 47h    │ 0    │ online    │ 0%       │ 113.2mb  │ jenkins  │ disabled │
│ 20 │ elevate-notification    │ default     │ 1.0.0   │ cluster │ 88036    │ 47h    │ 0    │ online    │ 0%       │ 80.3mb   │ jenkins  │ disabled │
└────┴─────────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

This concludes the service and dependency setup.

</details>

<br>

# Run tests

## Integration tests

```
npm run test:integration
```

To know more about integration tests and their implementation refer to the project [Wiki](https://github.com/ELEVATE-Project/user/wiki/Integration-and-Unit-testing).

## Unit tests

```
npm test
```

# Used in

This project was built to be used with [Mentoring Service](https://github.com/ELEVATE-Project/mentoring.git) and [User Service](https://github.com/ELEVATE-Project/user.git).

The frontend/mobile application [repo](https://github.com/ELEVATE-Project/mentoring-mobile-app).

You can learn more about the full implementation of MentorEd [here](https://elevate-docs.shikshalokam.org/.mentorEd/intro) .

# Team

<a href="https://github.com/ELEVATE-Project/mentoring/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ELEVATE-Project/notification" />
</a>

<br>

# Open Source Dependencies

Several open source dependencies that have aided Mentoring's development:

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
