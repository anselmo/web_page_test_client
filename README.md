# WEB PAGE TEST CLIENT
__(WIP) FRONT END PERFORMANCE MONITOR - THROUGHT WEBPAGETEST__

- webpagetest agents, workers, manager and dashboard for a continuous ecosystem monitoring.

###Requirements
- NodeJS
- Redis

### Running
- Clone dr_teeth.

- Install node packages
``` bash
  ./npm install
```
- Start redis-server
``` bash
  ./redis-server config/redis.conf
```
- Start web app
``` bash
  ./strata -p 3000 app.js
```
- Running tests
``` bash
  ./bin/test
```


###Status
- WIP __Unstable (I mean not ready)__
- Boostrap done, but basically a lot to do.
- Web Test Agents - orchestrates and collets data.
- Data persistence in disk for future reference.
- Data persistence in redis, normalised for real-time use.
- Basic Web App.
- Basic Dashboard.
- PUB/SUB between agents manager and web-app
- WEB-RTC between web-app and client dashboard


###Reference
- www.webpagetest.org
