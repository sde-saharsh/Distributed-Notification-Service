# Distributed-Notification-Service

distributed-notification-service/
│
├── src/
│   │
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   └── env.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── notification.model.js
│   │   ├── outbox.model.js
│   │   └── delivery-log.model.js
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.service.js
│   │   │
│   │   └── notifications/
│   │       ├── notification.routes.js
│   │       ├── notification.controller.js
│   │       ├── notification.service.js
│   │       └── notification.validation.js
│   │
│   ├── outbox/
│   │   └── outbox.relay.js
│   │
│   ├── queues/
│   │   ├── queue.config.js
│   │   ├── fanout.queue.js
│   │   ├── email.queue.js
│   │   ├── sms.queue.js
│   │   └── push.queue.js
│   │
│   ├── orchestrator/
│   │   └── fanout.service.js
│   │
│   ├── workers/
│   │   ├── fanout.worker.js
│   │   ├── email.worker.js
│   │   ├── sms.worker.js
│   │   └── push.worker.js
│   │
│   ├── providers/
│   │   ├── email.provider.js
│   │   ├── sms.provider.js
│   │   └── push.provider.js
│   │
│   ├── monitoring/
│   │   ├── metrics.js
│   │   └── health.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   └── errors.js
│   │
│   ├── app.js
│   │
│   └── processes/
│       ├── api.js
│       ├── relay.js
│       ├── fanout.js
│       ├── email.js
│       ├── sms.js
│       └── push.js
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── load/
│       ├── notification-load.js
│       ├── burst-test.js
│       ├── stress-test.js
│       └── soak-test.js
│
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml
│   │
│   └── grafana/
│       ├── provisioning/
│       │   ├── datasources/
│       │   │   └── prometheus.yml
│       │   └── dashboards/
│       └── dashboards/
│           ├── application-dashboard.json
│           └── queue-dashboard.json
│
├── docker/
│   └── nginx/
│       └── nginx.conf
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env.example
├── .gitignore
└── README.md


curl -4 ifconfig.me
self ipv4 address command


cd Desktop/'Distributed Notification Service'
node src/processes/api.js

cd Desktop
cd 'Distributed Notification Service'
node src/processes/email.js

cd Desktop
cd 'Distributed Notification Service'
node src/processes/fanout.js


cd Desktop
cd 'Distributed Notification Service'
node src/processes/push.js

cd Desktop
cd 'Distributed Notification Service'
node src/processes/relay.js


cd Desktop
cd 'Distributed Notification Service'
node src/processes/sms.js


next prompt 

saharsh@sde-saharsh:~/Desktop/Distributed Notification Service$ tree src/workers
src/workers
├── email.worker.js
├── fanout.worker.js
├── push.worker.js
└── sms.worker.js

1 directory, 4 files
saharsh@sde-saharsh:~/Desktop/Distributed Notification Service$ find src/workers -maxdepth 2 -type f
src/workers/fanout.worker.js
src/workers/push.worker.js
src/workers/sms.worker.js
src/workers/email.worker.js
saharsh@sde-saharsh:~/Desktop/Distributed Notification Service$ 
