import grpc
import calculator_pb2
import calculator_pb2_grpc

def run():
    # ตรวจสอบ path ของ ca.crt
    ca_cert_path = './ca.crt'
    try:
        with open(ca_cert_path, 'rb') as f:
            creds = grpc.ssl_channel_credentials(root_certificates=f.read())
    except FileNotFoundError:
        print(f"Error: Could not find CA certificate at {ca_cert_path}")
        return

    with grpc.secure_channel('127.0.0.1:50051', creds) as channel:
        stub = calculator_pb2_grpc.CalculatorStub(channel)
        number = 5
        try:
            response = stub.Square(calculator_pb2.SquareRequest(number=number))
            print(f"Square of {number} is {response.result}")
        except grpc.RpcError as e:
            print(f"RPC Error: {e.code()}: {e.details()}")

if __name__ == '__main__':
    run()
