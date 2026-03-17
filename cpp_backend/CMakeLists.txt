cmake_minimum_required(VERSION 3.15)
project(polls_backend CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)

# Crow
FetchContent_Declare(
    Crow
    GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
    GIT_TAG v1.0+5
)
FetchContent_MakeAvailable(Crow)

# nlohmann_json
FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.2
)
FetchContent_MakeAvailable(json)

# libpqxx
FetchContent_Declare(
    libpqxx
    GIT_REPOSITORY https://github.com/jtv/libpqxx.git
    GIT_TAG 7.8.1
)
FetchContent_MakeAvailable(libpqxx)

find_package(PostgreSQL REQUIRED)
find_package(CURL REQUIRED)
find_package(OpenSSL REQUIRED)
find_package(Boost REQUIRED COMPONENTS system thread)

add_executable(polls_backend src/main.cpp)

target_link_libraries(polls_backend
    PRIVATE
    Crow::Crow
    nlohmann_json::nlohmann_json
    pqxx
    PostgreSQL::PostgreSQL
    CURL::libcurl
    OpenSSL::SSL
    OpenSSL::Crypto
    Boost::system
    Boost::thread
    pthread
)
