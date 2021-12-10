import { Injectable } from '@nestjs/common';
import {
  AttributeIds,
  DataValue,
  OPCUAClient,
  StatusCodes,
  TimestampsToReturn
} from 'node-opcua';

@Injectable()
export class PlcService {

  
  async onModuleInit() {

  }
  
  async LanzaConexion_PLCSim(){
    console.log(`Initialization PLC Connection...`);

    // Read PLC Endpoints from DB (Or hardcoded for now)
    const endpointUrl = 'opc.tcp://localhost:53530/OPCUA/SimulationServer';

    // Declare the Node ID which will read
    const nodeId = 'ns=3;i=1005';

    // Declare the Client
    try {
      const client = OPCUAClient.create({
        endpointMustExist: false,
        connectionStrategy: {
          maxRetry: 2,
          initialDelay: 2000,
          maxDelay: 10 * 1000,
        },
      });
      client.on('backoff', () => console.log('retrying connection'));

      // Connect the client to the endpoint
      await client.connect(endpointUrl);

      // Create the session on the client
      const session = await client.createSession();

      // Checking the SessionID
      console.log('Session ID => ', session.sessionId.value);
      //this.logsilviu.log('Session ID => ', session.sessionId.value);

      //TODO: Research BROWSE functionality in the future - not enabled for now

      /* const browseResult: BrowseResult = (await session.browse(
        'RootFolder',
      )) as BrowseResult;

      console.log(
        browseResult.references
          .map((r: ReferenceDescription) => r.browseName.toString())
          .join('\n'),
      ); */

      // READ ONCE the Data from the selected node.

      const dataValue = await session.read({
        nodeId,
        attributeId: AttributeIds.Value,
      });
      if (dataValue.statusCode !== StatusCodes.Good) {
        console.log('Could not read ', nodeId);
      }
      console.log(` temperature = ${dataValue.value.toString()}`);

      // Install a subscription and monitor an item for monitoring changes on its value
      const subscription = await session.createSubscription2({
        requestedPublishingInterval: 1000,
        requestedLifetimeCount: 100,
        requestedMaxKeepAliveCount: 20,
        maxNotificationsPerPublish: 10,
        publishingEnabled: true,
        priority: 10,
      });

      console.log('Starting subscription!');

      subscription
        .on('started', () =>
          console.log(
            'subscription started - subscriptionId=',
            subscription.subscriptionId,
          ),
        )
        .on('keepalive', () => console.log('keepalive'))
        .on('terminated', () => console.log('subscription terminated'));

      console.log('Subscription ID => '+ subscription.subscriptionId.toString());

      const monitoredItem = await subscription.monitor(
        {
          nodeId,
          attributeId: AttributeIds.Value,
        },
        {
          samplingInterval: 100,
          discardOldest: true,
          queueSize: 10,
        },
        TimestampsToReturn.Both,
      );

      monitoredItem.on('changed', (dataValue: DataValue) => {
        console.log(` Temperature = ${dataValue.value.value.toString()}`);
      });

      await new Promise((resolve) => setTimeout(resolve, 10000));
      await subscription.terminate();

      // *************************************WRITE value to specific node**********************************//

      //TODO: Research WRITE value to specific node - the node must be writtable.(some nodes are not)

      /*       const statusCode = await session.write({
        //nodeId: "ns=7;s=Scalar_Static_Double",
        nodeId: 'ns=3;i=1005',
        attributeId: AttributeIds.Value,
        value: {
          statusCode: StatusCodes.Good,
          sourceTimestamp: new Date(),
          value: {
            dataType: DataType.Double,
            value: 25.0,
          },
        },
      });
      console.log('statusCode = ', statusCode.toString()); */

      // *************************************WRITE value to specific node**********************************//

      // *************************************Closing Session and Disconnect Client**********************************//

      console.log(' closing session');
      await session.close();

      console.log(' disconnecting client');
      await client.disconnect();
      // *************************************Closing Session and Disconnect Client**********************************//
    } catch (err) {
      console.log('Error !!!', err);
    }
  }


}
