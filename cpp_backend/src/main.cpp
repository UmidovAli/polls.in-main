#include "crow.h"
#include <pqxx/pqxx>
#include <nlohmann/json.hpp>
#include <iostream>
#include <string>
#include <thread>
#include <chrono>

using json = nlohmann::json;

// Global DB connection pool placeholder
std::shared_ptr<pqxx::connection> db_conn;

void init_db() {
    std::string conn_str = "host=" + std::string(getenv("DB_HOST") ? getenv("DB_HOST") : "localhost") +
                           " port=" + std::string(getenv("DB_PORT") ? getenv("DB_PORT") : "5432") +
                           " dbname=" + std::string(getenv("DB_NAME") ? getenv("DB_NAME") : "polls_db") +
                           " user=" + std::string(getenv("DB_USER") ? getenv("DB_USER") : "postgres") +
                           " password=" + std::string(getenv("DB_PASSWORD") ? getenv("DB_PASSWORD") : "postgres");
    try {
        db_conn = std::make_shared<pqxx::connection>(conn_str);
        std::cout << "Connected to database successfully." << std::endl;
    } catch (const std::exception &e) {
        std::cerr << "Database connection failed: " << e.what() << std::endl;
        exit(1);
    }
}

void auto_close_polls() {
    while (true) {
        try {
            if (db_conn && db_conn->is_open()) {
                pqxx::work W(*db_conn);
                W.exec("UPDATE polls SET status = 'closed' WHERE status = 'active' AND ends_at <= CURRENT_TIMESTAMP");
                W.commit();
            }
        } catch (const std::exception &e) {
            std::cerr << "Error auto-closing polls: " << e.what() << std::endl;
        }
        std::this_thread::sleep_for(std::chrono::seconds(30));
    }
}

int main() {
    crow::SimpleApp app;

    init_db();

    std::thread poll_closer(auto_close_polls);
    poll_closer.detach();

    CROW_ROUTE(app, "/health")([](){
        return crow::response(200, "OK");
    });

    CROW_ROUTE(app, "/api/polls")
    .methods("GET"_method)([](const crow::request& req){
        try {
            pqxx::work W(*db_conn);
            pqxx::result R = W.exec("SELECT id, title, description, status, ends_at FROM polls ORDER BY created_at DESC");
            
            json polls = json::array();
            for (auto row : R) {
                polls.push_back({
                    {"id", row[0].c_str()},
                    {"title", row[1].c_str()},
                    {"description", row[2].c_str()},
                    {"status", row[3].c_str()},
                    {"ends_at", row[4].c_str()}
                });
            }
            return crow::response(polls.dump());
        } catch (const std::exception &e) {
            return crow::response(500, std::string("Database error: ") + e.what());
        }
    });

    // Note: This is a simplified C++ backend skeleton.
    // A full implementation of OAuth, WebSockets, and all API endpoints
    // requires significantly more code and is provided as a starting point.

    app.port(8080).multithreaded().run();
}
