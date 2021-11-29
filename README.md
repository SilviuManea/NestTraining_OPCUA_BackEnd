Readme

# Commands

-- Installing dependencies - `npm install`

-- Start the project - `npm run start:dev`

# Basic Flow for reading or monitoring a value.(Item)

When connecting to a PLC , the next workflow is launched:

- We first need to define a ENDPOINT(Our PLC).
- We declare a CLIENT with the EndPoint and we use client.connect(endpoint) to connect to it.
- Then we need to prepare the SESSION on the clients using client.createSession().
- On the session we READ or WRITE a aspecific node using session.read().
- If need to MONITOR a specific node we need to create a SUBSCRIPTION using session.createSubscription2.
- To READ the value of the MONITORED ITEM we use subscription.monitor.
- To end the flow, we must TERMINATE the SUBSCRIPTION , CLOSE the SESSION , and DISCONNECT the CLIENT.
