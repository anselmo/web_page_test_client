# DR TEETH 
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
- start redis-server
``` bash
  ./redis-server config/redis.conf
```
- start web app
``` bash
  ./strata -p 3000 app.js
```

###Status
- WIP __Unstable (i mean unstable, don't read the rest)__
- Boostrap done, but basically a lot to do.
- Web Test Agents - collect orchestrated and colleting data.
- Data persistence in file for future reference
- Data persistence in Redis for real-time use.
- Basic Web App.
- Basic Dashboard.
- PUB/SUB between agents manager and web-app
- WEB-RTC between web-app and client dashboard


###Reference
- www.webpagetest.com
