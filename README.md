npm init -y && npm install @grpc/grpc-js @grpc/proto-loader -y
py -m pip install grpcio grpcio-tools

<!-- การติดตั้ง openssl สำหรับ windoes -->
https://slproweb.com/products/Win32OpenSSL.html

# สร้าง CA private key
openssl genrsa -out ca.key 2048

# สร้าง CA certificate
openssl req -x509 -new -nodes -key ca.key -days 3650 -out ca.crt -subj "/CN=Test CA"

# สร้าง server private key
openssl genrsa -out server.key 2048

# สร้าง Certificate Signing Request (CSR) สำหรับ server
openssl req -new -key server.key -out server.csr -subj "/CN=localhost"

<!-- หมายเหตุุ คำสั่งนี้ใช้ไม่ได้เพราะ Errir  <() -->
# สร้าง server certificate ที่เซ็นโดย CA
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365 -sha256 -extfile <(echo "subjectAltName=DNS:localhost")

<!-- หมายเหตุคำสั่งที่แก้ไขแล้วทำตามขั้นตอนดังนี้ -->
# สร้างไฟล์ extfile.txt เพื่อเก็บ extension
```extfile.txt
subjectAltName=DNS:localhost
```
# สร้าง server certificate ที่เซ็นโดย CA
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365 -sha256 -extfile extfile.txt



หลังจากที่สร้างไฟล์ key, certificate, `calculator.proto`, `server.js` และ `client.py` ครบแล้ว  

**ทำตามขั้นตอนต่อไปนี้เพื่อรัน gRPC server และ client:**

**1. Compile Protocol Buffers:**

   - เปิด terminal/command prompt ใน folder ที่มีไฟล์ `calculator.proto`
   - รันคำสั่ง:

     ```bash
     py -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. ./calculator.proto 
     ```

     คำสั่งนี้จะสร้างไฟล์  `calculator_pb2.py`  และ  `calculator_pb2_grpc.py`  ซึ่ง Python client จะต้องใช้

**2. รัน gRPC Server:**

   - เปิด terminal/command prompt ใหม่ใน folder ที่มีไฟล์  `server.js`
   - รันคำสั่ง:

     ```bash
     node server.js
     ```

     server จะเริ่มทำงานและรับฟังการเชื่อมต่อที่  `localhost:50051`

**3. รัน gRPC Client (ใน terminal/command prompt อื่น):**

   - ไปที่ folder ที่มีไฟล์  `client.py`
   - รันคำสั่ง:

     ```bash
     python client.py
     ```

     client จะเชื่อมต่อกับ server, ส่งคำขอ, และแสดงผลลัพธ์ 

**ผลลัพธ์:**

หากทุกอย่างเรียบร้อย คุณจะเห็นผลลัพธ์ดังนี้ใน terminal ที่รัน client:

```
Square of 5 is 25
```

**หมายเหตุ:**

- ตรวจสอบให้แน่ใจว่า port `50051` ไม่ได้ถูกใช้งานโดยโปรแกรมอื่น
- ตรวจสอบ path ของไฟล์ใบรับรองใน  `server.js`  และ  `client.py`  ให้ถูกต้อง
- หากพบปัญหา ลองตรวจสอบ error message และแก้ไขตามความเหมาะสม 

🎉 ตอนนี้คุณได้สร้างและรัน gRPC server และ client ที่ปลอดภัยด้วย TLS แล้ว! 🎉 
