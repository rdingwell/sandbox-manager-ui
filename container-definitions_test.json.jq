[
  {
    "name": "{{$PROJECT_NAME}}",
    "image": "nexus.hspconsortium.org:18083/hspc/react-sandbox-manager-test:0.1.0",
    "cpu": 0,
    "portMappings": [
      {
        "containerPort": 3000,
        "hostPort": 0,
        "protocol": "tcp"
      }
    ],
    "memoryReservation": 100,
    "essential": true
  }
]
