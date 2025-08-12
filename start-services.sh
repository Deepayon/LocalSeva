#!/bin/bash

echo "Starting PadosHelp services..."

# Kill any existing processes
pkill -f "node\|npm\|next" 2>/dev/null || true
sleep 2

# Start backend
echo "Starting backend..."
cd /home/z/my-project/backend
nohup npx tsx server-express-working.ts > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

# Check if backend is running
if lsof -i:9999 > /dev/null; then
    echo "Backend is running on port 9999"
else
    echo "Backend failed to start"
    cat backend.log
    exit 1
fi

# Start frontend
echo "Starting frontend..."
cd /home/z/my-project/frontend
nohup npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

# Wait for frontend to start
sleep 10

# Check if frontend is running
FRONTEND_PORT=$(lsof -i -P | grep node | grep LISTEN | tail -1 | awk '{print $9}' | cut -d: -f2)
if [ -n "$FRONTEND_PORT" ]; then
    echo "Frontend is running on port $FRONTEND_PORT"
    echo ""
    echo "Services are running:"
    echo "Backend: http://localhost:9999"
    echo "Frontend: http://localhost:$FRONTEND_PORT"
    echo ""
    echo "Backend health check:"
    curl -s http://localhost:9999/health | jq . || curl -s http://localhost:9999/health
else
    echo "Frontend failed to start"
    cat frontend.log
    exit 1
fi