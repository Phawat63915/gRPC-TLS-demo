const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

const PROTO_PATH = __dirname + '/calculator.proto';

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    { keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
const calculatorProto = grpc.loadPackageDefinition(packageDefinition).calculator;

function square(call, callback) {
  const number = call.request.number;
  callback(null, { result: number * number });
}

function main() {
  const serverCert = fs.readFileSync(__dirname + '/server.crt');
  const serverKey = fs.readFileSync(__dirname + '/server.key');
  const caCert = fs.readFileSync(__dirname + '/ca.crt');

  const keyCertPairs = [{ private_key: serverKey, cert_chain: serverCert }];

  const credentials = grpc.ServerCredentials.createSsl(
    caCert, // root certificate (Buffer)
    keyCertPairs, // array of key-certificate pairs (array of objects)
    true // checkClientCertificate (boolean)
  );

  const server = new grpc.Server();
  server.addService(calculatorProto.Calculator.service, { Square: square });

  // ใช้ 0.0.0.0 เพื่อให้สามารถเข้าถึงได้จากภายนอก localhost
  server.bindAsync('127.0.0.1:50051', credentials, () => { 
    console.log('Server running on port 50051');
    // server.start();
  });
}

main();
