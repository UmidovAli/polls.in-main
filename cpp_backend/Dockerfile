FROM gcc:13 AS builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    cmake \
    libpq-dev \
    libcurl4-openssl-dev \
    libssl-dev \
    libboost-all-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy CMakeLists and source
COPY CMakeLists.txt .
COPY src/ src/

# Build
RUN mkdir build && cd build && \
    cmake .. -DCMAKE_BUILD_TYPE=Release && \
    make -j$(nproc)

FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    libcurl4 \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/build/polls_backend /app/polls_backend

EXPOSE 8080

CMD ["/app/polls_backend"]
