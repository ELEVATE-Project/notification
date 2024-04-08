# ShikshaLokam Notification Service Documentation

## System Requirements

-   **Operating System:** Ubuntu 22
-   **Node.js:** v20
-   **PostgreSQL:** 16
-   **Citus:** 12.1
-   **Apache Kafka:** 3.5.0

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
