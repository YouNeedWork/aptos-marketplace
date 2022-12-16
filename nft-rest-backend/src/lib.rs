pub mod api;
pub mod db;
pub mod models;
pub mod schema;


#[derive(Debug,Clone)]
pub struct AppState {
    pub market_db:db::DbPool,
    pub index_db:db::DbPool,
}
